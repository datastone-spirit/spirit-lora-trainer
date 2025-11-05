/*
 * @Author: mulingyuer
 * @Date: 2024-12-09 10:18:03
 * @LastEditTime: 2025-11-05 09:45:08
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \frontend\src\views\lora\flux\types.ts
 * 怎么可能会有bug！！！
 */
import type { AiTagRuleForm } from "@/components/AiTag/types";
import type { StartFluxTrainingData } from "@/api/lora";
import type { SimplifyDeep } from "type-fest";

export type Config = Omit<StartFluxTrainingData["config"], "resolution"> & {
	/** 分辨率 */
	resolution: [number, number];
};

export type RuleForm = SimplifyDeep<{
	/** 表单类型标识 */
	formType: Extract<TaskType, "flux">;
	/** 训练配置 */
	config: Config;
	/** 打标配置 */
	aiTagRuleForm: AiTagRuleForm;
	/** 数据集配置 */
	dataset: {
		/** 在随机打乱 tokens 时，保留前 N 个不变 */
		keep_tokens: number;
		/** 触发词 */
		class_tokens: string;
	};
}>;
