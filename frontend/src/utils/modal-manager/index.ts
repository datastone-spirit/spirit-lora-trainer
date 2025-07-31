/*
 * @Author: mulingyuer
 * @Date: 2025-07-31 11:51:22
 * @LastEditTime: 2025-07-31 15:19:35
 * @LastEditors: mulingyuer
 * @Description: 弹窗管理 - 所有的弹窗都应该通过这个管理器来管理
 * @FilePath: \frontend\src\utils\modal-manager\index.ts
 * 怎么可能会有bug！！！
 */
import { useModalManagerStore } from "@/stores";
import type {
	VideoPreviewModalData,
	LoraTaskLogModalData,
	ViewSamplingDrawerModalData
} from "@/stores";

/** lora保存路径警告弹窗 */
export class LoraSavePathWarningModal {
	private static _state: Ref<boolean> | null = null;

	static show() {
		useModalManagerStore().openLoraSavePathWarningModal = true;
	}

	static close() {
		useModalManagerStore().openLoraSavePathWarningModal = false;
	}

	static get state() {
		if (!LoraSavePathWarningModal._state) {
			LoraSavePathWarningModal._state =
				storeToRefs(useModalManagerStore()).openLoraSavePathWarningModal;
		}
		return LoraSavePathWarningModal._state;
	}
}

/** 断网提示弹窗 */
export class NetworkDisconnectModal {
	private static _state: Ref<boolean> | null = null;

	static show() {
		useModalManagerStore().openNetworkDisconnectModal = true;
	}

	static close() {
		useModalManagerStore().openNetworkDisconnectModal = false;
	}

	static get state() {
		if (!NetworkDisconnectModal._state) {
			NetworkDisconnectModal._state =
				storeToRefs(useModalManagerStore()).openNetworkDisconnectModal;
		}
		return NetworkDisconnectModal._state;
	}
}

/** 视频预览弹窗 */
export class VideoPreviewModal {
	private static _state: Ref<VideoPreviewModalData> | null = null;

	static show(data: Omit<VideoPreviewModalData, "open">) {
		// 如果已经打开了视频预览弹窗，则先关闭
		if (VideoPreviewModal.state.value.open) {
			VideoPreviewModal.close();
		}

		useModalManagerStore().videoPreviewModalData = {
			open: true,
			src: data.src,
			title: data.title
		};
	}

	static close() {
		useModalManagerStore().videoPreviewModalData = {
			open: false,
			src: "",
			title: ""
		};
	}

	static get state() {
		if (!VideoPreviewModal._state) {
			VideoPreviewModal._state = storeToRefs(useModalManagerStore()).videoPreviewModalData;
		}
		return VideoPreviewModal._state;
	}
}

/** lora任务日志弹窗 */
export class LoraTaskLogModal {
	private static _state: Ref<LoraTaskLogModalData> | null = null;

	static show(data: Omit<LoraTaskLogModalData, "open">) {
		useModalManagerStore().loraTaskLogModalData = {
			open: true,
			taskId: data.taskId
		};
	}

	static close() {
		useModalManagerStore().loraTaskLogModalData = {
			open: false,
			taskId: ""
		};
	}

	static get state() {
		if (!LoraTaskLogModal._state) {
			LoraTaskLogModal._state = storeToRefs(useModalManagerStore()).loraTaskLogModalData;
		}
		return LoraTaskLogModal._state;
	}
}

/** 查看采样数据抽屉 */
export class ViewSamplingDrawerModal {
	private static _state: Ref<ViewSamplingDrawerModalData> | null = null;

	static show(data: Omit<ViewSamplingDrawerModalData, "open">) {
		useModalManagerStore().viewSamplingDrawerModalData = {
			open: true,
			filePath: data.filePath
		};
	}

	static close() {
		useModalManagerStore().viewSamplingDrawerModalData = {
			open: false,
			filePath: ""
		};
	}

	static get state() {
		if (!ViewSamplingDrawerModal._state) {
			ViewSamplingDrawerModal._state =
				storeToRefs(useModalManagerStore()).viewSamplingDrawerModalData;
		}
		return ViewSamplingDrawerModal._state;
	}
}
