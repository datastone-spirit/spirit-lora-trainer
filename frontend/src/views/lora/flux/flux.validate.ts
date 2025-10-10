/*
 * @Author: mulingyuer
 * @Date: 2025-03-06 15:41:05
 * @LastEditTime: 2025-10-10 09:27:01
 * @LastEditors: mulingyuer
 * @Description: flux校验相关
 * @FilePath: \frontend\src\views\lora\flux\flux.validate.ts
 * 怎么可能会有bug！！！
 */
import { DatasetValidator, LoRAValidator, type ValidationResult } from "@/utils/lora/validator";
import type { FormInstance } from "element-plus";
import type { RuleForm } from "./types";

export interface ValidateData {
	/** 表单数据 */
	ruleForm: RuleForm;
	/** 表单实例 */
	formInstance: FormInstance;
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

/** 校验主函数 */
export async function validate(data: ValidateData): Promise<ValidationResult> {
	const { ruleForm, formInstance } = data;

	const validations = [
		// 表单校验
		() => LoRAValidator.validateForm(formInstance, { shouldShowErrorDialog: true }),
		// LoRA保存路径校验
		() =>
			LoRAValidator.validateLoRASaveDir({
				path: ruleForm.config.output_dir,
				shouldShowErrorDialog: true
			}),
		// GPU占用校验
		() => LoRAValidator.validateGpu({ shouldShowErrorDialog: true }),
		// 数据集校验
		() =>
			DatasetValidator.validateDirectory({
				path: ruleForm.aiTagRuleForm.image_path,
				checkImageAndLabel: true
			})
		// 批量大小相关参数校验
		// () => validateBatchSizeRules(ruleForm)
	];

	// NOTE: 每个校验方法都会保证不会抛出异常，所以不需要try
	for (const validation of validations) {
		const validResult = await validation();
		if (!validResult.valid) return validResult;
	}

	return { valid: true };
}
