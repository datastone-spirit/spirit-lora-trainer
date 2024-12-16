/*
 * @Author: mulingyuer
 * @Date: 2024-12-16 09:50:57
 * @LastEditTime: 2024-12-16 10:11:57
 * @LastEditors: mulingyuer
 * @Description: 图片预览
 * @FilePath: \frontend\src\hooks\useImageViewer.ts
 * 怎么可能会有bug！！！
 */
import { createVNode, render } from "vue";
import { ElImageViewer } from "element-plus";
import type { ImageViewerProps } from "element-plus";

export type PreviewOption = Partial<ImageViewerProps>;

export function useImageViewer() {
	/** 图片预览 */
	function previewImages(options: PreviewOption) {
		const container = document.createElement("div");
		let vmDom: Element | null = null;
		const vm = createVNode(ElImageViewer, {
			...options,
			onClose() {
				render(null, container);
				vmDom && document.body.removeChild(vmDom);
			}
		});

		// 将组件渲染成真实节点
		render(vm, container);
		vmDom = container.firstElementChild!;
		document.body.appendChild(vmDom);

		// 销毁容器
		container.remove();
	}

	return {
		previewImages
	};
}
