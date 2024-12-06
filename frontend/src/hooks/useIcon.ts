/*
 * @Author: mulingyuer
 * @Date: 2024-10-11 17:11:35
 * @LastEditTime: 2024-10-11 17:16:21
 * @LastEditors: mulingyuer
 * @Description: 函数式组件中使用icon的hook
 * @FilePath: \element-admin-template\src\hooks\useIcon.ts
 * 怎么可能会有bug！！！
 */
import Icon from "@/components/Icon/Icon.vue";

export interface UseIconProps {
	/** 图标名称 */
	name: string;
	/** 图标大小，默认16 */
	size?: string | number;
	/** 图标颜色，默认继承父元素颜色 */
	color?: string;
}

export function useIcon(props: UseIconProps) {
	return h(Icon, { ...props });
}
