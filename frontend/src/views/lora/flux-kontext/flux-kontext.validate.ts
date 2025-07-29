/*
 * @Author: mulingyuer
 * @Date: 2025-07-24 10:25:29
 * @LastEditTime: 2025-07-28 15:53:24
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 校验方法
 * @FilePath: \frontend\src\views\lora\flux-kontext\flux-kontext.validate.ts
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

/** flux-kontext 数据集校验 */
async function validateDataset(ruleForm: RuleForm): Promise<ValidationResult> {
	try {
		const { datasets } = ruleForm;
		if (!datasets.length) {
			const message = "最低需要一个数据集";
			LoRAValidator.showErrorMessage({ message });
			return { valid: false, message: "请选择数据集" };
		}

		for (const item of datasets) {
			// 数据集
			const hasFolderData = await LoRAValidator.validateDirectory({
				path: item.folder_path,
				checkImageAndLabel: true
			});
			if (!hasFolderData.valid) {
				const message = `${item.name}下的数据集目录：${hasFolderData.message}`;
				LoRAValidator.showErrorMessage({ message });

				return { valid: false, message };
			}

			// 控制数据集
			// TODO: 目前api不支持判断目录下是否只有图片文件，flux kontext的控制数据集目录下只会是图片文件，所
			// 以暂时只能做目录是否存在的校验，理论上是不需要的，但是还是保留吧
			const hasControlPath = await LoRAValidator.validateLoRASaveDir({
				path: item.control_path
			});
			if (!hasControlPath.valid) {
				const message = `${item.name}下的控制数据集目录不存在，请重新选择控制数据集目录`;
				LoRAValidator.showErrorMessage({ message });

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
				path: ruleForm.training_folder,
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
