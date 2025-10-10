/*
 * @Author: mulingyuer
 * @Date: 2025-10-09 16:22:08
 * @LastEditTime: 2025-10-09 16:41:20
 * @LastEditors: mulingyuer
 * @Description: 公共的lora校验
 * @FilePath: \frontend\src\utils\lora\validator\lora.ts
 * 怎么可能会有bug！！！
 */
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoraSavePathWarningModal } from "@/utils/modal-manager";
import { formatFormValidateMessage } from "@/utils/tools";
import type { FormInstance } from "element-plus";
import { ValidatorBase } from "./base";
import type {
	ValidateFormOptions,
	ValidateGpuOptions,
	ValidateLoRaSaveDirOptions,
	ValidationResult
} from "./types";

export class LoRAValidator extends ValidatorBase {
	/** Element-Plus 表单校验 */
	static async validateForm(
		formInstance: FormInstance,
		options: ValidateFormOptions = {}
	): Promise<ValidationResult> {
		if (!formInstance) return { valid: false, message: "表单实例不存在" };
		const { shouldShowErrorDialog = false } = options;

		return new Promise((resolve) => {
			formInstance.validate((valid, invalidFields) => {
				// 校验通过
				if (valid) {
					resolve({ valid: true });
					return;
				}

				// 校验不通过
				const message = invalidFields ? formatFormValidateMessage(invalidFields) : "请填写必填项";
				if (shouldShowErrorDialog) {
					const duration = message.split("\n").length >= 2 ? 6000 : 3000;
					this.showErrorMessage({
						message,
						customClass: "break-line-message",
						duration
					});
				}
				resolve({ valid: false, message });
				return;
			});
		});
	}

	/** GPU占用校验
	 * TODO: 最好是通过接口来判断，现在暂时通过本地变量来判断
	 */
	static async validateGpu(options: ValidateGpuOptions = {}): Promise<ValidationResult> {
		const { shouldShowErrorDialog = false } = options;
		const trainingStore = useTrainingStore();
		if (trainingStore.useGPU) {
			if (shouldShowErrorDialog) {
				this.showErrorMessage({ message: "GPU已经被占用，请等待对应任务完成" });
			}
			return { valid: false, message: "GPU已经被占用，请等待对应任务完成" };
		}
		return { valid: true };
	}

	/** LoRA保存路径校验
	 *  为防止用户将数据保存至系统盘（实例停止时数据会丢失），在启用“小白校验”功能后，系统将强制要求所有存储路径必须匹配指定的前缀规则。
	 */
	static async validateLoRASaveDir(options: ValidateLoRaSaveDirOptions): Promise<ValidationResult> {
		try {
			const { path, shouldShowErrorDialog = false } = options;
			const env = getEnv();
			const settingsStore = useSettingsStore();
			if (!settingsStore.whiteCheck) return { valid: true };

			// 环境变量配置的前缀
			const prefix = env.VITE_APP_LORA_OUTPUT_PARENT_PATH;
			if (!prefix) return { valid: true };
			if (path.startsWith(prefix)) return { valid: true };

			// 展示警告弹窗，老大强烈要求
			if (shouldShowErrorDialog) {
				LoraSavePathWarningModal.show();
			}

			return { valid: false, message: `LoRA保存路径必须是 ${prefix} 开头` };
		} catch (error) {
			return {
				valid: false,
				message: `校验目录发生错误: ${(error as Error)?.message ?? "未知错误"}`
			};
		}
	}
}
