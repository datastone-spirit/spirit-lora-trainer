/*
 * @Author: mulingyuer
 * @Date: 2024-10-11 17:10:47
 * @LastEditTime: 2024-12-26 16:57:06
 * @LastEditors: mulingyuer
 * @Description: dayjs封装
 * @FilePath: \frontend\src\utils\dayjs.ts
 * 怎么可能会有bug！！！
 */
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

/** 格式化日期 */
export function formatDate(date: Date | string | number, format: string): string {
	return dayjs(date).format(format);
}
