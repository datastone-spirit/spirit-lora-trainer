/*
 * @Author: mulingyuer
 * @Date: 2025-08-12 16:07:33
 * @LastEditTime: 2025-11-05 10:06:30
 * @LastEditors: mulingyuer
 * @Description: qwen-image 类型定义
 * @FilePath: \frontend\src\views\lora\qwen-image\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartQwenImageTrainingData } from "@/api/lora";
import type { SimplifyDeep, Simplify } from "type-fest";
import type { AiTagRuleForm } from "@/components/AiTag/types";

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
type TrainingConfig = Omit<
	OriginTrainingData["config"],
	"network_weights" | "edit" | "edit_plus"
> & {
	network_weights: string;
	/** 训练lora的type */
	lora_type: "qwen_image" | "qwen_image_edit" | "qwen_image_edit_2509";
};
type TrainingData = SimplifyDeep<Omit<OriginTrainingData, "config"> & { config: TrainingConfig }>;

export type RuleForm = SimplifyDeep<
	TrainingData & {
		/** 表单类型标识 */
		formType: Extract<TaskType, "qwen-image">;
		/** 数据集 */
		dataset: {
			general: DatasetGeneral;
			datasets: DatasetItem[];
		};
		/** 数据集选中的id */
		activeDatasetId: string;
		/** 打标配置 */
		aiTagRuleForm: AiTagRuleForm;
	}
>;
