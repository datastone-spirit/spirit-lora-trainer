/*
 * @Author: mulingyuer
 * @Date: 2024-09-25 16:21:59
 * @LastEditTime: 2025-01-21 09:22:51
 * @LastEditors: mulingyuer
 * @Description: 请求类型
 * @FilePath: \frontend\src\request\types.ts
 * 怎么可能会有bug！！！
 */

/** 请求结果的结构 */
export interface RequestResult<T = any> {
	code: number;
	message: string;
	success: boolean;
	data: T;
}
