/*
 * @Author: mulingyuer
 * @Date: 2025-03-20 09:30:27
 * @LastEditTime: 2025-11-05 10:07:26
 * @LastEditors: mulingyuer
 * @Description: wan类型
 * @FilePath: \frontend\src\views\lora\wan-video\types.ts
 * 怎么可能会有bug！！！
 */
import type {
	StartWanVideoTrainingData,
	StartWanVideoTrainingImageDataset,
	StartWanVideoTrainingVideoDataset
} from "@/api/lora";
import type { AiTagRuleForm } from "@/components/AiTag/types";

type StartWanVideoTrainingVideoDataset1 = Omit<
	StartWanVideoTrainingVideoDataset,
	"target_frames"
> & {
	target_frames: TargetFrames;
};

export type TargetFrames = Array<{
	key: string;
	value: number | undefined;
}>;

/** 表单类型 */
export interface RuleForm
	extends Omit<StartWanVideoTrainingData, "config" | "frontend_config" | "dataset"> {
	/** 表单类型标识 */
	formType: Extract<TaskType, "wan-video">;
	config: Prettify<
		Omit<StartWanVideoTrainingData["config"], "sample_prompts"> & {
			/** i2v采样底图，生成采样必须要一张底图 */
			i2v_sample_image_path: string;
			/** i2v和t2v生成采样的文本 */
			sample_prompts: string;
		}
	>;
	/** 打标配置 */
	aiTagRuleForm: AiTagRuleForm;
	/** 训练的数据模式 */
	data_mode: "image" | "video";
	/** 数据集 */
	dataset: {
		general: StartWanVideoTrainingData["dataset"]["general"];
		datasets: [Prettify<StartWanVideoTrainingImageDataset & StartWanVideoTrainingVideoDataset1>];
	};
}
