/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 16:07:25
 * @LastEditTime: 2025-10-10 09:23:44
 * @LastEditors: mulingyuer
 * @Description: hunyuan 校验方法
 * @FilePath: \frontend\src\views\lora\hunyuan-video\hunyuan.validate.ts
 * 怎么可能会有bug！！！
 */
import type { ValidationResult } from "@/utils/lora/validator";
import { DatasetValidator, LoRAValidator } from "@/utils/lora/validator";
import type { FormInstance } from "element-plus";
import type { RuleForm } from "./types";
import { hyCheckDirectoryExists } from "@/api/common";

export interface ValidateData {
	/** 表单数据 */
	ruleForm: RuleForm;
	/** 表单实例 */
	formInstance: FormInstance;
}

export interface IsDirectoryEmptyOptions {
	/** 目录路径 */
	path: string;
	/** 是否显示错误消息弹窗 */
	shouldShowErrorDialog?: boolean;
}

/** 检验目录是否为空 */
export async function isDirectoryEmpty(
	options: IsDirectoryEmptyOptions
): Promise<ValidationResult> {
	const { path, shouldShowErrorDialog = false } = options;
	try {
		const result = await hyCheckDirectoryExists({ path, has_data: true });

		if (result.has_data) {
			const message = "目录不为空";
			if (shouldShowErrorDialog) {
				LoRAValidator.showErrorMessage({ message });
			}
			return { valid: false, message };
		}

		return { valid: true };
	} catch (error) {
		const message = `校验目录发生错误: ${(error as Error)?.message ?? "未知错误"}`;
		if (shouldShowErrorDialog) {
			LoRAValidator.showErrorMessage({ message });
		}

		return {
			valid: false,
			message
		};
	}
}

/** 训练轮数epochs二次确认弹窗
 * 当轮数不是整数倍弹窗提示用户，用户确认了才进行下一步
 */
async function validateEpochs(ruleForm: RuleForm): Promise<ValidationResult> {
	return new Promise((resolve) => {
		const { epochs, save_every_n_epochs } = ruleForm.config;
		if (epochs % save_every_n_epochs !== 0) {
			ElMessageBox.confirm(
				"当前epochs训练轮数不是save_every_n_epochs的整数倍，会有训练轮次不会保存训练结果！是否继续训练?",
				"提示",
				{
					confirmButtonText: "继续训练",
					cancelButtonText: "取消",
					type: "warning"
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
		() => isDirectoryEmpty({ path: ruleForm.config.output_dir, shouldShowErrorDialog: true }),
		// GPU占用校验
		() => LoRAValidator.validateGpu({ shouldShowErrorDialog: true }),
		// 数据集校验
		() =>
			DatasetValidator.validateDirectory({
				path: ruleForm.aiTagRuleForm.image_path,
				checkImageAndLabel: true,
				shouldShowErrorDialog: true
			}),
		// 轮数校验
		() => validateEpochs(ruleForm)
	];

	// NOTE: 每个校验方法都会保证不会抛出异常，所以不需要try
	for (const validation of validations) {
		const validResult = await validation();
		if (!validResult.valid) return validResult;
	}

	return { valid: true };
}
