/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:14:16
 * @LastEditTime: 2024-12-04 17:17:40
 * @LastEditors: mulingyuer
 * @Description: 设置数据仓库
 * @FilePath: \frontend\src\stores\modules\settings\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import { ComplexityEnum } from "@/enums/complexity.enum";

export const useSettingsStore = defineStore(
	"settings",
	() => {
		/** 表单复杂度 */
		const complexity = ref<ComplexityEnum>(ComplexityEnum.BEGINNER);
		function setComplexity(value: ComplexityEnum) {
			complexity.value = value;
		}

		/** 是否新手难度 */
		const isBeginner = computed(() => complexity.value === ComplexityEnum.BEGINNER);
		/** 是否专家难度 */
		const isExpert = computed(() => complexity.value === ComplexityEnum.EXPERT);

		return {
			complexity,
			setComplexity,
			isBeginner,
			isExpert
		};
	},
	{
		persist: true
	}
);
