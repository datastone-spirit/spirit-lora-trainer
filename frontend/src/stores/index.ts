/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 11:43:53
 * @LastEditTime: 2024-12-18 09:15:01
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
		key: (id) => `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}${id}`
	})
);

export const piniaStore = {
	install(app: App<Element>) {
		app.use(store);
	}
};

export * from "./modules";
