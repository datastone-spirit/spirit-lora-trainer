/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 14:54:12
 * @LastEditTime: 2025-01-09 15:12:30
 * @LastEditors: mulingyuer
 * @Description: 初始化训练器
 * @FilePath: \frontend\src\init-lora-trainer\index.ts
 * 怎么可能会有bug！！！
 */
import { initTask } from "./task";
import { initAnimatedFavicon } from "./animated-favicon";

export function initLoraTrainer() {
	return Promise.allSettled([initTask(), initAnimatedFavicon()]);
}
