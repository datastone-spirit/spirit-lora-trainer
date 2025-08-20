/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 11:43:53
 * @LastEditTime: 2025-08-20 15:29:29
 * @LastEditors: mulingyuer
 * @Description: 数据仓库
 * @FilePath: \frontend\src\stores\index.ts
 * 怎么可能会有bug！！！
 */
import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { joinPrefixKey } from "@/utils/tools";

export const store = createPinia();
store.use(
	createPersistedState({
		key: (id) => joinPrefixKey(id)
	})
);

export const piniaStore = {
	install(app: App<Element>) {
		app.use(store);
	}
};

export * from "./modules";
