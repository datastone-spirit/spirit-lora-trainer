/*
 * @Author: mulingyuer
 * @Date: 2025-07-23 17:50:46
 * @LastEditTime: 2025-07-24 10:15:55
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 帮助方法
 * @FilePath: \frontend\src\views\lora\flux-kontext\flex-kontext.helper.ts
 * 怎么可能会有bug！！！
 */
import { generateUUID } from "@/utils/tools";
import type { Datasets, SamplePrompts } from "./types";
import { getEnv } from "@/utils/env";

/** 生成默认样本提示对象 */
export function generateDefaultSamplePrompt(): SamplePrompts[number] {
	return {
		id: generateUUID(),
		prompt: "",
		ctrl_img: ""
	};
}

/** 生成默认数据集对象 */
export function generateDefaultDataset(index?: number): Datasets[number] {
	index = index ?? 0;
	const env = getEnv();

	return {
		id: generateUUID(),
		name: `数据集${index + 1}`,
		index: index,
		folder_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		control_path: env.VITE_APP_LORA_OUTPUT_PARENT_PATH,
		caption_dropout_rate: 0.05,
		shuffle_tokens: false,
		cache_latents_to_disk: false,
		is_reg: false,
		network_weight: 1,
		resolution: [512, 768],
		caption_ext: "txt"
	};
}
