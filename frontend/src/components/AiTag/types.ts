/*
 * @Author: mulingyuer
 * @Date: 2025-10-13 12:15:55
 * @LastEditTime: 2025-10-13 12:15:55
 * @LastEditors: mulingyuer
 * @Description: AiTag类型
 * @FilePath: \frontend\src\components\AiTag\types.ts
 * 怎么可能会有bug！！！
 */
import type { BatchTagData } from "@/api/tag";
import type { SimplifyDeep } from "type-fest";

export type AiTagRuleForm = SimplifyDeep<
	Required<BatchTagData> & {
		/** 高级设置，默认："" */
		advanced_setting: string;
	}
>;
