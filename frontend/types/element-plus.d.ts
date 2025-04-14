/*
 * @Author: mulingyuer
 * @Date: 2025-03-26 09:08:40
 * @LastEditTime: 2025-03-26 09:28:08
 * @LastEditors: mulingyuer
 * @Description: 补充element-plus的类型定义文件
 * @FilePath: \frontend\types\element-plus.d.ts
 * 怎么可能会有bug！！！
 */
import type { ElOption } from "element-plus";

declare global {
	/** ElOption数据类型 */
	type ElOptionProps = InstanceType<typeof ElOption>["$props"];
	type ElOptions = Array<ElOptionProps>;
}
