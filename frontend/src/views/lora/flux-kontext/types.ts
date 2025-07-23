/*
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:55:18
 * @LastEditTime: 2025-07-22 17:01:11
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 类型
 * @FilePath: \frontend\src\views\lora\flux-kontext\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartFluxKontextTrainingData } from "@/api/lora";
import type { OmitDeep } from "type-fest";

export type RuleForm = Prettify<
	OmitDeep<StartFluxKontextTrainingData, "config.sample.samples"> & {
		/** 打标配置 */
		tagConfig: {
			/** 打标模型 */
			tagger_model: string;
			/** joy-caption-alpha-two打标模型的提示词类型 */
			joy_caption_prompt_type: string;
			/** 是否添加原封不动输出到打标内容中 */
			is_add_global_prompt: boolean;
			/** 原封不动输出到打标内容 */
			global_prompt: string;
			/** 打标高级设置 */
			tagger_advanced_settings: boolean;
			/** 打标提示词 */
			tagger_global_prompt: string;
			/** 是否追加到已有打标文件中 */
			tagger_is_append: boolean;
		};
		/** 采样 */
		config: {
			sample: {
				samples: Array<
					StartFluxKontextTrainingData["config"]["sample"]["samples"][0] & {
						id: string;
					}
				>;
			};
		};
	}
>;
