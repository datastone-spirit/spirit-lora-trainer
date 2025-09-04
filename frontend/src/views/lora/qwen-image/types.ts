/*
 * @Author: mulingyuer
 * @Date: 2025-08-12 16:07:33
 * @LastEditTime: 2025-09-04 10:01:49
 * @LastEditors: mulingyuer
 * @Description: qwen-image 类型定义
 * @FilePath: \frontend\src\views\lora\qwen-image\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartQwenImageTrainingData } from "@/api/lora";
import type { SimplifyDeep, Simplify } from "type-fest";
import type { AiTagRuleForm } from "@/components/AiTag/index.vue";

export type Dataset = StartQwenImageTrainingData["dataset"];
export type DatasetGeneral = StartQwenImageTrainingData["dataset"]["general"];
export type DatasetItem = Simplify<
	StartQwenImageTrainingData["dataset"]["datasets"][number] & {
		id: string;
		name: string;
		index: number;
		/** 切换右侧数据集预览 */
		preview: "image_directory" | "control_directory";
	}
>;

type OriginTrainingData = Omit<StartQwenImageTrainingData, "frontend_config" | "dataset">;
type TrainingConfig = Omit<OriginTrainingData["config"], "network_weights"> & {
	network_weights: string;
};
type TrainingData = SimplifyDeep<Omit<OriginTrainingData, "config"> & { config: TrainingConfig }>;

export type RuleForm = SimplifyDeep<
	TrainingData & {
		/** 数据集 */
		dataset: {
			general: DatasetGeneral;
			datasets: DatasetItem[];
		};
		/** 数据集选中的id */
		activeDatasetId: string;
		/** 打标配置 */
		aiTagRuleForm: AiTagRuleForm;
		/** 打标配置 */
		// tagConfig: {
		// 	/** 打标模型 */
		// 	tagger_model: string;
		// 	/** joy-caption-alpha-two打标模型的提示词类型 */
		// 	joy_caption_prompt_type: string;
		// 	/** 是否添加原封不动输出到打标内容中 */
		// 	is_add_global_prompt: boolean;
		// 	/** 原封不动输出到打标内容 */
		// 	global_prompt: string;
		// 	/** 打标高级设置 */
		// 	tagger_advanced_settings: boolean;
		// 	/** 打标提示词 */
		// 	tagger_global_prompt: string;
		// 	/** 是否追加到已有打标文件中 */
		// 	tagger_is_append: boolean;
		// };
	}
>;
