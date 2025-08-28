/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 15:10:20
 * @LastEditTime: 2025-08-28 10:06:31
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
import { getPreciseType } from "@/utils/tools";

export class LoRAHelper {
	/** 恢复表单数据的任务黑名单 */
	static readonly RECOVERY_TASK_FORM_DATA_BLACKLIST: Array<TaskType> = ["none", "tag"];

	/** 校验任务id是否有效 */
	static isValidTaskId(taskId: string | undefined | null): boolean {
		return !!taskId && taskId.trim() !== "";
	}

	/** 合并训练表单数据 */
	static mergeTrainingFormData(form: any, data: any) {
		// 如果源数据为 null 或 undefined，则直接返回目标数据
		if (data === null || data === void 0) return form;
		// 如果目标数据为 null 或 undefined，则直接返回源数据
		if (form === null || form === void 0) return data;

		const formType = getPreciseType(form);
		const dataType = getPreciseType(data);

		// 如果两者都是对象，进行属性合并
		if (formType === "object" && dataType === "object") {
			Object.keys(form).forEach((key) => {
				if (!Object.hasOwn(data, key)) return;
				const target = form[key];
				const source = data[key];

				const targetType = getPreciseType(target);
				const sourceType = getPreciseType(source);

				if (targetType === "object" && sourceType === "object") {
					form[key] = LoRAHelper.mergeTrainingFormData(target, source);
				} else if (targetType === "array" && sourceType === "array") {
					form[key] = LoRAHelper.mergeTrainingFormData(target, source);
				} else {
					form[key] = source;
				}
			});

			return form;
		}

		// 如果两者都是数组，进行元素合并
		if (formType === "array" && dataType === "array") {
			// 以缓存优先，让form的数组长度与data的数组长度一致
			form.length = data.length;

			// 遍历源数组，合并或追加元素
			data.forEach((item: any, index: number) => {
				const target = form[index];
				const source = item;

				const targetType = getPreciseType(target);
				const sourceType = getPreciseType(source);

				if (typeof target === "undefined") {
					// 如果目标数组在当前索引没有元素，直接追加源元素
					form[index] = source;
				} else if (targetType === "object" && sourceType === "object") {
					form[index] = LoRAHelper.mergeTrainingFormData(target, source);
				} else if (targetType === "array" && sourceType === "array") {
					form[index] = LoRAHelper.mergeTrainingFormData(target, source);
				} else {
					form[index] = source;
				}
			});

			return form;
		}

		// 如果类型不匹配或不是可合并的复杂类型（对象/数组），则直接用源数据覆盖目标数据
		return data;
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

	/** 去除提交表单中值为null|undefined|''的字段 */
	static removeEmptyFields(form: any): any {
		// 使用 void 0 代替 undefined，避免 undefined 被重新赋值的问题
		// 检查是否为空值：null、undefined、空字符串（trim后为空）
		if (form === null || form === void 0) {
			return void 0;
		}

		// 检查空字符串：必须是 string 类型且 trim 后为空
		if (typeof form === "string" && form.trim() === "") {
			return void 0;
		}

		// 使用 Object.prototype.toString.call 精确判断类型
		const type = Object.prototype.toString.call(form);

		// 如果不是数组也不是普通对象，原样返回
		if (type !== "[object Array]" && type !== "[object Object]") {
			return form;
		}

		// 数组处理
		if (type === "[object Array]") {
			const filteredArray = form
				.map((item: any) => LoRAHelper.removeEmptyFields(item))
				.filter((item: any) => item !== void 0);
			return filteredArray;
		}

		// 普通对象处理（只处理 {} 这种键值对象）
		const newObj: Record<string, any> = {};
		Object.keys(form).forEach((key) => {
			const processedValue = LoRAHelper.removeEmptyFields(form[key]);
			// 只有当处理后的值不是 undefined 时才添加到新对象中
			if (processedValue !== void 0) {
				newObj[key] = processedValue;
			}
		});

		return newObj;
	}
}
