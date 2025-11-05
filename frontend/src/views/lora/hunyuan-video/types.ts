/*
 * @Author: mulingyuer
 * @Date: 2025-01-06 10:37:35
 * @LastEditTime: 2025-11-05 10:04:16
 * @LastEditors: mulingyuer
 * @Description: 混元视频类型定义
 * @FilePath: \frontend\src\views\lora\hunyuan-video\types.ts
 * 怎么可能会有bug！！！
 */
import type { StartHyVideoTrainingData } from "@/api/lora";
import type { Merge, SimplifyDeep } from "type-fest";
import type { AiTagRuleForm } from "@/components/AiTag/types";

type HyVideoTrainingConfig = Omit<
	StartHyVideoTrainingData["config"],
	"frontend_config" | "frame_buckets"
>;

// 目录项类型
type DirectoryItem = Merge<
	Omit<StartHyVideoTrainingData["dataset"]["directory"][number], "frame_buckets">,
	{ frame_buckets: Array<{ key: string; value: number | undefined }> }
>;

type Dateset = SimplifyDeep<
	Merge<Omit<StartHyVideoTrainingData["dataset"], "directory">, { directory: Array<DirectoryItem> }>
>;

/** 表单类型 */
export type RuleForm = SimplifyDeep<{
	/** 表单类型标识 */
	formType: Extract<TaskType, "hunyuan-video">;
	config: HyVideoTrainingConfig;
	dataset: Dateset;
	/** 打标配置 */
	aiTagRuleForm: AiTagRuleForm;
}>;
