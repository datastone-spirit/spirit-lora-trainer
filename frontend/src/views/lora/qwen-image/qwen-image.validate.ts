/*
 * @Author: mulingyuer
 * @Date: 2025-08-13 15:32:36
 * @LastEditTime: 2025-10-10 11:02:09
 * @LastEditors: mulingyuer
 * @Description: qwen-image校验方法
 * @FilePath: \frontend\src\views\lora\qwen-image\qwen-image.validate.ts
 * 怎么可能会有bug！！！
 */
import type { ValidationResult } from "@/utils/lora/validator";
import { LoRAValidator, DatasetValidator } from "@/utils/lora/validator";
import type { FormInstance } from "element-plus";
import type { RuleForm } from "./types";

export interface ValidateData {
	/** 表单数据 */
	ruleForm: RuleForm;
	/** 表单实例 */
	formInstance: FormInstance;
}

/** 数据集校验 */
class DatesetValidate {
	/** 是否存在一个数据集 */
	private static hasDataset(ruleForm: RuleForm): ValidationResult {
		const { datasets } = ruleForm.dataset;
		if (!datasets.length) {
			const message = "最低需要一个数据集";
			LoRAValidator.showErrorMessage({ message });
			return { valid: false, message: "请选择数据集" };
		}

		return { valid: true };
	}

	/** qwen-image 数据集校验 */
	public static async qwenImage(ruleForm: RuleForm): Promise<ValidationResult> {
		try {
			const hasDatasetResult = DatesetValidate.hasDataset(ruleForm);
			if (!hasDatasetResult.valid) return hasDatasetResult;

			// 遍历数据集
			const { datasets } = ruleForm.dataset;
			for (const item of datasets) {
				const hasFolderData = await DatasetValidator.validateDirectory({
					path: item.image_directory,
					checkImageAndLabel: true
				});
				if (!hasFolderData.valid) {
					const message = `${item.name}下的数据集目录：${hasFolderData.message}`;
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

	/** qwen-image-edit 数据集校验 */
	public static async qwenImageEdit(ruleForm: RuleForm): Promise<ValidationResult> {
		try {
			const hasDatasetResult = DatesetValidate.hasDataset(ruleForm);
			if (!hasDatasetResult.valid) return hasDatasetResult;

			// 遍历数据集
			const { datasets } = ruleForm.dataset;
			for (const item of datasets) {
				const hasFolderData = await DatasetValidator.validateDirectory({
					path: item.image_directory,
					checkImageAndLabel: true
				});
				if (!hasFolderData.valid) {
					const message = `${item.name}下的数据集目录：${hasFolderData.message}`;
					LoRAValidator.showErrorMessage({ message });

					return { valid: false, message };
				}

				// 判断控制数据集的图片数量与数据集是否一致，控制数据集数量可以大于数据集数量
				// 但是图片名称必须与数据集图片名称一致，不关心图片格式
				const hasControlFolderData = await DatasetValidator.validateControlDataset({
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

	/** qwen-image-edit-2509 数据集校验 */
	public static async qwenImageEditPlus(ruleForm: RuleForm): Promise<ValidationResult> {
		try {
			const hasDatasetResult = DatesetValidate.hasDataset(ruleForm);
			if (!hasDatasetResult.valid) return hasDatasetResult;

			// 遍历数据集
			const { datasets } = ruleForm.dataset;
			for (const item of datasets) {
				const hasFolderData = await DatasetValidator.validateDirectory({
					path: item.image_directory,
					checkImageAndLabel: true
				});
				if (!hasFolderData.valid) {
					const message = `${item.name}下的数据集目录：${hasFolderData.message}`;
					LoRAValidator.showErrorMessage({ message });

					return { valid: false, message };
				}

				// 判断控制数据集图片是否与数据集图片关联，支持多控制图像，如指定：`image_dir/image1.jpg` 和 `control_dir/image1_0.png` // ， `control_dir/image1_1.png` 。你也可以指定四位数的编号，例如 `image1_0000.png` 和 `image1_0001.png`
				// 但是图片名称必须与数据集图片名称一致，不关心图片格式
				const hasControlFolderData = await DatasetValidator.validateControlDatasetPlus({
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
}

/** qwen-image 数据集校验 */
function validateDataset(ruleForm: RuleForm): Promise<ValidationResult> {
	const { lora_type } = ruleForm.config;
	switch (lora_type) {
		case "qwen_image":
			return DatesetValidate.qwenImage(ruleForm);
		case "qwen_image_edit":
			return DatesetValidate.qwenImageEdit(ruleForm);
		case "qwen_image_edit_2509":
			return DatesetValidate.qwenImageEditPlus(ruleForm);
		default:
			return Promise.resolve({ valid: false, message: "未知的LoRA类型，无法校验数据集。" });
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
