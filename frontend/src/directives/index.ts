/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 17:00:59
 * @LastEditTime: 2024-12-04 17:02:09
 * @LastEditors: mulingyuer
 * @Description: 自定义指令入口
 * @FilePath: \frontend\src\directives\index.ts
 * 怎么可能会有bug！！！
 */
import type { App } from "vue";
import { complexityDirective } from "./complexity";

const directives = [complexityDirective];

export default {
	install(app: App) {
		directives.forEach((directive) => {
			app.directive(directive.name, directive.directive);
		});
	}
};
