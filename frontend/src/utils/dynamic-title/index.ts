/*
 * @Author: mulingyuer
 * @Date: 2025-09-04 16:09:39
 * @LastEditTime: 2025-09-04 16:42:18
 * @LastEditors: mulingyuer
 * @Description: 动态标题
 * @FilePath: \frontend\src\utils\dynamic-title\index.ts
 * 怎么可能会有bug！！！
 */
import { getEnv } from "@/utils/env";

class DynamicTitle {
	/** 原始标题 */
	private readonly originalTitle = getEnv().VITE_APP_TITLE;
	/** 是否已修改标题 */
	private modified = false;
	/** 异步延迟恢复的timer */
	private delayTimer: number | null = null;

	/** 设置标题 */
	public setTitle(title: string) {
		this.modified = true;

		document.title = title;
	}

	/** 当前标题是否已经修改过 */
	public isModified() {
		return this.modified;
	}

	/** 恢复原始标题 */
	public restore() {
		document.title = this.originalTitle;
		this.modified = false;
	}

	/** 延迟恢复原始标题 */
	public delayRestore(delay = 1000) {
		if (this.delayTimer) clearTimeout(this.delayTimer);
		this.delayTimer = setTimeout(() => {
			this.restore();
			this.delayTimer = null;
		}, delay);
	}

	/** 前头追加标题 */
	public prependTitle(title: string, spacer = " - ") {
		document.title = `${title}${spacer}${this.originalTitle}`;
		this.modified = true;
	}

	/** 后尾追加标题 */
	public appendTitle(title: string, spacer = " - ") {
		document.title = `${this.originalTitle}${spacer}${title}`;
		this.modified = true;
	}
}

export const dynamicTitle = new DynamicTitle();
