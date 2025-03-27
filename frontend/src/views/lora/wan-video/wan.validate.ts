/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:02:06
 * @LastEditTime: 2025-03-27 09:56:17
 * @LastEditors: mulingyuer
 * @Description: wan 校验器
 * @FilePath: \frontend\src\views\lora\wan\wan.validate.ts
 * 怎么可能会有bug！！！
 */
import { formatFormValidateMessage } from "@/utils/tools";
import type { FormInstance, MessageOptions } from "element-plus";
import { useTrainingStore, useModalManagerStore } from "@/stores";
import { checkData } from "@/utils/lora.helper";
import type { RuleForm } from "./types";

export interface ValidateOptions {
	form: FormInstance | undefined;
	formData: RuleForm;
}

export class WanValidate {
	/** 错误消息弹窗 */
	private showErrorMessage(options: MessageOptions) {
		if (!options.type) options.type = "error";
		if (!("showClose" in options)) options.showClose = true;
		ElMessage(options);
	}

	/** element-plus 表单校验 */
	private validateForm(form: FormInstance | undefined): Promise<boolean> {
		return new Promise((resolve) => {
			if (!form) return resolve(false);

			form.validate((valid, invalidFields) => {
				if (!valid) {
					const message = invalidFields ? formatFormValidateMessage(invalidFields) : "请填写必填项";
					const duration = message.split("\n").length >= 2 ? 6000 : 3000;
					this.showErrorMessage({
						message,
						type: "error",
						customClass: "break-line-message",
						duration
					});
					resolve(false);
				}
				resolve(true);
			});
		});
	}

	/** GPU占用校验 */
	private validateGpu() {
		const trainingStore = useTrainingStore();
		if (trainingStore.useGPU) {
			this.showErrorMessage({ message: "GPU已经被占用，请等待对应任务完成", type: "warning" });
			return false;
		}
		return true;
	}

	/** 校验数据集目录是否存在素材 */
	private async validateDataset(imageDir: string): Promise<boolean> {
		const hasData = await checkData(imageDir);
		if (!hasData) {
			this.showErrorMessage({ message: "数据集目录下没有数据，请上传训练素材" });
			return false;
		}
		return true;
	}

	/** LoRA保存路径校验 */
	private validateLoRASaveDir(saveDir: string): boolean {
		if (import.meta.env.VITE_APP_WHITE_CHECK === "false") return true;
		if (saveDir.startsWith("/root")) return true;
		// 展示警告弹窗
		const modalManagerStore = useModalManagerStore();
		modalManagerStore.setLoraSavePathWarningModal(true);

		return false;
	}

	/** 主校验函数 */
	async validate(options: ValidateOptions) {
		const { form, formData } = options;

		const validations = [
			() => this.validateLoRASaveDir(formData.config.output_dir),
			() => this.validateForm(form),
			() => this.validateGpu(),
			() => this.validateDataset(formData.dataset.datasets[0].image_directory)
		];

		for (const validation of validations) {
			const isValid = await validation();
			if (!isValid) return false;
		}

		return true;
	}
}
