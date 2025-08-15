/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:07
 * @LastEditTime: 2025-08-15 14:49:18
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据
 * @FilePath: \frontend\src\stores\modules\training\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type {
	CurrentTaskInfo,
	ResetCurrentTaskInfoData,
	SetCurrentTaskInfoData,
	TrainingFluxKontextLoRAData,
	TrainingFluxLoRAData,
	TrainingGPUData,
	TrainingHYLoRAData,
	TrainingQwenImageData,
	TrainingTagData,
	TrainingWanLoRAData
} from "./types";
import type {
	FluxKontextTrainingInfoResult,
	GPUMonitorInfoResult,
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	ManualTagInfoResult,
	QwenImageTrainingInfoResult,
	WanVideoTrainingInfoResult
} from "@/api/monitor";
import { calculatePercentage } from "@/utils/tools";
import BigNumber from "bignumber.js";
export type * from "./types";
import { resettableRef } from "@/utils/ref";

export const useTrainingStore = defineStore("training", () => {
	/** 当前任务信息 */
	const [currentTaskInfo, restoreCurrentTaskInfo] = resettableRef<CurrentTaskInfo>({
		type: "none",
		id: "",
		name: "",
		progress: 0
	});
	function setCurrentTaskInfo(data: SetCurrentTaskInfoData) {
		const { id, name, type, result } = data;

		// 先更新任务数据
		currentTaskInfo.value.id = id;
		currentTaskInfo.value.name = name;
		currentTaskInfo.value.type = type;

		// 根据任务类型更新训练数据
		// 训练数据更新时计算的进度再赋值给当前任务信息
		if (!result) return;
		switch (type) {
			case "none":
				break;
			case "tag":
				setTrainingTagData(result as ManualTagInfoResult);
				break;
			case "flux":
				setTrainingFluxLoRAData(result as LoRATrainingInfoResult);
				break;
			case "flux-kontext":
				setTrainingFluxKontextLoRAData(result as FluxKontextTrainingInfoResult);
				break;
			case "hunyuan-video":
				setTrainingHYLoRAData(result as HyVideoTrainingInfoResult);
				break;
			case "wan-video":
				setTrainingWanLoRAData(result as WanVideoTrainingInfoResult);
				break;
			case "qwen-image":
				setTrainingQwenImageLoRAData(result as QwenImageTrainingInfoResult);
				break;
			default:
				console.warn(`未知的任务类型: ${type}`);
				break;
		}
	}
	function resetCurrentTaskInfo(data: ResetCurrentTaskInfoData) {
		const { type } = data;

		// 先重置任务数据
		restoreCurrentTaskInfo();

		// 根据任务类型重置训练数据
		switch (type) {
			case "none":
				break;
			case "tag":
				resetTrainingTagData();
				break;
			case "flux":
				resetTrainingFluxLoRAData();
				break;
			case "flux-kontext":
				resetTrainingFluxKontextLoRAData();
				break;
			case "hunyuan-video":
				resetTrainingHYLoRAData();
				break;
			case "wan-video":
				resetTrainingWanLoRAData();
				break;
			case "qwen-image":
				resetTrainingQwenImageLoRAData();
				break;
			default:
				console.warn(`未知的任务类型: ${type}`);
				break;
		}
	}

	/** gpu是否在使用中 */
	const useGPU = computed(() => {
		return currentTaskInfo.value.type !== "none";
	});

	// gpu
	const [trainingGPUData, restoreTrainingGPUData] = resettableRef<TrainingGPUData>({
		data: {
			gpuPower: 0,
			gpuMemory: 0,
			gpuList: []
		},
		raw: null
	});
	function setTrainingGPUData(result: GPUMonitorInfoResult) {
		if (!result.length) {
			console.warn("设置GPU数据为空，请检查接口返回");
			return;
		}

		const oneItemData = result[0];
		trainingGPUData.value.data = {
			gpuMemory: calculatePercentage(oneItemData.memory_used_mb, oneItemData.memory_total_mb),
			gpuPower: calculatePercentage(oneItemData.power_draw_watts, oneItemData.power_total_watts),
			gpuList: result
		};
		trainingGPUData.value.raw = result;
	}
	function resetTrainingGPUData() {
		restoreTrainingGPUData();
	}

	// 打标
	const [trainingTagData, restoreTrainingTagData] = resettableRef<TrainingTagData>({
		data: {
			current: 0,
			total: 0
		},
		raw: null
	});
	function setTrainingTagData(result: ManualTagInfoResult) {
		const detail = result?.detail ?? {};
		const current = detail?.current >= 0 ? detail.current : 0;
		const total = detail?.total ?? 0;

		trainingTagData.value.data = {
			current,
			total: total
		};
		trainingTagData.value.raw = result;
		currentTaskInfo.value.progress = calculatePercentage(current, total);
	}
	function resetTrainingTagData() {
		restoreTrainingTagData();
	}

	/** flux lora 训练 */
	const [trainingFluxLoRAData, restoreTrainingFluxLoRAData] = resettableRef<TrainingFluxLoRAData>({
		data: {
			current: 0,
			elapsed: "",
			loss: 0,
			loss_avr: 0,
			remaining: "",
			speed: 0,
			total: 0,
			samplingPath: "",
			showSampling: false
		},
		raw: null
	});
	function setTrainingFluxLoRAData(result: LoRATrainingInfoResult) {
		let detail: Exclude<LoRATrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {};
		} else {
			detail = result.detail;
		}
		const current = detail.current ?? 0;
		const total = detail.total ?? 0;

		trainingFluxLoRAData.value.data = {
			current,
			elapsed: detail.elapsed ?? "00:00",
			loss: detail.loss ?? 0,
			loss_avr: detail.loss_avr ?? 0,
			remaining: detail.remaining ?? "00:00",
			speed: detail.speed ?? 0,
			total,
			showSampling: result.is_sampling ?? false,
			samplingPath: result.sampling_path ?? ""
		};
		trainingFluxLoRAData.value.raw = result;
		currentTaskInfo.value.progress = calculatePercentage(current, total);
	}
	function resetTrainingFluxLoRAData() {
		restoreTrainingFluxLoRAData();
	}

	/** flux kontext lora 训练 */
	const [trainingFluxKontextLoRAData, restoreTrainingFluxKontextLoRAData] =
		resettableRef<TrainingFluxKontextLoRAData>({
			data: {
				current: 0,
				elapsed: "",
				loss: 0,
				remaining: "",
				speed: 0,
				total: 0,
				showSampling: false,
				samplingPath: "",
				totalTime: 0
			},
			raw: null
		});
	function setTrainingFluxKontextLoRAData(result: FluxKontextTrainingInfoResult) {
		let detail: Exclude<FluxKontextTrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {} as any;
		} else {
			detail = result.detail;
		}
		const current = detail?.current ?? 0;
		const total = detail?.total ?? 0;

		trainingFluxKontextLoRAData.value.data = {
			current,
			elapsed: detail?.elapsed_time_str ?? "00:00",
			loss: detail?.loss ?? 0,
			remaining: detail?.remaining_time_str ?? "00:00",
			speed: detail?.seconds_per_step ?? 0,
			total,
			showSampling: result.is_sampling ?? false,
			samplingPath: result.sampling_path ?? "",
			totalTime: detail?.estimated_total_time_seconds ?? 0
		};
		trainingFluxKontextLoRAData.value.raw = result;
		currentTaskInfo.value.progress = calculatePercentage(current, total);
	}
	function resetTrainingFluxKontextLoRAData() {
		restoreTrainingFluxKontextLoRAData();
	}

	/** 混元hy lora 训练 */
	const [trainingHYLoRAData, restoreTrainingHYLoRAData] = resettableRef<TrainingHYLoRAData>({
		data: {
			current: 0,
			total: 0,
			elapsed: 0,
			epoch_elapsed: 0,
			epoch_loss: 0,
			estimate_elapsed: 0,
			loss: 0,
			current_epoch: "??",
			total_epoch: "??"
		},
		raw: null
	});
	function setTrainingHYLoRAData(result: HyVideoTrainingInfoResult) {
		let detail: Exclude<HyVideoTrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {} as any;
		} else {
			detail = result.detail;
		}

		const data: TrainingHYLoRAData["data"] = {
			current: detail.current ?? 0,
			total: "??",
			elapsed: detail.elapsed ?? 0,
			epoch_elapsed: 0,
			estimate_elapsed: 0,
			loss: detail.loss ?? 0,
			epoch_loss: detail.epoch_loss ?? 0,
			current_epoch: detail.current_epoch ?? "??",
			total_epoch: detail.total_epoch ?? "??"
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
			data.current_epoch = 1;
		} else {
			current = detail.current ?? 0;
			const current_epoch = detail.current_epoch ?? 0;
			const steps = Math.ceil(current / current_epoch); //每轮的步数
			const total_epoch = detail.total_epoch ?? 0;
			total = steps * total_epoch;

			data.total = total;
			data.epoch_elapsed = new BigNumber(data.elapsed)
				.dividedBy(detail.current_epoch ?? 1)
				.toNumber();
			data.estimate_elapsed = new BigNumber(data.epoch_elapsed)
				.multipliedBy(detail.total_epoch ?? 1)
				.toNumber();
		}
		trainingHYLoRAData.value.data = data;
		trainingHYLoRAData.value.raw = result;
		currentTaskInfo.value.progress = calculatePercentage(current, total);
	}
	function resetTrainingHYLoRAData() {
		restoreTrainingHYLoRAData();
	}

	/** wan lora 训练 */
	const [trainingWanLoRAData, restoreTrainingWanLoRAData] = resettableRef<TrainingWanLoRAData>({
		data: {
			current: 0,
			total: 0,
			elapsed: "",
			remaining: 0,
			current_loss: 0,
			average_loss: 0,
			total_epoch: "",
			showSampling: false,
			samplingPath: "",
			phase: "none"
		},
		raw: null
	});
	function setTrainingWanLoRAData(result: WanVideoTrainingInfoResult) {
		let detail: Exclude<WanVideoTrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {} as any;
		} else {
			detail = result.detail;
		}
		const current = detail.current ?? 0;
		const total = detail.total ?? 0;

		trainingWanLoRAData.value.data = {
			current,
			total,
			elapsed: detail.elapsed ?? "",
			remaining: detail.remaining ?? "00:00",
			current_loss: detail.current_loss ?? 0,
			average_loss: detail.average_loss ?? 0,
			total_epoch: detail.total_epoch ?? 0,
			showSampling: result.is_sampling ?? false,
			samplingPath: result.sampling_path ?? "",
			phase: result.phase
		};
		trainingWanLoRAData.value.raw = result;
		currentTaskInfo.value.progress = calculatePercentage(current, total);
	}
	function resetTrainingWanLoRAData() {
		restoreTrainingWanLoRAData();
	}

	/** qwen image 训练 */
	const [trainingQwenImageLoRAData, restoreTrainingQwenImageLoRAData] =
		resettableRef<TrainingQwenImageData>({
			data: {
				current_epoch: 0,
				elapsed: "",
				remaining: "",
				current_loss: 0,
				average_loss: 0,
				speed: 0,
				total_epoch: "",
				showSampling: false,
				samplingPath: "",
				phase: "none"
			},
			raw: null
		});
	function setTrainingQwenImageLoRAData(result: QwenImageTrainingInfoResult) {
		let detail: Exclude<QwenImageTrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {} as any;
		} else {
			detail = result.detail;
		}
		const current_epoch = detail.current ?? 0;
		const total_epoch = detail.total_optimization_steps ?? 0;

		trainingQwenImageLoRAData.value.data = {
			current_epoch,
			total_epoch,
			current_loss: detail.current_loss ?? 0,
			average_loss: detail.average_loss ?? 0,
			speed: detail.speed ?? 0,
			elapsed: detail.elapsed ?? "00:00",
			remaining: detail.remaining ?? "00:00",
			showSampling: result.is_sampling ?? false,
			samplingPath: result.sampling_path ?? "",
			phase: result.phase
		};
		trainingQwenImageLoRAData.value.raw = result;
		currentTaskInfo.value.progress = calculatePercentage(current_epoch, total_epoch);
	}
	function resetTrainingQwenImageLoRAData() {
		restoreTrainingQwenImageLoRAData();
	}

	return {
		currentTaskInfo,
		useGPU,
		setCurrentTaskInfo,
		resetCurrentTaskInfo,
		trainingGPUData,
		setTrainingGPUData,
		resetTrainingGPUData,
		trainingTagData,
		trainingFluxLoRAData,
		trainingFluxKontextLoRAData,
		trainingHYLoRAData,
		trainingWanLoRAData,
		trainingQwenImageLoRAData
	};
});

export type UseTrainingStore = ReturnType<typeof useTrainingStore>;
