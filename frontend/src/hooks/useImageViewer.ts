/*
 * @Author: mulingyuer
 * @Date: 2024-12-16 09:50:57
 * @LastEditTime: 2025-02-08 09:16:33
 * @LastEditors: mulingyuer
 * @Description: 图片预览
 * @FilePath: \frontend\src\hooks\useImageViewer.ts
 * 怎么可能会有bug！！！
 */
import { createVNode, render } from "vue";
import { ElImageViewer } from "element-plus";
import type { ImageViewerProps } from "element-plus";

export type PreviewOption = Partial<ImageViewerProps> & {
	filenameList?: string[];
};

export function useImageViewer() {
	/** 图片预览 */
	function previewImages({ filenameList, ...options }: PreviewOption) {
		const container = document.createElement("div");
		let vmDom: Element | null = null;
		const currentIndex = ref(options.initialIndex ?? 0);

		const vm = createVNode(
			ElImageViewer,
			{
				...options,
				onClose() {
					render(null, container);
					vmDom && document.body.removeChild(vmDom);
					container.remove();
				},
				onSwitch(newIndex: number) {
					currentIndex.value = newIndex;
				}
			},
			{
				default: () => {
					if (!filenameList) return null;
					const filename = filenameList[currentIndex.value] ?? "";
					return filename
						? h(
								"div",
								{
									class: "el-image-viewer__file_name"
								},
								filename
							)
						: null;
				}
			}
		);

		// 将组件渲染成真实节点
		render(vm, container);
		vmDom = container.firstElementChild!;
		document.body.appendChild(vmDom);
	}

	return {
		previewImages
	};
}
