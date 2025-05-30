/*
 * @Author: mulingyuer
 * @Date: 2025-03-20 09:30:27
 * @LastEditTime: 2025-04-15 10:37:03
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
	config: Prettify<
		Omit<StartWanVideoTrainingData["config"], "learning_rate" | "dit" | "sample_prompts"> & {
			/** i2v wan2模型地址 */
			i2v_dit: string;
			/** t2v wan2模型地址 */
			t2v_dit: string;
			/** 学习率，默认：2e-06，需从string转换为数字 */
			learning_rate: string;
			/** i2v采样底图，生成采样必须要一张底图 */
			i2v_sample_image_path: string;
			/** i2v和t2v生成采样的文本 */
			sample_prompts: string;
		}
	>;
	/** 打标配置 */
	tagConfig: {
		/** 打标模型 */
		tag_model: string;
		/** joy-caption-alpha-two打标模型的提示词类型 */
		joy_caption_prompt_type: string;
		/** 是否添加原封不动输出到打标内容中 */
		is_add_global_prompt: boolean;
		/** 原封不动输出到打标内容 */
		global_prompt: string;
		/** 打标高级设置 */
		tag_advanced_settings: boolean;
		/** 打标提示词 */
		tag_global_prompt: string;
		/** 是否追加到已有打标文件中 */
		tag_is_append: boolean;
	};
	/** 训练的数据模式 */
	data_mode: "image" | "video";
	/** 数据集 */
	dataset: {
		general: StartWanVideoTrainingData["dataset"]["general"];
		datasets: [Prettify<StartWanVideoTrainingImageDataset & StartWanVideoTrainingVideoDataset1>];
	};
}
