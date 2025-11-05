/*
 * @Author: mulingyuer
 * @Date: 2025-07-25 15:10:20
 * @LastEditTime: 2025-11-05 14:14:41
 * @LastEditors: mulingyuer
 * @Description: 公共的lora帮助方法
 * @FilePath: \frontend\src\utils\lora\lora.helper\index.ts
 * 怎么可能会有bug！！！
 */
import { currentTaskFormConfig } from "@/api/task";
import { useSettingsStore, useTrainingStore } from "@/stores";
import { deepMerge, SerializeUndefined } from "@/utils/tools";
import type { RecoveryTaskFormDataOptions } from "./types";
export type * from "./types";
import { TASK_TYPE_NAME } from "@/constants";

export class LoRAHelper {
	/** 恢复表单数据的任务黑名单 */
	static readonly RECOVERY_TASK_FORM_DATA_BLACKLIST: Array<TaskType> = ["none", "tag"];

	/** 校验任务id是否有效 */
	static isValidTaskId(taskId: string | undefined | null): boolean {
		return !!taskId && taskId.trim() !== "";
	}

	/** 合并训练表单数据 */
	static mergeTrainingFormData(form: any, data: any) {
		return new Promise((resolve, reject) => {
			if (!Object.hasOwn(form, "formType")) {
				return resolve(deepMerge(form, data));
			}

			const formTypeName = TASK_TYPE_NAME[form.formType as TaskType] ?? "";
			const dataTypeName = TASK_TYPE_NAME[data.formType as TaskType] ?? "";

			// 校验数据来源
			if (!Object.hasOwn(data, "formType")) {
				ElMessageBox.confirm(
					`当前导入的${dataTypeName}训练配置，并不是当前页${formTypeName}的训练配置，如果继续合并，系统可能导入错误数据，是否继续？`,
					"合并警告",
					{
						confirmButtonText: "继续",
						cancelButtonText: "取消",
						type: "warning"
					}
				)
					.then(() => {
						return resolve(deepMerge(form, data));
					})
					.catch(() => {
						reject(new Error("用户取消了操作"));
					});
			} else if (form.formType !== data.formType) {
				reject(
					new Error(
						`当前导入的${TASK_TYPE_NAME[data.formType as TaskType]}训练配置，并不是${TASK_TYPE_NAME[form.formType as TaskType]}的训练配置，请检查导入的文件配置是否正确！`
					)
				);
			} else {
				resolve(deepMerge(form, data));
			}
		});
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
			const tomlData = SerializeUndefined.deserialize(JSON.parse(res.frontend_config));
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
