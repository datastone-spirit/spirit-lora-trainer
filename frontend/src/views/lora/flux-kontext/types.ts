/*
 * @Author: mulingyuer
 * @Date: 2025-07-22 11:55:18
 * @LastEditTime: 2025-10-13 12:17:17
 * @LastEditors: mulingyuer
 * @Description: flux-kontext 类型
 * @FilePath: \frontend\src\views\lora\flux-kontext\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartFluxKontextTrainingData } from "@/api/lora";
import type { AiTagRuleForm } from "@/components/AiTag/types";

type ProcessType = StartFluxKontextTrainingData["config"]["process"][number];

export type RuleForm = Prettify<
	Omit<ProcessType, "sample" | "datasets"> & {
		/** lora名称 */
		name: string;
		/** 打标配置 */
		aiTagRuleForm: AiTagRuleForm;
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
		/** 数据集选中的id */
		activeDatasetId: string;
	}
>;

export type SamplePrompts = RuleForm["sample"]["prompts"];

export type Datasets = RuleForm["datasets"];
export type DatasetItem = Datasets[number];
