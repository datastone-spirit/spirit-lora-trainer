import type { ManualTagInfoResult } from "@/api/monitor";

/*
 * @Author: mulingyuer
 * @Date: 2025-03-20 11:36:57
 * @LastEditTime: 2025-03-27 08:57:09
 * @LastEditors: mulingyuer
 * @Description: 打标类型
 * @FilePath: \frontend\src\hooks\useTag\types.ts
 * 怎么可能会有bug！！！
 */
export type { BatchTagData } from "@/api/tag";
export type { TagData } from "@/stores";

/** 打标选项 */
export interface TagOptions {
	/** 打标模型 */
	tagModel: string;
	/** 打标的目录 */
	tagDir: string;
	/** 打标模型为：Joy Caption2时，需要具体的打标类型 */
	joyCaptionPromptType?: string;
	/** 是否添加原封不动输出到打标内容中 */
	isAddGlobalPrompt: boolean;
	/** 原封不动输出到打标内容中的文本，isAddGlobalPrompt为true时有效 */
	globalPrompt?: string;
	/** 打标时给AI的提示词（用于生成打标内容） */
	tagPrompt: string;
	/** 打标的是内容是否追加到原有内容后面 */
	isAppend: boolean;
	/** 是否显示任务开始提示 */
	showTaskStartPrompt: boolean;
}

/** 打标校验参数 */
export interface ValidateTagOptions extends TagOptions {
	/** 是否显示错误消息弹窗 */
	showErrorMessage: boolean;
}

/** 打标校验规则 */
export type ValidateTagRules = Array<{
	condition: () => boolean | Promise<boolean>;
	message: string;
}>;

/** 打标校验结果 */
export interface ValidateTagResult {
	isValid: boolean;
	message: string;
}

/** 查询打标任务的状态 */
export type QueryTagTaskStatus =
	| "idle" // 空闲
	| "querying" // 查询中
	| "paused" // 暂停中
	| "success" // 成功
	| "failure"; // 失败

/** 查询打标任务的相关信息 */
export interface QueryTagTaskInfo {
	/** 任务id */
	taskId: string;
	/** 当前查询的状态 */
	status: QueryTagTaskStatus;
	/** 查询定时器 */
	timer: number | null;
	/** 查询定时器延迟（ms） */
	delay: number;
}

/** 打标事件订阅 */
export type TagEvents = {
	/** 打标成功 */
	complete: void;
	/** 打标失败 */
	failed: void;
	/** 打标数据更新 */
	update: void;
};

/** 初始化打标参数 */
export interface InitQueryTagTaskOptions {
	/** API返回的打标任务数据 */
	tagTaskData: ManualTagInfoResult;
	/** 是否显示任务开始提示 */
	showTaskStartPrompt: boolean;
}
