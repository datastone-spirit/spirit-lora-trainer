/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 14:53:53
 * @LastEditTime: 2024-10-15 11:53:46
 * @LastEditors: mulingyuer
 * @Description: element-plus
 * @FilePath: \element-admin-template\src\plugins\element-plus.ts
 * 怎么可能会有bug！！！
 */
import * as ElementPlusIcons from "@element-plus/icons-vue";
import type { App } from "vue";
import "element-plus/theme-chalk/display.css";
import { ElTable } from "element-plus";

/** 定制化element-plus组件 */
function customElementPlus(app: App) {
	// table
	const TableProps = ElTable.props;
	TableProps.stripe = { type: Boolean, default: true };
	TableProps.size = { type: String, default: "large" };

	const components = [ElTable];
	components.forEach((component) => {
		app.use(component);
	});
}

export const ElementPlusPlugin = {
	install(app: App) {
		// 全局注册ElementPlus图标
		for (const [key, component] of Object.entries(ElementPlusIcons)) {
			app.component(key, component);
		}
		// 定制化element-plus组件
		customElementPlus(app);
	}
};
