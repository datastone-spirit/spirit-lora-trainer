/*
 * @Author: mulingyuer
 * @Date: 2024-12-25 09:45:07
 * @LastEditTime: 2025-07-28 17:36:41
 * @LastEditors: mulingyuer
 * @Description: 训练相关数据
 * @FilePath: \frontend\src\stores\modules\training\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type { CurrentTaskInfo, TrainingData, TrainingHYLoRAData } from "./types";
import type {
	FluxKontextTrainingInfoResult,
	GPUMonitorInfoResult,
	HyVideoTrainingInfoResult,
	LoRATrainingInfoResult,
	ManualTagInfoResult,
	WanVideoTrainingInfoResult
} from "@/api/monitor";
import { calculatePercentage } from "@/utils/tools";
import BigNumber from "bignumber.js";
export type * from "./types";

export const useTrainingStore = defineStore("training", () => {
	/** 当前任务信息 */
	const currentTaskInfo = ref<CurrentTaskInfo>({
		type: "none",
		id: "",
		name: "",
		progress: 0
	});
	function setCurrentTaskInfo(info: CurrentTaskInfo) {
		currentTaskInfo.value = info;
	}
	function resetCurrentTaskInfo() {
		currentTaskInfo.value = {
			type: "none",
			id: "",
			name: "",
			progress: 0
		};
	}

	/** gpu是否在使用中 */
	const useGPU = computed(() => {
		return currentTaskInfo.value.type !== "none";
	});

	/** 训练数据 */
	const trainingData = ref<TrainingData>({
		gpu: {
			isListen: false,
			data: {
				gpuPower: 0,
				gpuMemory: 0,
				gpuList: []
			},
			raw: null
		},
		tag: {
			isListen: false,
			data: {
				progress: 0,
				current: 0,
				total: 0
			},
			raw: null
		},
		flux_lora: {
			isListen: false,
			data: {
				current: 0,
				elapsed: "",
				loss: 0,
				loss_avr: 0,
				remaining: "",
				speed: 0,
				total: 0,
				progress: 0,
				samplingPath: "",
				showSampling: false
			},
			raw: null
		},
		flux_kontext_lora: {
			isListen: false,
			data: {
				current: 0,
				elapsed: "",
				loss: 0,
				remaining: "",
				speed: 0,
				total: 0,
				showSampling: false,
				samplingPath: "",
				progress: 0,
				totalTime: 0
			},
			raw: null
		},
		hy_lora: {
			isListen: false,
			data: {
				current: 0,
				total: 0,
				progress: 0,
				elapsed: 0,
				epoch_elapsed: 0,
				epoch_loss: 0,
				estimate_elapsed: 0,
				loss: 0,
				current_epoch: "??",
				total_epoch: "??"
			},
			raw: null
		},
		wan_lora: {
			isListen: false,
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
				phase: "none",
				progress: 0
			},
			raw: null
		}
	});

	// gpu
	const trainingGPUData = computed(() => trainingData.value.gpu);
	function setTrainingGPUListen(val: boolean) {
		trainingData.value.gpu.isListen = val;
	}
	function setTrainingGPUData(result: GPUMonitorInfoResult) {
		if (!result.length) {
			console.warn("设置GPU数据为空，请检查接口返回");
			return;
		}

		const oneItemData = result[0];
		trainingData.value.gpu.data = {
			gpuMemory: calculatePercentage(oneItemData.memory_used_mb, oneItemData.memory_total_mb),
			gpuPower: calculatePercentage(oneItemData.power_draw_watts, oneItemData.power_total_watts),
			gpuList: result
		};
		trainingData.value.gpu.raw = result;
	}
	function resetTrainingGPUData() {
		trainingData.value.gpu.data = {
			gpuPower: 0,
			gpuMemory: 0,
			gpuList: []
		};
		trainingData.value.gpu.raw = null;
	}

	// 打标
	const trainingTagData = computed(() => trainingData.value.tag);
	function setTrainingTagListen(val: boolean) {
		trainingData.value.tag.isListen = val;
	}
	function setTrainingTagData(result: ManualTagInfoResult) {
		const detail = result?.detail ?? {};
		const current = detail?.current >= 0 ? detail.current : 0;
		const total = detail?.total ?? 0;

		trainingData.value.tag.data = {
			current,
			total: total,
			progress: calculatePercentage(current, total)
		};
		trainingData.value.tag.raw = result;
	}
	function resetTrainingTagData() {
		trainingData.value.tag.data = {
			progress: 0,
			current: 0,
			total: 0
		};
	}

	/** flux lora 训练 */
	const trainingFluxLoRAData = computed(() => trainingData.value.flux_lora);
	function setTrainingFluxLoRAListen(val: boolean) {
		trainingData.value.flux_lora.isListen = val;
	}
	function setTrainingFluxLoRAData(result: LoRATrainingInfoResult) {
		let detail: Exclude<LoRATrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {};
		} else {
			detail = result.detail;
		}
		const current = detail.current ?? 0;
		const total = detail.total ?? 0;

		trainingData.value.flux_lora.data = {
			current,
			elapsed: detail.elapsed ?? "00:00",
			loss: detail.loss ?? 0,
			loss_avr: detail.loss_avr ?? 0,
			remaining: detail.remaining ?? "00:00",
			speed: detail.speed ?? 0,
			total,
			progress: calculatePercentage(current, total),
			showSampling: result.is_sampling ?? false,
			samplingPath: result.sampling_path ?? ""
		};
		trainingData.value.flux_lora.raw = result;
	}
	function resetTrainingFluxLoRAData() {
		trainingData.value.flux_lora.data = {
			current: 0,
			elapsed: "",
			loss: 0,
			loss_avr: 0,
			remaining: "",
			speed: 0,
			total: 0,
			progress: 0,
			samplingPath: "",
			showSampling: false
		};
		trainingData.value.flux_lora.raw = null;
	}

	/** flux kontext lora 训练 */
	const trainingFluxKontextLoRAData = computed(() => trainingData.value.flux_kontext_lora);
	function setTrainingFluxKontextLoRAListen(val: boolean) {
		trainingData.value.flux_kontext_lora.isListen = val;
	}
	function setTrainingFluxKontextLoRAData(result: FluxKontextTrainingInfoResult) {
		let detail: Exclude<FluxKontextTrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {} as any;
		} else {
			detail = result.detail;
		}
		const current = detail?.current ?? 0;
		const total = detail?.total ?? 0;

		trainingData.value.flux_kontext_lora.data = {
			current,
			elapsed: detail?.elapsed_time_str ?? "00:00",
			loss: detail?.loss ?? 0,
			remaining: detail?.remaining_time_str ?? "00:00",
			speed: detail?.seconds_per_step ?? 0,
			total,
			progress: calculatePercentage(current, total),
			// TODO: 这个还没确定
			showSampling: false,
			samplingPath: "",
			totalTime: detail?.estimated_total_time_seconds ?? 0
			// showSampling: res.is_sampling ?? false,
			// samplingPath: res.sampling_path ?? "",
		};
		trainingData.value.flux_kontext_lora.raw = result;
	}
	function resetTrainingFluxKontextLoRAData() {
		trainingData.value.flux_kontext_lora.data = {
			current: 0,
			elapsed: "",
			loss: 0,
			remaining: "",
			speed: 0,
			total: 0,
			showSampling: false,
			samplingPath: "",
			progress: 0,
			totalTime: 0
		};
		trainingData.value.flux_kontext_lora.raw = null;
	}

	/** 混元hy lora 训练 */
	const trainingHYLoRAData = computed(() => trainingData.value.hy_lora);
	function setTrainingHYLoRAListen(val: boolean) {
		trainingData.value.hy_lora.isListen = val;
	}
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
			progress: 0,
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
		data.progress = calculatePercentage(current, total);

		trainingData.value.hy_lora.data = data;
		trainingData.value.hy_lora.raw = result;
	}
	function resetTrainingHYLoRAData() {
		trainingData.value.hy_lora.data = {
			current: 0,
			total: 0,
			progress: 0,
			elapsed: 0,
			epoch_elapsed: 0,
			epoch_loss: 0,
			estimate_elapsed: 0,
			loss: 0,
			current_epoch: "??",
			total_epoch: "??"
		};
		trainingData.value.hy_lora.raw = null;
	}

	/** wan lora 训练 */
	const trainingWanLoRAData = computed(() => trainingData.value.wan_lora);
	function setTrainingWanLoRAListen(val: boolean) {
		trainingData.value.wan_lora.isListen = val;
	}
	function setTrainingWanLoRAData(result: WanVideoTrainingInfoResult) {
		let detail: Exclude<WanVideoTrainingInfoResult["detail"], string>;
		if (!result?.detail || typeof result.detail === "string") {
			detail = {} as any;
		} else {
			detail = result.detail;
		}

		trainingData.value.wan_lora.data = {
			progress: calculatePercentage(detail.current, detail.total),
			current: detail.current ?? 0,
			total: detail.total ?? 0,
			elapsed: detail.elapsed ?? "",
			remaining: detail.remaining ?? "00:00",
			current_loss: detail.current_loss ?? 0,
			average_loss: detail.average_loss ?? 0,
			total_epoch: detail.total_epoch ?? 0,
			showSampling: result.is_sampling ?? false,
			samplingPath: result.sampling_path ?? "",
			phase: result.phase
		};
		trainingData.value.wan_lora.raw = result;
	}
	function resetTrainingWanLoRAData() {
		trainingData.value.wan_lora.data = {
			current: 0,
			total: 0,
			elapsed: "",
			remaining: 0,
			current_loss: 0,
			average_loss: 0,
			total_epoch: "",
			showSampling: false,
			samplingPath: "",
			phase: "none",
			progress: 0
		};
		trainingData.value.wan_lora.raw = null;
	}

	return {
		currentTaskInfo,
		useGPU,
		setCurrentTaskInfo,
		resetCurrentTaskInfo,
		trainingData,
		trainingGPUData,
		setTrainingGPUListen,
		setTrainingGPUData,
		resetTrainingGPUData,
		trainingTagData,
		setTrainingTagListen,
		setTrainingTagData,
		resetTrainingTagData,
		trainingFluxLoRAData,
		setTrainingFluxLoRAListen,
		setTrainingFluxLoRAData,
		resetTrainingFluxLoRAData,
		trainingFluxKontextLoRAData,
		setTrainingFluxKontextLoRAListen,
		setTrainingFluxKontextLoRAData,
		resetTrainingFluxKontextLoRAData,
		trainingHYLoRAData,
		setTrainingHYLoRAListen,
		setTrainingHYLoRAData,
		resetTrainingHYLoRAData,
		trainingWanLoRAData,
		setTrainingWanLoRAListen,
		setTrainingWanLoRAData,
		resetTrainingWanLoRAData
	};
});

export type UseTrainingStore = ReturnType<typeof useTrainingStore>;
