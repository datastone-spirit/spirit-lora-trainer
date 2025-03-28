/*
 * @Author: mulingyuer
 * @Date: 2025-03-28 14:49:56
 * @LastEditTime: 2025-03-28 15:16:40
 * @LastEditors: mulingyuer
 * @Description: gpu hooks
 * @FilePath: \frontend\src\hooks\useGPU\index.ts
 * 怎么可能会有bug！！！
 */
export type * from "./types";
import { gpuMonitorInfo, type GPUMonitorInfoResult } from "@/api/monitor";
import { useTrainingStore, type GPUData } from "@/stores";
import { calculatePercentage } from "@/utils/tools";
import type { QueryGPUInfo, QueryGPUStatus } from "./types";

/** GPU信息 */
const queryGPUInfo = ref<QueryGPUInfo>({
	status: "idle",
	timer: null,
	delay: 3000
});

/** 开始查询GPU信息 */
function startQueryGPUInfo() {
	if (!canGPUQuery(queryGPUInfo.value.status)) return;

	// 更新状态
	queryGPUInfo.value.status = "querying";

	const trainingStore = useTrainingStore();
	trainingStore.setGPUIsListen(true);

	queryGPU();
}

/** 暂停查询GPU信息 */
function pauseQueryGPUInfo() {
	if (queryGPUInfo.value.status !== "querying") return;

	// 更新状态
	queryGPUInfo.value.status = "paused";

	const trainingStore = useTrainingStore();
	trainingStore.setGPUIsListen(false);

	// 清理定时器
	if (queryGPUInfo.value.timer) {
		clearTimeout(queryGPUInfo.value.timer);
		queryGPUInfo.value.timer = null;
	}
}

/** 继续查询GPU信息 */
function resumeQueryGPUInfo() {
	if (queryGPUInfo.value.status !== "paused") return;

	// 更新状态
	queryGPUInfo.value.status = "querying";

	const trainingStore = useTrainingStore();
	trainingStore.setGPUIsListen(true);

	// 立即查询
	queryGPU();
}

/** 停止查询GPU信息 */
function stopQueryGPUInfo() {
	if (queryGPUInfo.value.status === "idle") return;

	// 更新状态
	queryGPUInfo.value.status = "idle";

	const trainingStore = useTrainingStore();
	trainingStore.setGPUIsListen(false);

	// 清理定时器
	if (queryGPUInfo.value.timer) {
		clearTimeout(queryGPUInfo.value.timer);
		queryGPUInfo.value.timer = null;
	}
}

/** 查询GPU信息 */
function queryGPU() {
	if (queryGPUInfo.value.status !== "querying") return;

	// api
	gpuMonitorInfo().then(handleQuerySuccess).catch(handleQueryFailure);
}

/** 查询GPU信息统一成功处理 */
function handleQuerySuccess(res: GPUMonitorInfoResult) {
	// 更新数据
	const result = res[0];
	if (result) {
		const trainingStore = useTrainingStore();
		trainingStore.setGPUData(formatGPUData(res));
	}

	// 继续查询
	queryGPUInfo.value.timer = setTimeout(queryGPU, queryGPUInfo.value.delay);
}

/** 查询打标任务信息统一错误处理 */
function handleQueryFailure(error: any) {
	console.error("查询GPU信息失败：", error);
}

/** 允许查询的状态 */
const canGPUQueryStatus: Array<QueryGPUStatus> = ["idle", "success", "failure"];
/** 允许再次查询 */
function canGPUQuery(status: QueryGPUStatus) {
	if (typeof status !== "string") {
		console.error("检查查询GPU状态时，状态参数不是字符串：", status);
		return false;
	}
	return canGPUQueryStatus.includes(status);
}

/** 格式化GPU信息 */
function formatGPUData(res: GPUMonitorInfoResult): GPUData {
	const firstData = res[0];

	return {
		gpuMemory: calculatePercentage(firstData.memory_used_mb, firstData.memory_total_mb),
		gpuPower: calculatePercentage(firstData.power_draw_watts, firstData.power_total_watts),
		gpuList: res
	};
}

export function useGPU() {
	const trainingStore = useTrainingStore();
	const { monitorGPUData } = storeToRefs(trainingStore);

	return {
		startQueryGPUInfo,
		pauseQueryGPUInfo,
		resumeQueryGPUInfo,
		stopQueryGPUInfo,
		handleQuerySuccess,
		handleQueryFailure,
		canGPUQuery,
		monitorGPUData,
		queryGPUInfo
	};
}
