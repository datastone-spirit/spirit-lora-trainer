/*
 * @Author: mulingyuer
 * @Date: 2025-07-24 10:25:29
 * @LastEditTime: 2025-07-25 09:03:49
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 校验方法
 * @FilePath: \frontend\src\views\lora\flux-kontext\flux-kontext.validate.ts
 * 怎么可能会有bug！！！
 */
import type { FormInstance, MessageOptions } from "element-plus";
import type { RuleForm } from "./types";
import type { Ref } from "vue";
import { formatFormValidateMessage } from "@/utils/tools";
import { checkData } from "@/utils/lora.helper";
import { useTrainingStore, useModalManagerStore } from "@/stores";

export interface ValidateFormData {
	formRef: Ref<FormInstance | undefined>;
	formData: Ref<RuleForm>;
	trainingStore: ReturnType<typeof useTrainingStore>;
}

/** 显示错误消息 */
function showError(options: MessageOptions) {
	if (!options.type) options.type = "error";
	if (!("showClose" in options)) options.showClose = true;
	ElMessage(options);
}

/** 基础表单校验 */
function validateFormFields(formRef: Ref<FormInstance | undefined>): Promise<boolean> {
	return new Promise((resolve) => {
		if (!formRef.value) return resolve(false);

		formRef.value.validate((valid, invalidFields) => {
			if (!valid) {
				const message = invalidFields ? formatFormValidateMessage(invalidFields) : "请填写必填项";
				const duration = message.split("\n").length >= 2 ? 6000 : 3000;
				showError({ message, type: "error", customClass: "break-line-message", duration });
				resolve(false);
			}
			resolve(true);
		});
	});
}

/** GPU占用校验 */
function validateGPU(trainingStore: ReturnType<typeof useTrainingStore>): boolean {
	if (trainingStore.useGPU) {
		showError({ message: "GPU已经被占用，请等待对应任务完成", type: "warning" });
		return false;
	}
	return true;
}

/** 数据集校验 */
async function validateDataset(ruleForm: Ref<RuleForm>): Promise<boolean> {
	for (const item of ruleForm.value.datasets) {
		const hasFolderData = await checkData(item.folder_path);
		if (!hasFolderData) {
			showError({ message: `${item.name}下的数据集目录下没有数据，请上传训练素材` });
			return false;
		}
	}

	return true;
}

/** LoRA保存路径校验 */
export function validateLoRASaveDir(formData: Ref<RuleForm>): boolean {
	if (import.meta.env.VITE_APP_WHITE_CHECK === "false") return true;
	if (formData.value.training_folder.startsWith("/root")) return true;
	// 展示警告弹窗
	const modelManagerStore = useModalManagerStore();
	modelManagerStore.setLoraSavePathWarningModal(true);

	return false;
}

/** 主校验函数 */
export async function validateForm(data: ValidateFormData): Promise<boolean> {
	const { formRef, formData, trainingStore } = data;

	const validations = [
		() => validateLoRASaveDir(formData),
		() => validateFormFields(formRef),
		() => validateGPU(trainingStore),
		() => validateDataset(formData)
	];

	for (const validation of validations) {
		const isValid = await validation();
		if (!isValid) return false;
	}

	return true;
}
