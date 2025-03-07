/*
 * @Author: mulingyuer
 * @Date: 2025-03-07 14:38:08
 * @LastEditTime: 2025-03-07 14:47:58
 * @LastEditors: mulingyuer
 * @Description: 环境变量
 * @FilePath: \frontend\src\utils\env.ts
 * 怎么可能会有bug！！！
 */

function withDefaults<T>(env: T, defaults: Partial<T>): T {
	return {
		...defaults,
		...env
	};
}

/** 获取环境变量 */
export function getEnv(): ImportMetaEnv {
	return withDefaults(import.meta.env, {
		VITE_APP_WHITE_CHECK: "false",
		VITE_APP_LORA_OUTPUT_PARENT_PATH: "/root"
	});
}
