/*
 * @Author: mulingyuer
 * @Date: 2025-04-01 16:48:50
 * @LastEditTime: 2025-04-01 17:27:24
 * @LastEditors: mulingyuer
 * @Description: 视频预览的hook
 * @FilePath: \frontend\src\hooks\useVideoPreview.ts
 * 怎么可能会有bug！！！
 */
import { useModalManagerStore } from "@/stores";
import type { VideoPreviewModal } from "@/stores";

export type PreviewVideo = Omit<VideoPreviewModal, "open">;

export function useVideoPreview() {
	const modelManagerStore = useModalManagerStore();
	const videoPreviewModal = storeToRefs(modelManagerStore).videoPreviewModal;

	/** 视频预览 */
	function previewVideo(data: PreviewVideo) {
		// 如果已有实例，先关闭
		if (videoPreviewModal.value.open) {
			modelManagerStore.resetVideoPreviewModal();
		}

		// 打开新的实例
		modelManagerStore.setVideoPreviewModal({
			...data,
			open: true
		});
	}

	/** 关闭视频预览 */
	function closePreviewVideo() {
		modelManagerStore.resetVideoPreviewModal();
	}

	return {
		previewVideo,
		closePreviewVideo
	};
}
