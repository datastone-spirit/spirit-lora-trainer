/*
 * @Author: mulingyuer
 * @Date: 2024-12-19 15:38:33
 * @LastEditTime: 2025-03-28 14:46:08
 * @LastEditors: mulingyuer
 * @Description: lora helper
 * @FilePath: \frontend\src\utils\lora.helper\index.ts
 * 怎么可能会有bug！！！
 */
import { checkDirectoryExists, hyCheckDirectoryExists } from "@/api/common";
import { currentTaskFormConfig } from "@/api/task";
import type { UseTrainingStore } from "@/stores";
import { tomlParse } from "@/utils/toml";
import type { RecoveryTaskFormDataOptions, RunLoraTaskResult } from "./types";
export type * from "./types";

/** 检测目录是否存在 */
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

/** 检测目录下是否存在数据 */
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

/** 混元视频，检测目录下是否存在数据 */
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

/** 过滤并转换对象中的键值对 */
export function filterAndConvertKeysToNumber(
	data: Record<string, any>, // 接收一个任意键值对的对象
	keys: string[] // 接收一个key数组
): Record<string, number> {
	// 返回一个新的对象，值为number类型
	const result: Record<string, number> = {};

	keys.forEach((key) => {
		if (key in data) {
			// 判断key是否在对象中
			const value = data[key];
			// 尝试将值转换为数字，如果值不是数字或者不能转换，返回NaN
			result[key] = Number(value);
		}
	});

	return result;
}

// 合并训练表单数据
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

/** 获取当前训练的任务数据 */
export function getRunLoraTask(store: UseTrainingStore): RunLoraTaskResult {
	const { currentTaskType, monitorFluxLoraData, monitorHYLoraData } = storeToRefs(store);
	const result: RunLoraTaskResult = {
		type: "none",
		taskName: "",
		taskData: {
			progress: 0
		}
	};

	switch (currentTaskType.value) {
		case "flux":
			result.type = "flux";
			result.taskName = "Flux";
			result.taskData.progress = monitorFluxLoraData.value.data.progress;
			break;
		case "hunyuan-video":
			result.type = "hunyuan-video";
			result.taskName = "混元视频";
			result.taskData.progress = monitorHYLoraData.value.data.progress;
			break;
		case "wan-video":
			result.type = "wan-video";
			result.taskName = "wan视频";
			break;
	}

	return result;
}

/** 恢复表单数据，只有在任务正在进行中时才恢复表单数据 */
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
