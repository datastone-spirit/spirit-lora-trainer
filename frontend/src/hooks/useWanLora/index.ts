/*
 * @Author: mulingyuer
 * @Date: 2025-03-28 10:45:50
 * @LastEditTime: 2025-03-28 16:02:46
 * @LastEditors: mulingyuer
 * @Description: 训练wan lora的hooks
 * @FilePath: \frontend\src\hooks\useWanLora\index.ts
 * 怎么可能会有bug！！！
 */
import { startWanVideoTraining } from "@/api/lora";
import type {
	QueryTaskStatus,
	TrainingEvent,
	QueryWanTaskInfo,
	InitWanTrainingTaskOptions
} from "./types";
import mitt from "mitt";
import { useModalManagerStore, useTrainingStore, type WanLoraData } from "@/stores";
import { wanVideoTrainingInfo, type WanVideoTrainingInfoResult } from "@/api/monitor";
import { calculatePercentage } from "@/utils/tools";
import { isNetworkError } from "@/request";

/** wan任务信息 */
const queryWanTaskInfo = ref<QueryWanTaskInfo>({
	taskId: "",
	status: "idle",
	timer: null,
	delay: 3000
});
/** wan任务事件订阅 */
const wanEvents = mitt<TrainingEvent>();

/** 开始查询wan训练任务信息 */
function startQueryWanTask(taskId: string) {
	if (!canQueryTagTask(queryWanTaskInfo.value.status)) return;
	if (typeof taskId !== "string" || taskId.trim() === "") {
		console.warn("查询打标任务没有提供任务ID，本次查询已跳过");
		return;
	}

	// 更新状态
	queryWanTaskInfo.value.status = "querying";
	queryWanTaskInfo.value.taskId = taskId;

	const trainingStore = useTrainingStore();
	trainingStore.setWanLoraIsListen(true);

	queryWanTask();
}

/** 暂停查询wan训练任务信息 */
function pauseQueryWanTask() {
	if (queryWanTaskInfo.value.status === "querying") return;

	// 更新状态
	queryWanTaskInfo.value.status = "paused";

	const trainingStore = useTrainingStore();
	trainingStore.setWanLoraIsListen(false);

	// 清理定时器
	if (queryWanTaskInfo.value.timer) {
		clearTimeout(queryWanTaskInfo.value.timer);
		queryWanTaskInfo.value.timer = null;
	}
}

/** 继续查询wan训练任务信息 */
function resumeQueryWanTask() {
	if (queryWanTaskInfo.value.status !== "paused") return;

	// 更新状态
	queryWanTaskInfo.value.status = "querying";

	const trainingStore = useTrainingStore();
	trainingStore.setWanLoraIsListen(true);

	// 立即查询
	queryWanTask();
}

/** 停止查询wan训练任务信息 */
function stopQueryWanTask() {
	if (queryWanTaskInfo.value.status === "idle") return;

	// 更新状态
	queryWanTaskInfo.value.status = "idle";

	const trainingStore = useTrainingStore();
	trainingStore.setWanLoraIsListen(false);

	// 清理定时器
	if (queryWanTaskInfo.value.timer) {
		clearTimeout(queryWanTaskInfo.value.timer);
		queryWanTaskInfo.value.timer = null;
	}
}

/** 初始化wan训练：已经通过api取得了任务数据的情况下 */
function initQueryWanTask(options: InitWanTrainingTaskOptions) {
	const { id, status } = options.wanTaskData;

	// 如果已经完成或者失败，不做任何操作
	if (status === "complete" || status === "failed") return;

	// 更新状态
	const trainingStore = useTrainingStore();
	trainingStore.setWanLoraIsListen(true);
	queryWanTaskInfo.value.status = "querying";
	queryWanTaskInfo.value.taskId = id;
	// 更新当前任务状态和创建查询任务
	handleQuerySuccess(options.wanTaskData);

	options.showTaskStartPrompt &&
		ElMessage({
			message: "当前正在训练...",
			type: "info"
		});
}

/** 查询wan训练任务信息 */
function queryWanTask() {
	if (queryWanTaskInfo.value.status !== "querying") return;
	const taskId = queryWanTaskInfo.value.taskId;
	if (typeof taskId !== "string" || taskId.trim() === "") return;

	// api
	wanVideoTrainingInfo({ task_id: taskId }).then(handleQuerySuccess).catch(handleQueryFailure);
}

/** 查询wan训练任务信息统一成功处理 */
function handleQuerySuccess(res: WanVideoTrainingInfoResult) {
	const trainingStore = useTrainingStore();
	const modalManagerStore = useModalManagerStore();

	// 更新打标任务的数据
	trainingStore.setTagData(formatWanTaskData(res));
	modalManagerStore.setNetworkDisconnectModal(false);
	wanEvents.emit("update");

	// 根据状态处理下一步
	switch (res.status) {
		case "complete": // 训练完成
			queryWanTaskInfo.value.status = "success";
			trainingStore.resetWanLoraData();
			trainingStore.setWanLoraIsListen(false);
			wanEvents.emit("complete");

			ElMessageBox({
				title: "训练完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
			});
			break;
		case "failed": // 训练失败
			queryWanTaskInfo.value.status = "failure";
			trainingStore.resetWanLoraData();
			trainingStore.setWanLoraIsListen(false);
			wanEvents.emit("failed");

			ElMessageBox({
				title: "训练失败",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练失败，请检查日志或者重新训练"
			});
			break;
		case "running":
		case "created":
		default:
			// 继续查询
			queryWanTaskInfo.value.timer = setTimeout(queryWanTask, queryWanTaskInfo.value.delay);
	}
}

/** 查询wan训练任务信息统一错误处理 */
function handleQueryFailure(error: any) {
	const status = error?.status ?? 0;
	const is5xxError = status >= 500 && status < 600;

	// 如果是网络错误或者5xx错误，弹出网络连接错误提示
	if (isNetworkError(error) || is5xxError) {
		const modalManagerStore = useModalManagerStore();
		modalManagerStore.setNetworkDisconnectModal(true);
		// 继续查询
		queryWanTaskInfo.value.timer = setTimeout(queryWanTask, queryWanTaskInfo.value.delay);
		return;
	}

	// 更新状态
	const trainingStore = useTrainingStore();
	queryWanTaskInfo.value.status = "failure";
	trainingStore.resetWanLoraData();
	trainingStore.setWanLoraIsListen(false);
	wanEvents.emit("failed");

	console.error("查询wan训练任务信息出错：", error);
}

/** 允许查询的状态 */
const canQueryTagTaskStatus: Array<QueryTaskStatus> = ["idle", "success", "failure"];
/** 允许再次查询 */
function canQueryTagTask(status: QueryTaskStatus) {
	if (typeof status !== "string") {
		console.error("检查查询打标任务状态时，状态参数不是字符串：", status);
		return false;
	}
	return canQueryTagTaskStatus.includes(status);
}

/** 格式化wan训练任务信息 */
function formatWanTaskData(res: WanVideoTrainingInfoResult): WanLoraData {
	const detail = res?.detail ?? {};

	const current = detail?.current >= 0 ? detail.current : 0;
	const total = detail?.total ?? 0;
	return {
		current,
		total: total,
		progress: calculatePercentage(current, total)
	};
}

export function useWanLora() {
	const trainingStore = useTrainingStore();
	const { monitorWanLoraData } = storeToRefs(trainingStore);

	return {
		startWanVideoTraining,
		startQueryWanTask,
		pauseQueryWanTask,
		resumeQueryWanTask,
		stopQueryWanTask,
		initQueryWanTask,
		handleQuerySuccess,
		handleQueryFailure,
		canQueryTagTask,
		monitorWanLoraData,
		queryWanTaskInfo,
		wanEvents
	};
}
