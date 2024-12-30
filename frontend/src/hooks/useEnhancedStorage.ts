/*
 * @Author: mulingyuer
 * @Date: 2024-12-30 11:31:58
 * @LastEditTime: 2024-12-30 11:50:37
 * @LastEditors: mulingyuer
 * @Description: 自定义useLocalStorage
 * @FilePath: \frontend\src\hooks\useEnhancedStorage.ts
 * 怎么可能会有bug！！！
 */

import type { RemovableRef } from "@vueuse/core";

export function useEnhancedStorage() {
	/** 自定义useLocalStorage
	 *  支持当缓存中的数据缺少字段时,自动从默认对象中补充
	 */
	function useEnhancedLocalStorage<T = any>(localKey: string, defaultValue: T): RemovableRef<T> {
		return useLocalStorage<T>(localKey, defaultValue, {
			serializer: {
				read(raw) {
					try {
						const obj = raw !== null ? JSON.parse(raw) : null;
						if (!obj) return defaultValue;
						if (Object.prototype.toString.call(obj) !== "[object Object]") return obj;
						// 检查是否缺少字段
						const localObjKeys = new Set(Object.keys(obj));
						const defaultObjKeys = new Set(Object.keys(defaultValue as Record<string, any>));
						const missingKeys = [...defaultObjKeys].filter((key) => !localObjKeys.has(key));
						missingKeys.forEach((key) => {
							// @ts-expect-error 去除ts类型警告
							obj[key] = defaultValue[key];
						});

						return obj;
					} catch (error) {
						console.error("解析缓存的数据失败", error);
						return null;
					}
				},
				write: (value) => JSON.stringify(value)
			}
		});
	}

	return {
		useEnhancedLocalStorage
	};
}
