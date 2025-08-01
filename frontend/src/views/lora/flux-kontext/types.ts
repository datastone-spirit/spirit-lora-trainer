/*
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:55:18
 * @LastEditTime: 2025-07-25 08:42:01
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 类型
 * @FilePath: \frontend\src\views\lora\flux-kontext\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartFluxKontextTrainingData } from "@/api/lora";

type ProcessType = StartFluxKontextTrainingData["config"]["process"][number];

export type RuleForm = Prettify<
	Omit<ProcessType, "sample" | "datasets"> & {
		/** lora名称 */
		name: string;
		/** 打标配置 */
		tagConfig: {
			/** 打标模型 */
			tagger_model: string;
			/** joy-caption-alpha-two打标模型的提示词类型 */
			joy_caption_prompt_type: string;
			/** 是否添加原封不动输出到打标内容中 */
			is_add_global_prompt: boolean;
			/** 打标高级设置 */
			tagger_advanced_settings: boolean;
			/** 打标提示词 */
			tagger_global_prompt: string;
			/** 是否追加到已有打标文件中 */
			tagger_is_append: boolean;
		};
		/** 采样 */
		sample: Prettify<
			Omit<ProcessType["sample"], "prompts"> & {
				/** 样本提示 */
				prompts: Array<{
					id: string;
					/** 采样提示词 */
					prompt: string;
					/** 采样图片路径（原图路径） */
					ctrl_img: string;
				}>;
			}
		>;
		/** 数据集 */
		datasets: Array<
			Prettify<
				ProcessType["datasets"][0] & {
					id: string;
					name: string;
					/** 下标 */
					index: number;
					/** 切换右侧数据集预览 */
					preview: "folder_path" | "control_path";
				}
			>
		>;
	}
>;

export type SamplePrompts = RuleForm["sample"]["prompts"];

export type Datasets = RuleForm["datasets"];
