/*
 * @Author: mulingyuer
 * @Date: 2025-01-07 17:30:56
 * @LastEditTime: 2025-01-07 17:32:12
 * @LastEditors: mulingyuer
 * @Description: toml工具类型
 * @FilePath: \frontend\src\utils\toml\types.ts
 * 怎么可能会有bug！！！
 */

/** 将toml字符串转成文件并下载参数 */
export interface DownloadTomlFileOptions {
	/** toml字符串 */
	text: string;
	/** 文件名，默认为当前时间 */
	fileName?: string;
	/** 文件名前缀 */
	fileNamePrefix?: string;
}
