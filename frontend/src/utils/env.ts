/*
 * @Author: mulingyuer
 * @Date: 2025-03-07 14:38:08
 * @LastEditTime: 2025-07-25 11:20:32
 * @LastEditors: mulingyuer
 * @Description: 环境变量
 * @FilePath: \frontend\src\utils\env.ts
 * 怎么可能会有bug！！！
 */

/** 默认环境变量配置 */
const DEFAULT_ENV: Partial<ImportMetaEnv> = {
	VITE_APP_WHITE_CHECK: "false",
	VITE_APP_LORA_OUTPUT_PARENT_PATH: "/root",
	VITE_APP_WAN_VIDEO_MAX_FRAMES: "129"
};

/** 获取环境变量
 *  默认会增加默认配置，以防止环境变量缺失导致使用时报错
 */
export const getEnv = (() => {
	let cache: ImportMetaEnv | null = null;

	return function getEnv() {
		if (!cache) {
			cache = readonly({
				...DEFAULT_ENV,
				...import.meta.env
			});
		}

		return cache;
	};
})();
