/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 15:10:20
 * @LastEditTime: 2025-08-04 09:26:38
 * @LastEditors: mulingyuer
 * @Description: 公共的lora帮助方法
 * @FilePath: \frontend\src\utils\lora\lora.helper\index.ts
 * 怎么可能会有bug！！！
 */
import { currentTaskFormConfig } from "@/api/task";
import type { RecoveryTaskFormDataOptions } from "./types";
import { tomlParse } from "@/utils/toml";
import { useSettingsStore, useTrainingStore } from "@/stores";
export type * from "./types";

export class LoRAHelper {
	/** 恢复表单数据的任务黑名单 */
	static readonly RECOVERY_TASK_FORM_DATA_BLACKLIST: Array<TaskType> = ["none", "tag"];

	/** 校验任务id是否有效 */
	static isValidTaskId(taskId: string | undefined | null): boolean {
		return !!taskId && taskId.trim() !== "";
	}

	/** 合并训练表单数据 */
	static mergeTrainingFormData(form: Record<string, any>, data: Record<string, any>) {
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

	/** 恢复表单数据，只有在任务正在进行中时才恢复表单数据 */
	static async recoveryTaskFormData(options: RecoveryTaskFormDataOptions) {
		try {
			const settingsStore = useSettingsStore();
			const trainingStore = useTrainingStore();
			const taskId = trainingStore.currentTaskInfo.id;
			const route = useRoute();

			// 如果没有开启恢复训练中的任务表单数据功能，则不恢复表单数据
			// 如果不是训练任务，则不恢复表单数据
			// 如果没有任务id，则不恢复表单数据
			// 如果当前页面不是需要恢复表单数据的页面
			if (
				!settingsStore.trainerSettings.enableTrainingTaskDataRecovery ||
				LoRAHelper.RECOVERY_TASK_FORM_DATA_BLACKLIST.includes(trainingStore.currentTaskInfo.type) ||
				!LoRAHelper.isValidTaskId(taskId) ||
				route.meta.loRATaskType !== trainingStore.currentTaskInfo.type
			) {
				return;
			}

			const { formData, showTip = true } = options;

			// api
			const res = await currentTaskFormConfig({ task_id: taskId, show_config: true });
			if (!res.frontend_config) return;
			const tomlData = tomlParse(res.frontend_config);
			// 合并数据
			LoRAHelper.mergeTrainingFormData(formData, tomlData);
			showTip && ElMessage.success("训练配置已恢复");
		} catch (error) {
			const { showTip = true } = options;

			showTip && ElMessage.error("恢复训练配置失败");
			console.error("恢复训练配置失败", error);
		}
	}
}
