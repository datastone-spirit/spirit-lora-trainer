/*
 * @Author: mulingyuer
 * @Date: 2025-04-02 15:11:24
 * @LastEditTime: 2025-04-03 09:00:45
 * @LastEditors: mulingyuer
 * @Description: 混元视频hooks
 * @FilePath: \frontend\src\hooks\useHYLora\index.ts
 * 怎么可能会有bug！！！
 */
import { startHyVideoTraining } from "@/api/lora";
import type {
	QueryHYTaskInfo,
	QueryTaskStatus,
	TrainingEvent,
	InitHYTrainingTaskOptions
} from "./types";
export type * from "./types";
import mitt from "mitt";
import { useModalManagerStore, useTrainingStore } from "@/stores";
import type { HYLoraData } from "@/stores";
import { hyVideoTrainingInfo } from "@/api/monitor";
import type { HyVideoTrainingInfoResult } from "@/api/monitor";
import { calculatePercentage } from "@/utils/tools";
import { isNetworkError } from "@/request";
import BigNumber from "bignumber.js";

/** 混元任务信息 */
const queryHYTaskInfo = ref<QueryHYTaskInfo>({
	taskId: "",
	status: "idle",
	timer: null,
	delay: 8000
});
/** 混元任务事件订阅 */
const hyEvents = mitt<TrainingEvent>();

/** 开始查询hy训练任务信息 */
function startQueryHYTask(taskId: string) {
	if (!canQueryHYTask(queryHYTaskInfo.value.status)) return;
	if (typeof taskId !== "string" || taskId.trim() === "") {
		console.warn("查询任务没有提供任务ID，本次查询已跳过");
		return;
	}

	// 更新状态
	queryHYTaskInfo.value.status = "querying";
	queryHYTaskInfo.value.taskId = taskId;

	const trainingStore = useTrainingStore();
	trainingStore.setHYLoraIsListen(true);
	trainingStore.setCurrentTaskType("hunyuan-video");

	queryHYTask();
}

/** 暂停查询HY训练任务信息 */
function pauseQueryHYTask() {
	if (queryHYTaskInfo.value.status !== "querying") return;

	// 更新状态
	queryHYTaskInfo.value.status = "paused";

	// 清理定时器
	if (queryHYTaskInfo.value.timer) {
		clearTimeout(queryHYTaskInfo.value.timer);
		queryHYTaskInfo.value.timer = null;
	}
}

/** 继续查询hy训练任务信息 */
function resumeQueryHYTask() {
	if (queryHYTaskInfo.value.status !== "paused") return;

	// 更新状态
	queryHYTaskInfo.value.status = "querying";

	const trainingStore = useTrainingStore();
	trainingStore.setHYLoraIsListen(true);
	trainingStore.setCurrentTaskType("hunyuan-video");

	// 立即查询
	queryHYTask();
}

/** 停止查询hy训练任务信息 */
function stopQueryHYTask() {
	if (queryHYTaskInfo.value.status === "idle") return;

	// 更新状态
	queryHYTaskInfo.value.status = "idle";

	const trainingStore = useTrainingStore();
	trainingStore.setHYLoraIsListen(false);
	trainingStore.setCurrentTaskType("none");

	// 清理定时器
	if (queryHYTaskInfo.value.timer) {
		clearTimeout(queryHYTaskInfo.value.timer);
		queryHYTaskInfo.value.timer = null;
	}
}

/** 初始化hy训练：已经通过api取得了任务数据的情况下 */
function initQueryHYTask(options: InitHYTrainingTaskOptions) {
	const { id, status } = options.wanTaskData;

	// 如果已经完成或者失败，不做任何操作
	if (status === "complete" || status === "failed") return;

	// 更新状态
	const trainingStore = useTrainingStore();
	trainingStore.setHYLoraIsListen(true);
	trainingStore.setCurrentTaskType("hunyuan-video");
	queryHYTaskInfo.value.status = "querying";
	queryHYTaskInfo.value.taskId = id;
	// 更新当前任务状态和创建查询任务
	handleQuerySuccess(options.wanTaskData);

	options.showTaskStartPrompt &&
		ElMessage({
			message: "当前正在训练...",
			type: "info"
		});
}

/** 查询hy训练任务信息 */
function queryHYTask() {
	if (queryHYTaskInfo.value.status !== "querying") return;
	const taskId = queryHYTaskInfo.value.taskId;
	if (typeof taskId !== "string" || taskId.trim() === "") return;

	// api
	hyVideoTrainingInfo({ task_id: taskId }).then(handleQuerySuccess).catch(handleQueryFailure);
}

/** 查询wan训练任务信息统一成功处理 */
function handleQuerySuccess(res: HyVideoTrainingInfoResult) {
	const trainingStore = useTrainingStore();
	const modalManagerStore = useModalManagerStore();

	// 更新wan任务的数据
	trainingStore.setHYLoraData(formatHYTaskData(res));
	modalManagerStore.setNetworkDisconnectModal(false);
	hyEvents.emit("update");

	// 根据状态处理下一步
	switch (res.status) {
		case "complete": // 训练完成
			queryHYTaskInfo.value.status = "success";
			trainingStore.resetHYLoraData();
			trainingStore.setHYLoraIsListen(false);
			trainingStore.setCurrentTaskType("none");
			hyEvents.emit("complete");

			ElMessageBox({
				title: "训练完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
			});
			break;
		case "failed": // 训练失败
			queryHYTaskInfo.value.status = "failure";
			trainingStore.resetHYLoraData();
			trainingStore.setHYLoraIsListen(false);
			trainingStore.setCurrentTaskType("none");
			hyEvents.emit("failed");

			ElMessageBox({
				title: "训练失败",
				type: "error",
				showCancelButton: true,
				cancelButtonText: "查看日志",
				confirmButtonText: "知道了",
				message: "LoRA训练失败，请检查日志或者重新训练"
			}).catch(() => {
				modalManagerStore.setLoraTaskLogModal({
					open: true,
					taskId: queryHYTaskInfo.value.taskId
				});
			});
			break;
		case "running":
		case "created":
		default:
			// 继续查询
			queryHYTaskInfo.value.timer = setTimeout(queryHYTask, queryHYTaskInfo.value.delay);
	}
}

/** 查询hy训练任务信息统一错误处理 */
function handleQueryFailure(error: any) {
	const status = error?.status ?? 0;
	const is5xxError = status >= 500 && status < 600;

	// 如果是网络错误或者5xx错误，弹出网络连接错误提示
	if (isNetworkError(error) || is5xxError) {
		const modalManagerStore = useModalManagerStore();
		modalManagerStore.setNetworkDisconnectModal(true);
		// 继续查询
		queryHYTaskInfo.value.timer = setTimeout(queryHYTask, queryHYTaskInfo.value.delay);
		return;
	}

	// 更新状态
	const trainingStore = useTrainingStore();
	queryHYTaskInfo.value.status = "failure";
	trainingStore.resetHYLoraData();
	trainingStore.setHYLoraIsListen(false);
	hyEvents.emit("failed");

	console.error("查询混元训练任务信息出错：", error);
}

/** 允许查询的状态 */
const canQueryHYTaskStatus: Array<QueryTaskStatus> = ["idle", "success", "failure"];
/** 允许再次查询 */
function canQueryHYTask(status: QueryTaskStatus) {
	if (typeof status !== "string") {
		console.error("检查查询任务状态时，状态参数不是字符串：", status);
		return false;
	}
	return canQueryHYTaskStatus.includes(status);
}

/** 格式化hy训练任务信息 */
function formatHYTaskData(res: HyVideoTrainingInfoResult): HYLoraData {
	const detail = typeof res.detail === "string" ? {} : (res?.detail ?? {});

	const loraData: HYLoraData = {
		current: detail.current ?? 0,
		total: "??",
		elapsed: detail.elapsed ?? 0,
		epoch_elapsed: 0,
		estimate_elapsed: 0,
		loss: detail.loss ?? 0,
		epoch_loss: detail.epoch_loss ?? 0,
		progress: 0,
		current_epoch: detail.current_epoch ?? "??",
		total_epoch: detail.total_epoch ?? "??",
		raw: res
	};

	// 只有第一轮结束后才有预估每轮步数 estimate_steps_per_epoch
	// 第一轮是用轮数算百分比
	// 第二轮有预估每轮步数后用步数来算百分比
	const isPerEpoch = "current_epoch" in detail;
	let current = 0;
	let total = 0;
	if (!isPerEpoch) {
		// 第一轮
		current = 1;
		total = detail.total_epoch ?? 0;
		loraData.current_epoch = 1;
	} else {
		current = detail.current ?? 0;
		const current_epoch = detail.current_epoch ?? 0;
		const steps = Math.ceil(current / current_epoch); //每轮的步数
		const total_epoch = detail.total_epoch ?? 0;
		total = steps * total_epoch;

		loraData.total = total;
		loraData.epoch_elapsed = new BigNumber(loraData.elapsed)
			.dividedBy(detail.current_epoch ?? 1)
			.toNumber();
		loraData.estimate_elapsed = new BigNumber(loraData.epoch_elapsed)
			.multipliedBy(detail.total_epoch ?? 1)
			.toNumber();
	}

	loraData.progress = calculatePercentage(current, total);

	return loraData;
}

export function useHYLora() {
	const trainingStore = useTrainingStore();
	const { monitorHYLoraData } = storeToRefs(trainingStore);

	return {
		startHyVideoTraining,
		startQueryHYTask,
		pauseQueryHYTask,
		resumeQueryHYTask,
		stopQueryHYTask,
		initQueryHYTask,
		handleQuerySuccess,
		handleQueryFailure,
		canQueryHYTask,
		monitorHYLoraData,
		queryHYTaskInfo,
		hyEvents
	};
}
