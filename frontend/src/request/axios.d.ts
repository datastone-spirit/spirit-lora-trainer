/*
 * @Author: mulingyuer
 * @Date: 2024-12-20 09:49:07
 * @LastEditTime: 2024-12-20 09:51:13
 * @LastEditors: mulingyuer
 * @Description: axios的类型定义文件
 * @FilePath: \frontend\src\request\axios.d.ts
 * 怎么可能会有bug！！！
 */
// import "axios";
import type { RequestConfig } from "./types";

declare module "axios" {
	type AxiosRequestConfig = RequestConfig;
}
