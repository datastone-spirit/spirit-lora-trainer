/*
 * @Author: mulingyuer
 * @Date: 2025-04-02 14:21:02
 * @LastEditTime: 2025-04-02 15:41:08
 * @LastEditors: mulingyuer
 * @Description: flux lora hooks
 * @FilePath: \frontend\src\hooks\useFluxLora\index.ts
 * 怎么可能会有bug！！！
 */
import { startFluxTraining } from "@/api/lora";
import type {
	QueryTaskStatus,
	QueryFluxTaskInfo,
	TrainingEvent,
	InitFluxTrainingTaskOptions
} from "./types";
export type * from "./types";
import mitt from "mitt";
import { useModalManagerStore, useTrainingStore } from "@/stores";
import type { FluxLoraData } from "@/stores";
import { loRATrainingInfo } from "@/api/monitor";
import type { LoRATrainingInfoResult } from "@/api/monitor";
import { calculatePercentage } from "@/utils/tools";
import { isNetworkError } from "@/request";

/** flux任务信息 */
const queryFluxTaskInfo = ref<QueryFluxTaskInfo>({
	taskId: "",
	status: "idle",
	timer: null,
	delay: 8000
});
/** flux任务事件订阅 */
const fluxEvents = mitt<TrainingEvent>();

/** 开始查询flux训练任务信息 */
function startQueryFluxTask(taskId: string) {
	if (!canQueryFluxTask(queryFluxTaskInfo.value.status)) return;
	if (typeof taskId !== "string" || taskId.trim() === "") {
		console.warn("查询任务没有提供任务ID，本次查询已跳过");
		return;
	}

	// 更新状态
	queryFluxTaskInfo.value.status = "querying";
	queryFluxTaskInfo.value.taskId = taskId;

	const trainingStore = useTrainingStore();
	trainingStore.setFluxLoraIsListen(true);
	trainingStore.setCurrentTaskType("flux");

	queryFluxTask();
}

/** 暂停查询Flux训练任务信息 */
function pauseQueryFluxTask() {
	if (queryFluxTaskInfo.value.status !== "querying") return;

	// 更新状态
	queryFluxTaskInfo.value.status = "paused";

	// 清理定时器
	if (queryFluxTaskInfo.value.timer) {
		clearTimeout(queryFluxTaskInfo.value.timer);
		queryFluxTaskInfo.value.timer = null;
	}
}

/** 继续查询flux训练任务信息 */
function resumeQueryFluxTask() {
	if (queryFluxTaskInfo.value.status !== "paused") return;

	// 更新状态
	queryFluxTaskInfo.value.status = "querying";

	const trainingStore = useTrainingStore();
	trainingStore.setFluxLoraIsListen(true);
	trainingStore.setCurrentTaskType("flux");

	// 立即查询
	queryFluxTask();
}

/** 停止查询flux训练任务信息 */
function stopQueryFluxTask() {
	if (queryFluxTaskInfo.value.status === "idle") return;

	// 更新状态
	queryFluxTaskInfo.value.status = "idle";

	const trainingStore = useTrainingStore();
	trainingStore.setFluxLoraIsListen(false);
	trainingStore.setCurrentTaskType("none");

	// 清理定时器
	if (queryFluxTaskInfo.value.timer) {
		clearTimeout(queryFluxTaskInfo.value.timer);
		queryFluxTaskInfo.value.timer = null;
	}
}

/** 初始化flux训练：已经通过api取得了任务数据的情况下 */
function initQueryFluxTask(options: InitFluxTrainingTaskOptions) {
	const { id, status } = options.taskData;

	// 如果已经完成或者失败，不做任何操作
	if (status === "complete" || status === "failed") return;

	// 更新状态
	const trainingStore = useTrainingStore();
	trainingStore.setFluxLoraIsListen(true);
	trainingStore.setCurrentTaskType("flux");
	queryFluxTaskInfo.value.status = "querying";
	queryFluxTaskInfo.value.taskId = id;
	// 更新当前任务状态和创建查询任务
	handleQuerySuccess(options.taskData);

	options.showTaskStartPrompt &&
		ElMessage({
			message: "当前正在训练...",
			type: "info"
		});
}

/** 查询flux训练任务信息 */
function queryFluxTask() {
	if (queryFluxTaskInfo.value.status !== "querying") return;
	const taskId = queryFluxTaskInfo.value.taskId;
	if (typeof taskId !== "string" || taskId.trim() === "") return;

	// api
	loRATrainingInfo({ task_id: taskId }).then(handleQuerySuccess).catch(handleQueryFailure);
}

/** 查询flux训练任务信息统一成功处理 */
function handleQuerySuccess(res: LoRATrainingInfoResult) {
	const trainingStore = useTrainingStore();
	const modalManagerStore = useModalManagerStore();

	// 更新flux任务的数据
	trainingStore.setFluxLoraData(formatFluxTaskData(res));
	modalManagerStore.setNetworkDisconnectModal(false);
	fluxEvents.emit("update");

	// 根据状态处理下一步
	switch (res.status) {
		case "complete": // 训练完成
			queryFluxTaskInfo.value.status = "success";
			trainingStore.resetFluxLoraData();
			trainingStore.setFluxLoraIsListen(false);
			trainingStore.setCurrentTaskType("none");
			fluxEvents.emit("complete");

			ElMessageBox({
				title: "训练完成",
				type: "success",
				showCancelButton: false,
				confirmButtonText: "知道了",
				message: "LoRA训练成功，请检查保存目录下的LoRA模型文件"
			});
			break;
		case "failed": // 训练失败
			queryFluxTaskInfo.value.status = "failure";
			trainingStore.resetFluxLoraData();
			trainingStore.setFluxLoraIsListen(false);
			trainingStore.setCurrentTaskType("none");
			fluxEvents.emit("failed");

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
			queryFluxTaskInfo.value.timer = setTimeout(queryFluxTask, queryFluxTaskInfo.value.delay);
	}
}

/** 查询flux训练任务信息统一错误处理 */
function handleQueryFailure(error: any) {
	const status = error?.status ?? 0;
	const is5xxError = status >= 500 && status < 600;

	// 如果是网络错误或者5xx错误，弹出网络连接错误提示
	if (isNetworkError(error) || is5xxError) {
		const modalManagerStore = useModalManagerStore();
		modalManagerStore.setNetworkDisconnectModal(true);
		// 继续查询
		queryFluxTaskInfo.value.timer = setTimeout(queryFluxTask, queryFluxTaskInfo.value.delay);
		return;
	}

	// 更新状态
	const trainingStore = useTrainingStore();
	queryFluxTaskInfo.value.status = "failure";
	trainingStore.resetFluxLoraData();
	trainingStore.setFluxLoraIsListen(false);
	fluxEvents.emit("failed");

	console.error("查询flux训练任务信息出错：", error);
}

/** 允许查询的状态 */
const canQueryFluxTaskStatus: Array<QueryTaskStatus> = ["idle", "success", "failure"];
/** 允许再次查询 */
function canQueryFluxTask(status: QueryTaskStatus) {
	if (typeof status !== "string") {
		console.error("检查查询任务状态时，状态参数不是字符串：", status);
		return false;
	}
	return canQueryFluxTaskStatus.includes(status);
}

/** 格式化flux训练任务信息 */
function formatFluxTaskData(res: LoRATrainingInfoResult): FluxLoraData {
	let detail = res?.detail ?? {};
	if (typeof detail === "string") detail = {};

	const loraData: FluxLoraData = {
		current: detail.current ?? 0,
		elapsed: detail.elapsed ?? "00:00",
		loss: detail.loss ?? 0,
		loss_avr: detail.loss_avr ?? 0,
		remaining: detail.remaining ?? "00:00",
		speed: detail.speed ?? 0,
		total: detail.total ?? 0,
		progress: 0,
		showSampling: res.is_sampling ?? false,
		samplingPath: res.sampling_path ?? "",
		raw: res
	};
	loraData.progress = calculatePercentage(loraData.current, loraData.total);

	return loraData;
}

export function useFluxLora() {
	const trainingStore = useTrainingStore();
	const { monitorFluxLoraData } = storeToRefs(trainingStore);

	return {
		startFluxTraining,
		startQueryFluxTask,
		pauseQueryFluxTask,
		resumeQueryFluxTask,
		stopQueryFluxTask,
		initQueryFluxTask,
		handleQuerySuccess,
		handleQueryFailure,
		canQueryFluxTask,
		monitorFluxLoraData,
		queryFluxTaskInfo,
		fluxEvents
	};
}
