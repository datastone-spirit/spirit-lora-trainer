/*
 * @Author: mulingyuer
 * @Date: 2025-03-06 15:41:05
 * @LastEditTime: 2025-03-27 09:55:03
 * @LastEditors: mulingyuer
 * @Description: flux校验相关
 * @FilePath: \frontend\src\views\lora\flux\flux.validate.ts
 * 怎么可能会有bug！！！
 */
import type { FormInstance, MessageOptions } from "element-plus";
import { ElMessage } from "element-plus";
import type { RuleForm } from "./types";
import type { Ref } from "vue";
import { formatFormValidateMessage } from "@/utils/tools";
import { checkData } from "@/utils/lora.helper";
import { useTrainingStore, useModalManagerStore } from "@/stores";

export interface ValidateFormData {
	formRef: Ref<FormInstance | undefined>;
	formData: Ref<RuleForm>;
	trainingStore: ReturnType<typeof useTrainingStore>;
}

/** 显示错误消息 */
function showError(options: MessageOptions) {
	if (!options.type) options.type = "error";
	if (!("showClose" in options)) options.showClose = true;
	ElMessage(options);
}

/** 基础表单校验 */
function validateFormFields(formRef: Ref<FormInstance | undefined>): Promise<boolean> {
	return new Promise((resolve) => {
		if (!formRef.value) return resolve(false);

		formRef.value.validate((valid, invalidFields) => {
			if (!valid) {
				const message = invalidFields ? formatFormValidateMessage(invalidFields) : "请填写必填项";
				const duration = message.split("\n").length >= 2 ? 6000 : 3000;
				showError({ message, type: "error", customClass: "break-line-message", duration });
				resolve(false);
			}
			resolve(true);
		});
	});
}

/** GPU占用校验 */
function validateGPU(trainingStore: ReturnType<typeof useTrainingStore>): boolean {
	if (trainingStore.useGPU) {
		showError({ message: "GPU已经被占用，请等待对应任务完成", type: "warning" });
		return false;
	}
	return true;
}

/** 数据集校验 */
async function validateDataset(imageDir: string): Promise<boolean> {
	const hasData = await checkData(imageDir);
	if (!hasData) {
		showError({ message: "数据集目录下没有数据，请上传训练素材" });
		return false;
	}
	return true;
}

/** LoRA保存路径校验 */
export function validateLoRASaveDir(formData: Ref<RuleForm>): boolean {
	if (import.meta.env.VITE_APP_WHITE_CHECK === "false") return true;
	if (formData.value.output_dir.startsWith("/root")) return true;
	// 展示警告弹窗
	const modelManagerStore = useModalManagerStore();
	modelManagerStore.setLoraSavePathWarningModal(true);

	return false;
}

/** 批量大小相关参数校验 */
// const validateBatchSizeRules = (() => {
// 	// 校验规则配置
// 	const BATCH_SIZE_RULES = {
// 		2: {
// 			highvram: {
// 				value: false,
// 				message: "批量大小为2时请关闭高显存模式（highvram）"
// 			}
// 		},
// 		">2": {
// 			highvram: {
// 				value: false,
// 				message: "批量大小大于2时请关闭高显存模式（highvram）"
// 			},
// 			keys_to_swap: {
// 				value: 32,
// 				message: "批量大小大于2时，blocks_to_swap参数需固定为32"
// 			},
// 			fp8_base: {
// 				value: true,
// 				message: "批量大小大于2时，fp8_base参数需固定开启"
// 			},
// 			lowram: {
// 				value: true,
// 				message: "批量大小大于2时，lowram参数需固定开启"
// 			},
// 			optimizer_type: {
// 				value: "adamw8bit",
// 				message: "批量大小大于2时，optimizer_type参数需固定为adamw8bit"
// 			},
// 			network_train_unet_only: {
// 				value: true,
// 				message: "批量大小大于2时，network_train_unet_only参数需固定开启"
// 			}
// 		}
// 	};

// 	return function validateBatchSize(formData: RuleForm): boolean {
// 		const { train_batch_size } = formData;

// 		if (train_batch_size === 2) {
// 			const rules = BATCH_SIZE_RULES[2];
// 			for (const [key, { value, message }] of Object.entries(rules)) {
// 				if (formData[key as keyof RuleForm] !== value) {
// 					showError({ message });
// 					return false;
// 				}
// 			}
// 		} else if (train_batch_size > 2) {
// 			const rules = BATCH_SIZE_RULES[">2"];
// 			for (const [key, { value, message }] of Object.entries(rules)) {
// 				if (formData[key as keyof RuleForm] !== value) {
// 					showError({ message });
// 					return false;
// 				}
// 			}
// 		}
// 		return true;
// 	};
// })();

/** Multi-GPU configuration validation */
function validateMultiGPUConfig(formData: Ref<RuleForm>): boolean {
	const { multi_gpu_enabled, gpu_ids } = formData.value;
	
	// If multi-GPU is enabled but no GPUs are selected, show warning
	if (multi_gpu_enabled && (!gpu_ids || gpu_ids.length === 0)) {
		showError({ 
			message: "多GPU训练已启用但未选择任何GPU。请在高级设置中选择GPU或关闭多GPU训练。", 
			type: "warning",
			duration: 5000
		});
		return false;
	}
	
	return true;
}

/** 主校验函数 */
export async function validateForm(data: ValidateFormData): Promise<boolean> {
	const { formRef, formData, trainingStore } = data;

	const validations = [
		() => validateLoRASaveDir(formData),
		() => validateFormFields(formRef),
		() => validateGPU(trainingStore),
		() => validateDataset(formData.value.image_dir),
		() => validateMultiGPUConfig(formData)
		// () => validateBatchSizeRules(formData.value)
	];

	for (const validation of validations) {
		const isValid = await validation();
		if (!isValid) return false;
	}

	return true;
}
