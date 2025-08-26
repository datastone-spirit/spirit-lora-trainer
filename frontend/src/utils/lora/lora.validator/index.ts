/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 09:58:06
 * @LastEditTime: 2025-08-26 16:55:41
 * @LastEditors: mulingyuer
 * @Description: 公共的lora校验
 * @FilePath: \frontend\src\utils\lora\lora.validator\index.ts
 * 怎么可能会有bug！！！
 */
import { checkDirectoryExists, directoryFiles } from "@/api/common";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { getEnv } from "@/utils/env";
import { LoraSavePathWarningModal } from "@/utils/modal-manager";
import { formatFormValidateMessage } from "@/utils/tools";
import type { FormInstance } from "element-plus";
import type {
	ErrorMessageOptions,
	ValidateControlDatasetOptions,
	ValidateDirectoryOptions,
	ValidateFormOptions,
	ValidateGpuOptions,
	ValidateLoRaSaveDirOptions,
	ValidationResult
} from "./types";
export type * from "./types";

export class LoRAValidator {
	/** 显示错误消息 */
	static showErrorMessage(options: ErrorMessageOptions): void {
		if (!options.type) options.type = "error";
		if (!("showClose" in options)) options.showClose = true;
		ElMessage(options);
	}

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
					LoRAValidator.showErrorMessage({
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

	/**
	 * 校验目录是否存在及其内容是否符合要求
	 * @remarks
	 * - 支持检查目录是否存在
	 * - 当 checkImageAndLabel 为 true 时，检查目录下是否有图片和标注数据
	 */
	static async validateDirectory(options: ValidateDirectoryOptions): Promise<ValidationResult> {
		const { path, checkImageAndLabel = false, shouldShowErrorDialog = false } = options;
		try {
			const pathList = Array.isArray(path) ? path : [path];

			for (const dir of pathList) {
				const result = await checkDirectoryExists({
					path: dir,
					has_data: checkImageAndLabel
				});

				if (!result.exists) {
					const message = `目录 ${dir} 不存在，请检查路径是否正确`;
					if (shouldShowErrorDialog) {
						LoRAValidator.showErrorMessage({ message });
					}

					return { valid: false, message };
				}

				if (checkImageAndLabel && !result.has_data) {
					const message = `数据集目录 ${dir} 下没有数据，请上传训练素材`;
					if (shouldShowErrorDialog) {
						LoRAValidator.showErrorMessage({ message });
					}

					return { valid: false, message };
				}
			}

			return { valid: true };
		} catch (error) {
			// 校验不通过会直接触发catch
			const message = (error as Error)?.message ?? "未知错误";
			if (shouldShowErrorDialog) {
				LoRAValidator.showErrorMessage({ message });
			}

			return {
				valid: false,
				message
			};
		}
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

	/** 数据集与控制数据集校验
	 * 控制数据集中图片的数量可以大于数据集图片数量，但不能少于数据集图片数量
	 * 控制数据集中的图片名称必须要与数据集中的图片名称完全一致，不考虑文件格式
	 */
	static async validateControlDataset(
		options: ValidateControlDatasetOptions
	): Promise<ValidationResult> {
		const { controlPath, datasetPath, shouldShowErrorDialog = false } = options;
		try {
			const datasetResult = await directoryFiles({ path: datasetPath });
			const datasetImageList = datasetResult.map((item) => {
				return item.image_name.split(".").slice(0, -1).join(".");
			});
			const controlResult = await directoryFiles({ path: controlPath });
			const controlImageList = controlResult.map((item) => {
				return item.image_name.split(".").slice(0, -1).join(".");
			});

			if (controlImageList.length < datasetImageList.length) {
				return { valid: false, message: "控制数据集图片数量与数据集图片数量不匹配" };
			}
			// 文件名必须一致
			const diff = controlImageList.every((item) => datasetImageList.includes(item));
			if (!diff) {
				return { valid: false, message: "控制数据集图片名称与数据集图片名称不匹配" };
			}

			return { valid: true };
		} catch (error) {
			const message = (error as Error)?.message ?? "数据集与控制数据集校验发生未知错误";
			if (shouldShowErrorDialog) {
				LoRAValidator.showErrorMessage({ message });
			}

			return { valid: false, message };
		}
	}
}
