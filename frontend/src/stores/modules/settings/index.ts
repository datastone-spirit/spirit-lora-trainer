/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:14:16
 * @LastEditTime: 2025-01-09 18:17:38
 * @LastEditors: mulingyuer
 * @Description: 设置数据仓库
 * @FilePath: \frontend\src\stores\modules\settings\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import { ComplexityEnum } from "@/enums/complexity.enum";
import { SplitRightEnum } from "@/enums/split-right.enum";
import type { TrainerSettings } from "./types";
export type * from "./types";

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

		/** split右侧显示的设置 */
		const splitRightType = ref<SplitRightEnum>(SplitRightEnum.AI_DATASET);
		function setSplitRightType(value: SplitRightEnum) {
			splitRightType.value = value;
		}

		/** 是否显示AI数据集 */
		const showAIDataset = computed(() => splitRightType.value === SplitRightEnum.AI_DATASET);
		/** 是否显示toml预览 */
		const showTomlPreview = computed(() => splitRightType.value === SplitRightEnum.TOML_PREVIEW);

		/** 训练器设置 */
		const trainerSettings = ref<TrainerSettings>({
			openAnimatedFavicon: true,
			openFooterBarProgress: true
		});

		return {
			complexity,
			setComplexity,
			isBeginner,
			isExpert,
			splitRightType,
			setSplitRightType,
			showAIDataset,
			showTomlPreview,
			trainerSettings
		};
	},
	{
		persist: true
	}
);
