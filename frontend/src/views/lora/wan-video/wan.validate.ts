/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:02:06
 * @LastEditTime: 2025-07-28 09:44:41
 * @LastEditors: mulingyuer
 * @Description: wan 校验器
 * @FilePath: \frontend\src\views\lora\wan-video\wan.validate.ts
 * 怎么可能会有bug！！！
 */
import { LoRAValidator, type ValidationResult } from "@/utils/lora/lora.validator";
import type { FormInstance } from "element-plus";
import type { RuleForm } from "./types";

export interface ValidateData {
	/** 表单数据 */
	ruleForm: RuleForm;
	/** 表单实例 */
	formInstance: FormInstance;
}

/** 校验数据集目录是否存在素材 */
async function validateDataset(formData: RuleForm): Promise<ValidationResult> {
	const { data_mode } = formData;
	let dir: string;
	if (data_mode === "image") {
		dir = formData.dataset.datasets[0].image_directory;
	} else {
		dir = formData.dataset.datasets[0].video_directory;
	}

	const { valid } = await LoRAValidator.validateDirectory({
		path: dir,
		checkImageAndLabel: true,
		shouldShowErrorDialog: true
	});

	if (!valid) {
		return { valid: false, message: "数据集目录下没有数据，请上传训练素材" };
	}

	return { valid: true };
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
