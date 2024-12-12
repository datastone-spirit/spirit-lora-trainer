/*
 * @Author: mulingyuer
 * @Date: 2024-12-12 16:17:12
 * @LastEditTime: 2024-12-12 16:18:22
 * @LastEditors: mulingyuer
 * @Description: toml相关工具
 * @FilePath: \frontend\src\utils\toml.ts
 * 怎么可能会有bug！！！
 */
import { stringify } from "smol-toml";

/** 生成toml字符串 */
export function generateTomlString(obj: any): string {
	return stringify(obj);
}
