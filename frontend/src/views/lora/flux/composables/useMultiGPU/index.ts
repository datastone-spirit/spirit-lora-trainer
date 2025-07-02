/*
 * @Author: mulingyuer
 * @Date: 2025-07-01 11:53:54
 * @LastEditTime: 2025-07-02 10:37:01
 * @LastEditors: mulingyuer
 * @Description: 多GPU hooks
 * @FilePath: \frontend\src\views\lora\flux\composables\useMultiGPU\index.ts
 * 怎么可能会有bug！！！
 */
import { gpuApi } from "@/api/gpu";
import type { GPUInfoResponse, GPUValidationResponse, MemoryEstimationResponse } from "@/api/gpu";
import type { RuleForm } from "../../types";

export type GpuInfoStatus = "loading" | "success" | "error";

// gpu信息
const gpuInfoStatus = ref<GpuInfoStatus>("loading");
const gpuInfoLoading = computed(() => gpuInfoStatus.value === "loading");
const isGupInfoError = computed(() => gpuInfoStatus.value === "error");
const gpuInfoErrorMsg = ref<string>();
const gpuInfo = ref<GPUInfoResponse>();
// 预估显存返回值
const memoryEstimation = ref<MemoryEstimationResponse>();
// 校验GPU配置
const validateGPUConfigLoading = ref(false);
const validateGPUConfigResult = ref<GPUValidationResponse>();
// gpu信息轮询获取
const POLLING_INTERVAL_TIME = 10000;
let pollingInterval: number | null = null;
function stopPollingGPUInfo() {
	if (!pollingInterval) return;
	clearInterval(pollingInterval);
	pollingInterval = null;
}

export function useMultiGPU() {
	/** 获取GPU信息 */
	async function getGPUInfo() {
		try {
			gpuInfoStatus.value = "loading";
			const response = await gpuApi.getGPUInfo();

			// Validate response structure
			if (!response || typeof response !== "object") {
				throw new Error("Invalid GPU info response");
			}

			// Ensure minimum required properties exist
			if (!response.gpus || !Array.isArray(response.gpus)) {
				throw new Error("Invalid GPU list in response");
			}

			// Set default values for missing system_info
			if (!response.system_info) {
				response.system_info = {
					driver_version: "未知",
					cuda_version: "未知",
					gpu_count: response.gpus?.length || 0,
					total_gpu_memory_mb: 0
				};
			}

			// Set default total_gpus if missing
			if (!response.total_gpus) {
				response.total_gpus = response.gpus.length;
			}

			gpuInfo.value = response;

			gpuInfoStatus.value = "success";
		} catch (error: any) {
			gpuInfoStatus.value = "error";

			if (
				error.message?.includes("fetch") ||
				error.message?.includes("Network") ||
				error.code === "ECONNREFUSED"
			) {
				gpuInfoErrorMsg.value = "GPU监控服务不可用。使用默认配置。";
				ElMessage.warning("GPU监控服务不可用。您仍可以配置多GPU训练。");
			} else {
				gpuInfoErrorMsg.value = "无法加载实时GPU信息。使用默认配置。";
				ElMessage.warning("无法加载实时GPU信息。使用默认配置。");
			}

			// back
			gpuInfo.value = {
				total_gpus: 1,
				system_info: {
					driver_version: "不可用",
					cuda_version: "不可用",
					gpu_count: 1,
					total_gpu_memory_mb: 8192
				},
				gpus: [
					{
						index: 0,
						name: "GPU (接口不可用)",
						memory_total_mb: 8192,
						memory_free_mb: 4096,
						memory_used_mb: 4096,
						memory_utilization_percent: 50,
						power_draw_watts: 0,
						power_limit_watts: 0,
						power_utilization_percent: 0,
						temperature_celsius: null,
						utilization_percent: null,
						uuid: null,
						driver_version: null
					}
				]
			};
		}
	}

	/** 预估需要的显存 */
	async function estimateMemory(ruleForm: Ref<RuleForm>) {
		try {
			const response = await gpuApi.estimateMemoryRequirements({
				batch_size: ruleForm.value.train_batch_size ?? 1,
				num_gpus: ruleForm.value.num_gpus ?? 1,
				model_size: "flux-dev",
				precision: ruleForm.value.mixed_precision ?? "bf16",
				training_type: "lora",
				use_flux_optimizations: true
			});

			memoryEstimation.value = response;

			// Update memory requirement based on estimation, but use minimum for Flux LoRA
			const targetMemory = memoryEstimation.value.per_gpu_estimate.flux_lora_optimized
				? memoryEstimation.value.per_gpu_estimate.minimum_requirement_mb ||
					memoryEstimation.value.per_gpu_estimate.total_memory_mb
				: memoryEstimation.value.per_gpu_estimate.recommended_memory_mb;

			// Always update to use the optimized estimate for Flux LoRA
			ruleForm.value.memory_requirement_mb = targetMemory ?? 8000;
		} catch (error) {
			ruleForm.value.memory_requirement_mb = ruleForm.value.memory_requirement_mb ?? 8000;
			console.error("预估显存失败", error);
		}
	}

	/** 校验GPU配置 */
	async function validateGPUConfig(ruleForm: Ref<RuleForm>, force_override: boolean) {
		try {
			validateGPUConfigLoading.value = true;

			const response = await gpuApi.validateGPUConfig({
				gpu_ids: ruleForm.value.gpu_ids,
				memory_requirement_mb: ruleForm.value.memory_requirement_mb ?? 8000,
				batch_size_per_gpu: ruleForm.value.train_batch_size ?? 1,
				force_override: force_override
			});

			validateGPUConfigResult.value = response;

			// 消息提示
			if (response.is_valid) {
				const message = force_override ? "GPU配置有效 (内存检查已覆盖)" : "GPU配置有效";
				ElMessage.success(message);
			} else {
				ElMessage.error(response.error_message || "GPU配置无效");
			}
		} catch (error) {
			ElMessage.error("验证GPU配置失败");
			console.error("验证GPU配置失败", error);
		} finally {
			validateGPUConfigLoading.value = false;
		}
	}

	/** 开始轮询GPU信息 */
	function startPollingGPUInfo() {
		if (pollingInterval) stopPollingGPUInfo();
		pollingInterval = setInterval(() => {
			gpuApi
				.getGPUInfo()
				.then((response) => {
					// Validate response structure
					if (!response || typeof response !== "object") return;
					// Ensure minimum required properties exist
					if (!response.gpus || !Array.isArray(response.gpus)) return;

					// Set default values for missing system_info
					if (!response.system_info) {
						response.system_info = {
							driver_version: "未知",
							cuda_version: "未知",
							gpu_count: response.gpus?.length || 0,
							total_gpu_memory_mb: 0
						};
					}

					// Set default total_gpus if missing
					if (!response.total_gpus) {
						response.total_gpus = response.gpus.length;
					}

					gpuInfo.value = response;
				})
				.catch(() => {});
		}, POLLING_INTERVAL_TIME);
	}

	return {
		gpuInfoStatus,
		gpuInfoLoading,
		isGupInfoError,
		gpuInfoErrorMsg,
		gpuInfo,
		getGPUInfo,
		estimateMemory,
		memoryEstimation,
		validateGPUConfigLoading,
		validateGPUConfigResult,
		validateGPUConfig,
		startPollingGPUInfo,
		stopPollingGPUInfo
	};
}
