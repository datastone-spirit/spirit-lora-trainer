/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:14:16
 * @LastEditTime: 2024-12-04 16:18:36
 * @LastEditors: mulingyuer
 * @Description: 设置数据仓库
 * @FilePath: \frontend\src\stores\modules\settings\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import { ComplexityEnum } from "./types";

export const useSettingsStore = defineStore(
	"settings",
	() => {
		/** 表单复杂度 */
		const complexity = ref<ComplexityEnum>(ComplexityEnum.BEGINNER);
		function setComplexity(value: ComplexityEnum) {
			complexity.value = value;
		}

		return {
			complexity,
			setComplexity
		};
	},
	{
		persist: true
	}
);
