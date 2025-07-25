/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 15:38:33
 * @LastEditTime: 2025-07-25 15:14:55
 * @LastEditors: mulingyuer
 * @Description: lora helper
 * @FilePath: \frontend\src\utils\lora.helper\index.ts
 * 怎么可能会有bug！！！
 */
import { checkDirectoryExists, hyCheckDirectoryExists } from "@/api/common";
import { currentTaskFormConfig } from "@/api/task";
import { tomlParse } from "@/utils/toml";
import type { RecoveryTaskFormDataOptions } from "./types";
export type * from "./types";

/** 检测目录是否存在
 * @deprecated 请使用 `LoRAValidator.validateDirectory` 代替
 */
export async function checkDirectory(path: string): Promise<boolean> {
	try {
		const result = await checkDirectoryExists({
			path,
			has_data: false
		});

		return result.exists;
	} catch (_error) {
		return false;
	}
}

/** 检测目录下是否存在数据
 * @deprecated 请使用 `LoRAValidator.validateDirectory` 代替
 */
export async function checkData(path: string): Promise<boolean> {
	try {
		const result = await checkDirectoryExists({
			path,
			has_data: true
		});

		return result.has_data;
	} catch (_error) {
		return false;
	}
}

/** 混元视频，检测目录下是否存在数据
 * @deprecated 请使用 `LoRAValidator.validateDirectory` 代替
 */
export async function checkHYData(path: string): Promise<boolean> {
	try {
		const result = await hyCheckDirectoryExists({
			path,
			has_data: true
		});

		return result.has_data;
	} catch (_error) {
		return true;
	}
}

/** 合并训练表单数据
 * @deprecated 请使用 `LoRAHelper.mergeTrainingFormData` 代替
 */
export function mergeTrainingFormData(form: Record<string, any>, data: Record<string, any>) {
	const formKeys = new Set(Object.keys(form));
	const dataKeys = Object.keys(data);
	// 求交集
	const keys = dataKeys.filter((key) => formKeys.has(key));

	// 合并数据
	keys.forEach((key) => {
		form[key] = data[key];
	});

	return form;
}

/** 恢复表单数据，只有在任务正在进行中时才恢复表单数据
 * @deprecated 请使用 `LoRAHelper.recoveryTaskFormData` 代替
 */
export function recoveryTaskFormData(options: RecoveryTaskFormDataOptions) {
	if (!options.enableTrainingTaskDataRecovery || !options.isListen) return;
	const { taskId, showRecoverySuccessTip = true } = options;
	if (!taskId || taskId.trim() === "") return;

	// api
	currentTaskFormConfig({ task_id: taskId, show_config: true }).then((res) => {
		if (!res.frontend_config) return;
		const tomlData = tomlParse(res.frontend_config);
		// 合并数据
		mergeTrainingFormData(options.formData, tomlData);
		showRecoverySuccessTip && ElMessage.success("训练配置已恢复");
	});
}
