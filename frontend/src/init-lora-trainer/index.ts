/*
 * @Author: mulingyuer
 * @Date: 2025-01-09 14:54:12
 * @LastEditTime: 2025-09-01 15:18:26
 * @LastEditors: mulingyuer
 * @Description: 初始化训练器
 * @FilePath: \frontend\src\init-lora-trainer\index.ts
 * 怎么可能会有bug！！！
 */
import { initTask } from "./task";
import { initAnimatedFavicon } from "./animated-favicon";
import { initGPU } from "./gpu";

export function initLoraTrainer() {
	return Promise.allSettled([initGPU(), initTask(), initAnimatedFavicon()]);
}
