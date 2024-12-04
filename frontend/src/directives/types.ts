/*
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:44:53
 * @LastEditTime: 2024-12-04 17:01:58
 * @LastEditors: mulingyuer
 * @Description: 自定义指令类型
 * @FilePath: \frontend\src\directives\types.ts
 * 怎么可能会有bug！！！
 */
import type { Directive } from "vue";

export interface CustomDirective {
	/** 指令名称 */
	name: string;
	/** 指令 */
	directive: Directive;
}
