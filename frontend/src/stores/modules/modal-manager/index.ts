/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:36:24
 * @LastEditTime: 2025-07-31 15:28:53
 * @LastEditors: mulingyuer
 * @Description: 弹窗数据管理
 * @FilePath: \frontend\src\stores\modules\modal-manager\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";
import type {
	VideoPreviewModalData,
	LoraTaskLogModalData,
	ViewSamplingDrawerModalData
} from "./types";
export type * from "./types";

export const useModalManagerStore = defineStore("modalManager", () => {
	/** 是否显示lora保存路径警告弹窗 */
	const openLoraSavePathWarningModal = ref(false);

	/** 是否显示断网提示弹窗 */
	const openNetworkDisconnectModal = ref(false);

	/** 视频预览弹窗 */
	const videoPreviewModalData = ref<VideoPreviewModalData>({
		open: false,
		title: "",
		src: ""
	});

	/** lora任务日志弹窗 */
	const loraTaskLogModalData = ref<LoraTaskLogModalData>({
		open: false,
		taskId: ""
	});

	/** 查看采样数据抽屉 */
	const viewSamplingDrawerModalData = ref<ViewSamplingDrawerModalData>({
		open: false,
		filePath: ""
	});

	return {
		openLoraSavePathWarningModal,
		openNetworkDisconnectModal,
		videoPreviewModalData,
		loraTaskLogModalData,
		viewSamplingDrawerModalData
	};
});

export type UseModalManagerStore = ReturnType<typeof useModalManagerStore>;
