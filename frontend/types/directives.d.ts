/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 17:10:51
 * @LastEditTime: 2024-12-04 17:16:10
 * @LastEditors: mulingyuer
 * @Description: 自定义指令类型声明
 * @FilePath: \frontend\types\directives.d.ts
 * 怎么可能会有bug！！！
 */
import type { Component, Directive } from "vue";
import type { ComplexityEnum } from "@/enums/complexity.enum";

interface Directives {
	vComplexity: Directive<any, ComplexityEnum>;
}

declare module "vue" {
	// 在这里直接继承 Directives 即可
	interface ComponentCustomProperties extends Component, Directives {}
}
