/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 11:43:53
 * @LastEditTime: 2024-12-04 16:24:46
 * @LastEditors: mulingyuer
 * @Description: 数据仓库
 * @FilePath: \frontend\src\stores\index.ts
 * 怎么可能会有bug！！！
 */
import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";

export const store = createPinia();
store.use(
	createPersistedState({
		key: (id) => `__spirit-lora-trainer__${id}`
	})
);

export const piniaStore = {
	install(app: App<Element>) {
		app.use(store);
	}
};

export * from "./modules";
