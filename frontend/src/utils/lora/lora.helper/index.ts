/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 15:10:20
 * @LastEditTime: 2025-07-25 15:12:55
 * @LastEditors: mulingyuer
 * @Description: 公共的lora帮助方法
 * @FilePath: \frontend\src\utils\lora\lora.helper\index.ts
 * 怎么可能会有bug！！！
 */
import { currentTaskFormConfig } from "@/api/task";
import type { RecoveryTaskFormDataOptions } from "./types";
import { tomlParse } from "@/utils/toml";
export type * from "./types";

export class LoRAHelper {
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
	static recoveryTaskFormData(options: RecoveryTaskFormDataOptions) {
		if (!options.enableTrainingTaskDataRecovery || !options.isListen) return;
		const { taskId, showRecoverySuccessTip = true } = options;
		if (!taskId || taskId.trim() === "") return;

		// api
		currentTaskFormConfig({ task_id: taskId, show_config: true }).then((res) => {
			if (!res.frontend_config) return;
			const tomlData = tomlParse(res.frontend_config);
			// 合并数据
			LoRAHelper.mergeTrainingFormData(options.formData, tomlData);
			showRecoverySuccessTip && ElMessage.success("训练配置已恢复");
		});
	}
}
