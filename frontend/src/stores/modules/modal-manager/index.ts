/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:36:24
 * @LastEditTime: 2025-04-03 09:28:38
 * @LastEditors: mulingyuer
 * @Description: 弹窗数据管理
 * @FilePath: \frontend\src\stores\modules\modal-manager\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type { VideoPreviewModal, LoraTaskLogModal, ViewSamplingDrawerModal } from "./types";
export type * from "./types";

export const useModalManagerStore = defineStore("modalManager", () => {
	/** lora保存路径警告弹窗 */
	const loraSavePathWarningModal = ref(false);
	function setLoraSavePathWarningModal(value: boolean) {
		loraSavePathWarningModal.value = value;
	}

	/** 断网提示弹窗 */
	const networkDisconnectModal = ref(false);
	function setNetworkDisconnectModal(value: boolean) {
		networkDisconnectModal.value = value;
	}

	/** 视频预览弹窗 */
	const videoPreviewModal = ref<VideoPreviewModal>({
		open: false,
		title: "",
		src: ""
	});
	function setVideoPreviewModal(value: VideoPreviewModal) {
		videoPreviewModal.value = value;
	}
	function resetVideoPreviewModal() {
		videoPreviewModal.value = {
			open: false,
			title: "",
			src: ""
		};
	}

	/** lora任务日志弹窗 */
	const loraTaskLogModal = ref<LoraTaskLogModal>({
		open: false,
		taskId: ""
	});
	function setLoraTaskLogModal(value: LoraTaskLogModal) {
		loraTaskLogModal.value = value;
	}
	function resetLoraTaskLogModal() {
		loraTaskLogModal.value = {
			open: false,
			taskId: ""
		};
	}

	/** 查看采样数据抽屉 */
	const viewSamplingDrawerModal = ref<ViewSamplingDrawerModal>({
		open: false,
		filePath: ""
	});
	function setViewSamplingDrawerModal(value: ViewSamplingDrawerModal) {
		viewSamplingDrawerModal.value = value;
	}
	function resetViewSamplingDrawerModal() {
		viewSamplingDrawerModal.value = {
			open: false,
			filePath: ""
		};
	}

	return {
		loraSavePathWarningModal,
		setLoraSavePathWarningModal,
		networkDisconnectModal,
		setNetworkDisconnectModal,
		videoPreviewModal,
		setVideoPreviewModal,
		resetVideoPreviewModal,
		loraTaskLogModal,
		setLoraTaskLogModal,
		resetLoraTaskLogModal,
		viewSamplingDrawerModal,
		setViewSamplingDrawerModal,
		resetViewSamplingDrawerModal
	};
});

export type UseModalManagerStore = ReturnType<typeof useModalManagerStore>;
