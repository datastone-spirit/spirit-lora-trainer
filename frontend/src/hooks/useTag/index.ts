/*
 * @Author: mulingyuer
 * @Date: 2025-03-20 11:17:50
 * @LastEditTime: 2025-04-01 11:41:04
 * @LastEditors: mulingyuer
 * @Description: 打标hooks
 * @FilePath: \frontend\src\hooks\useTag\index.ts
 * 怎么可能会有bug！！！
 */
import { batchTag } from "@/api/tag";
import type {
	TagOptions,
	ValidateTagOptions,
	ValidateTagResult,
	ValidateTagRules,
	BatchTagData,
	QueryTagTaskInfo,
	QueryTagTaskStatus,
	TagData,
	TagEvents,
	InitQueryTagTaskOptions
} from "./types";
import { useTrainingStore } from "@/stores";
import { checkDirectory } from "@/utils/lora.helper";
import { manualTagInfo, type ManualTagInfoResult } from "@/api/monitor";
import { calculatePercentage } from "@/utils/tools";
import mitt from "mitt";

/** 打标 */
async function tag(options: TagOptions) {
	// 先校验参数
	const validateResult = await validateTag({
		...options,
		showErrorMessage: true
	});
	if (!validateResult.isValid) throw new Error(validateResult.message);

	// api
	const apiData: BatchTagData = {
		image_path: options.tagDir,
		model_name: options.tagModel,
		prompt_type: options.joyCaptionPromptType ?? "",
		class_token: options.isAddGlobalPrompt ? (options.globalPrompt ?? "") : "",
		global_prompt: isJoyCaption2Model(options.tagModel) ? options.tagPrompt : "",
		is_append: options.isAppend
	};
	const apiResult = await batchTag(apiData);

	options.showTaskStartPrompt &&
		ElMessage({
			message: "正在打标...",
			type: "success"
		});

	return apiResult;
}

/** 打标前校验 */
async function validateTag(options: ValidateTagOptions): Promise<ValidateTagResult> {
	const trainingStore = useTrainingStore();
	const {
		tagDir,
		tagModel,
		isAddGlobalPrompt,
		globalPrompt,
		joyCaptionPromptType,
		showErrorMessage
	} = options;

	const rules: ValidateTagRules = [
		{
			condition: () => trainingStore.useGPU,
			message: "GPU已经被占用，请等待对应任务完成再执行打标"
		},
		{
			condition: () => typeof tagDir !== "string" || tagDir.trim() === "",
			message: "请先选择训练用的数据集目录"
		},
		{
			condition: async () => !(await checkDirectory(tagDir)),
			message: "数据集目录不存在"
		},
		{
			condition: () => typeof tagModel !== "string" || tagModel.trim() === "",
			message: "请先选择打标模型"
		},
		{
			condition: () => {
				if (!isJoyCaption2Model(tagModel)) return false;
				if (typeof joyCaptionPromptType !== "string" || joyCaptionPromptType.trim() === "")
					return true;

				return false;
			},
			message: "请选择 Joy Caption2 的提示词类型"
		},
		{
			condition: () => {
				if (!isAddGlobalPrompt) return false;
				if (typeof globalPrompt !== "string" || globalPrompt.trim() === "") return true;
				return false;
			},
			message: "请填写触发词"
		}
	];

	for (const rule of rules) {
		if (await rule.condition()) {
			showErrorMessage &&
				ElMessage({
					message: rule.message,
					type: "error"
				});

			return {
				isValid: false,
				message: rule.message
			};
		}
	}

	return {
		isValid: true,
		message: ""
	};
}

/** 是否是Joy Caption2打标模型 */
function isJoyCaption2Model(tagModel: string) {
	return tagModel === "joy-caption-alpha-two";
}

/** 打标任务信息 */
const queryTagTaskInfo = ref<QueryTagTaskInfo>({
	taskId: "",
	status: "idle",
	timer: null,
	delay: 3000
});
/** 打标事件订阅 */
const tagEvents = mitt<TagEvents>();

/** 开始查询打标任务信息 */
function startQueryTagTask(taskId: string) {
	if (!canQueryTagTask(queryTagTaskInfo.value.status)) return;
	if (typeof taskId !== "string" || taskId.trim() === "") {
		console.warn("查询打标任务没有提供任务ID，本次查询已跳过");
		return;
	}

	// 更新状态
	queryTagTaskInfo.value.status = "querying";
	queryTagTaskInfo.value.taskId = taskId;

	const trainingStore = useTrainingStore();
	trainingStore.setTagIsListen(true);

	queryTagTask();
}

/** 暂停查询打标任务信息 */
function pauseQueryTagTask() {
	if (queryTagTaskInfo.value.status !== "querying") return;

	// 更新状态
	queryTagTaskInfo.value.status = "paused";

	// 清理定时器
	if (queryTagTaskInfo.value.timer) {
		clearTimeout(queryTagTaskInfo.value.timer);
		queryTagTaskInfo.value.timer = null;
	}
}

/** 继续查询打标任务信息 */
function resumeQueryTagTask() {
	if (queryTagTaskInfo.value.status !== "paused") return;

	// 更新状态
	queryTagTaskInfo.value.status = "querying";

	const trainingStore = useTrainingStore();
	trainingStore.setTagIsListen(true);

	// 立即查询
	queryTagTask();
}

/** 停止查询打标任务信息 */
function stopQueryTagTask() {
	if (queryTagTaskInfo.value.status === "idle") return;

	// 更新状态
	queryTagTaskInfo.value.status = "idle";

	const trainingStore = useTrainingStore();
	trainingStore.setTagIsListen(false);

	// 清理定时器
	if (queryTagTaskInfo.value.timer) {
		clearTimeout(queryTagTaskInfo.value.timer);
		queryTagTaskInfo.value.timer = null;
	}
}

/** 初始化打标：已经通过api取得了任务数据的情况下 */
function initQueryTagTask(options: InitQueryTagTaskOptions) {
	const { id, status } = options.tagTaskData;

	// 如果已经完成或者失败，不做任何操作
	if (status === "complete" || status === "failed") return;

	// 更新状态
	const trainingStore = useTrainingStore();
	trainingStore.setTagIsListen(true);
	queryTagTaskInfo.value.status = "querying";
	queryTagTaskInfo.value.taskId = id;
	// 更新当前任务状态和创建查询任务
	handleQuerySuccess(options.tagTaskData);

	options.showTaskStartPrompt &&
		ElMessage({
			message: "当前正在打标...",
			type: "info"
		});
}

/** 查询打标任务信息 */
function queryTagTask() {
	if (queryTagTaskInfo.value.status !== "querying") return;
	const taskId = queryTagTaskInfo.value.taskId;
	if (typeof taskId !== "string" || taskId.trim() === "") return;

	// api
	manualTagInfo({ task_id: taskId }).then(handleQuerySuccess).catch(handleQueryFailure);
}

/** 查询打标任务信息统一成功处理 */
function handleQuerySuccess(res: ManualTagInfoResult) {
	const trainingStore = useTrainingStore();

	// 更新打标任务的数据
	trainingStore.setTagData(formatTagTaskData(res));
	tagEvents.emit("update");

	// 根据状态处理下一步
	switch (res.status) {
		case "complete": // 打标完成
			queryTagTaskInfo.value.status = "success";
			trainingStore.resetTagData();
			trainingStore.setTagIsListen(false);
			tagEvents.emit("complete");

			ElMessageBox({
				title: "打标完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "打标完成，可以开始训练LoRA了"
			});
			break;
		case "failed": // 打标失败
			queryTagTaskInfo.value.status = "failure";
			trainingStore.resetTagData();
			trainingStore.setTagIsListen(false);
			tagEvents.emit("failed");

			ElMessageBox({
				title: "打标失败",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "打标失败，请检查日志或者重新打标"
			});
			break;
		case "running":
		case "created":
		default:
			// 继续查询
			queryTagTaskInfo.value.timer = setTimeout(queryTagTask, queryTagTaskInfo.value.delay);
	}
}

/** 查询打标任务信息统一错误处理 */
function handleQueryFailure(error: any) {
	const trainingStore = useTrainingStore();

	queryTagTaskInfo.value.status = "failure";
	trainingStore.resetTagData();
	trainingStore.setTagIsListen(false);
	tagEvents.emit("failed");

	console.error("查询打标任务信息出错：", error);
}

/** 允许查询的状态 */
const canQueryTagTaskStatus: Array<QueryTagTaskStatus> = ["idle", "success", "failure"];
/** 允许再次查询 */
function canQueryTagTask(status: QueryTagTaskStatus) {
	if (typeof status !== "string") {
		console.error("检查查询打标任务状态时，状态参数不是字符串：", status);
		return false;
	}
	return canQueryTagTaskStatus.includes(status);
}

/** 格式化打标任务信息 */
function formatTagTaskData(res: ManualTagInfoResult): TagData {
	const detail = res?.detail ?? {};

	const current = detail?.current >= 0 ? detail.current : 0;
	const total = detail?.total ?? 0;
	return {
		current,
		total: total,
		progress: calculatePercentage(current, total)
	};
}

/** 打标hooks */
export function useTag() {
	const trainingStore = useTrainingStore();
	const { monitorTagData } = storeToRefs(trainingStore);

	return {
		tag,
		validateTag,
		isJoyCaption2Model,
		startQueryTagTask,
		pauseQueryTagTask,
		resumeQueryTagTask,
		stopQueryTagTask,
		initQueryTagTask,
		handleQuerySuccess,
		handleQueryFailure,
		canQueryTagTask,
		tagEvents,
		monitorTagData,
		queryTagTaskInfo
	};
}
