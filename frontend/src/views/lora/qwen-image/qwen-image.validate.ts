/*
 * @Author: mulingyuer
 * @Date: 2025-08-13 15:32:36
 * @LastEditTime: 2025-08-26 16:58:48
 * @LastEditors: mulingyuer
 * @Description: qwen-image校验方法
 * @FilePath: \frontend\src\views\lora\qwen-image\qwen-image.validate.ts
 * 怎么可能会有bug！！！
 */
import type { ValidationResult } from "@/utils/lora/lora.validator";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import type { FormInstance } from "element-plus";
import type { RuleForm } from "./types";

export interface ValidateData {
	/** 表单数据 */
	ruleForm: RuleForm;
	/** 表单实例 */
	formInstance: FormInstance;
}

/** qwen-image 数据集校验 */
async function validateDataset(ruleForm: RuleForm): Promise<ValidationResult> {
	try {
		const { edit } = ruleForm.config;
		const { datasets } = ruleForm.dataset;
		if (!datasets.length) {
			const message = "最低需要一个数据集";
			LoRAValidator.showErrorMessage({ message });
			return { valid: false, message: "请选择数据集" };
		}

		for (const item of datasets) {
			// 数据集
			const hasFolderData = await LoRAValidator.validateDirectory({
				path: item.image_directory,
				checkImageAndLabel: true
			});
			if (!hasFolderData.valid) {
				const message = `${item.name}下的数据集目录：${hasFolderData.message}`;
				LoRAValidator.showErrorMessage({ message });

				return { valid: false, message };
			}

			// edit才校验控制数据集
			// 判断控制数据集的图片数量与数据集是否一致，控制数据集数量可以大于数据集数量
			// 但是图片名称必须与数据集图片名称一致，不关心图片格式
			if (!edit) continue;
			const hasControlFolderData = await LoRAValidator.validateControlDataset({
				controlPath: item.control_directory,
				datasetPath: item.image_directory
			});
			if (!hasControlFolderData.valid) {
				const message = `${item.name}下的数据集校验不通过：${hasControlFolderData.message}`;
				LoRAValidator.showErrorMessage({ message, duration: 5000 });

				return { valid: false, message };
			}
		}

		// 校验通过
		return { valid: true };
	} catch (error) {
		const message = `数据集校验发生错误: ${(error as Error)?.message ?? "未知错误"}`;
		LoRAValidator.showErrorMessage({ message });

		return { valid: false, message };
	}
}

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
		() => validateDataset(ruleForm)
	];

	// NOTE: 每个校验方法都会保证不会抛出异常，所以不需要try
	for (const validation of validations) {
		const validResult = await validation();
		if (!validResult.valid) return validResult;
	}

	return { valid: true };
}
