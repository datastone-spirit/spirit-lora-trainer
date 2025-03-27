/*
 * @Author: mulingyuer
 * @Date: 2025-03-27 09:36:24
 * @LastEditTime: 2025-03-27 16:23:28
 * @LastEditors: mulingyuer
 * @Description: 弹窗数据管理
 * @FilePath: \frontend\src\stores\modules\modal-manager\index.ts
 * 怎么可能会有bug！！！
 */
import { defineStore } from "pinia";

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

	return {
		loraSavePathWarningModal,
		setLoraSavePathWarningModal,
		networkDisconnectModal,
		setNetworkDisconnectModal
	};
});

export type UseModalManagerStore = ReturnType<typeof useModalManagerStore>;
