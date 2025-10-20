/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:02:06
 * @LastEditTime: 2025-10-10 09:26:29
 * @LastEditors: mulingyuer
 * @Description: wan 校验器
 * @FilePath: \frontend\src\views\lora\wan-video\wan.validate.ts
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

/** 校验数据集目录是否存在素材 */
async function validateDataset(formData: RuleForm): Promise<ValidationResult> {
	const { data_mode, aiTagRuleForm } = formData;
	let dir: string;
	if (data_mode === "image") {
		dir = aiTagRuleForm.image_path;
	} else {
		dir = formData.dataset.datasets[0].video_directory;
	}

	const { valid } = await DatasetValidator.validateDirectory({
		path: dir,
		checkImageAndLabel: true,
		shouldShowErrorDialog: true
	});

	if (!valid) {
		return { valid: false, message: "数据集目录下没有数据，请上传训练素材" };
	}

	return { valid: true };
}

/** wan2.2 I2V训练警告弹窗 */
async function wan22I2VWarning(formData: RuleForm): Promise<ValidationResult> {
	return new Promise((resolve) => {
		const { task } = formData.config;
		if (task === "i2v-A14B") {
			ElMessageBox.confirm(
				`无效训练场景：模型输入图像后输出相同图像，导致训练无意义，您可以切换至T2V进行训练，详细信息请点击<a href="https://github.com/kohya-ss/musubi-tuner/issues/416" target="_blank">《查看更多》</a>。是否继续训练？`,
				"提示",
				{
					confirmButtonText: "继续训练",
					cancelButtonText: "取消",
					type: "warning",
					dangerouslyUseHTMLString: true,
					customClass: "wan-warning-dialog"
				}
			)
				.then(() => {
					return resolve({ valid: true });
				})
				.catch(() => {
					return resolve({ valid: false, message: "用户取消了操作" });
				});
		} else {
			return resolve({ valid: true });
		}
	});
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
		() => validateDataset(ruleForm),
		// wan2.2 I2V训练警告弹窗
		() => wan22I2VWarning(ruleForm)
	];

	// NOTE: 每个校验方法都会保证不会抛出异常，所以不需要try
	for (const validation of validations) {
		const validResult = await validation();
		if (!validResult.valid) return validResult;
	}

	return { valid: true };
}
