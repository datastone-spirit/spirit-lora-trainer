/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:42:02
 * @LastEditTime: 2024-12-04 17:08:35
 * @LastEditors: mulingyuer
 * @Description: 难易度指令
 * @FilePath: \frontend\src\directives\complexity\index.ts
 * 怎么可能会有bug！！！
 */
import type { CustomDirective } from "../types";
import { useSettingsStore } from "@/stores";

export const complexityDirective: CustomDirective = {
	name: "complexity",
	directive: {
		mounted: (el, binding) => {
			const settings = useSettingsStore();
			const { complexity } = storeToRefs(settings);

			function updateVisibility() {
				const shouldShow = complexity.value === binding.value;
				el.style.display = shouldShow ? "" : "none";
			}

			// 初始化显示状态
			updateVisibility();

			// 监听 Pinia store 的变化
			watch(complexity, () => {
				updateVisibility();
			});
		}
	}
};
