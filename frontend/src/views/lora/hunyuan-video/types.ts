/*
 * @Author: mulingyuer
 * @Date: 2025-01-06 10:37:35
 * @LastEditTime: 2025-01-06 15:30:37
 * @LastEditors: mulingyuer
 * @Description: 混元视频类型定义
 * @FilePath: \frontend\src\views\lora\hunyuan-video\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartHyVideoTrainingData } from "@/api/lora";

/** 表单 */
export interface RuleForm extends StartHyVideoTrainingData {
	/** 打标模型 */
	tagger_model: string;
	/** joy-caption-alpha-two打标模型的提示词类型 */
	prompt_type: string;
	/** 是否把触发词输出到打标文件中 */
	output_trigger_words: boolean;
}

/** 表单props */
export type RuleFormProps = {
	[K in keyof RuleForm]: K;
};
