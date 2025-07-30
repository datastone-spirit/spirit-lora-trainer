/*
 * @Author: mulingyuer
 * @Date: 2024-12-30 11:31:58
 * @LastEditTime: 2025-07-30 17:02:09
 * @LastEditors: mulingyuer
 * @Description: 自定义useLocalStorage
 * @FilePath: \frontend\src\hooks\useEnhancedStorage.ts
 * 怎么可能会有bug！！！
 */
import type { RemovableRef } from "@vueuse/core";

export function useEnhancedStorage() {
	/** 检查两个object是否具有相同的“结构” */
	function isSameStructure(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
		const keys1: string[] = Object.keys(obj1);
		const keys2: string[] = Object.keys(obj2);

		// 简单判断两个对象key数量是否相同
		if (keys1.length !== keys2.length) return false;

		// 复杂判断两个对象key是否完全相同
		const keySet: Set<string> = new Set(keys2);
		return keys1.every((key: string) => keySet.has(key));
	}

	/**
	 * 获取一个值的精确类型字符串。
	 * @param value - 任何 JavaScript 值。
	 * @returns 类型的字符串表示，例如 "object", "array", "string"。
	 */
	function getPreciseType(value: any): string {
		return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
	}

	/** 增强版的 useLocalStorage Ref
	 * 在从 localStorage 读取数据时，会校验其数据结构是否与默认值一致
	 * 如果不一致（例如，应用版本更新导致数据结构变更），则会使用默认值，防止程序出错
	 * @param localKey - localStorage 的键。
	 * @param defaultValue - 默认值，也作为结构校验的“模板”。
	 */
	function useEnhancedLocalStorage<T = any>(localKey: string, defaultValue: T): RemovableRef<T> {
		return useLocalStorage<T>(localKey, defaultValue, {
			serializer: {
				read(raw) {
					try {
						if (!raw) return defaultValue;

						const parsedValue = JSON.parse(raw);
						const parsedType = getPreciseType(parsedValue);
						const defaultType = getPreciseType(defaultValue);

						// 如果类型不匹配或解析的值不是对象，则返回默认值
						if (parsedType !== defaultType || parsedType !== "object") {
							return defaultValue;
						}

						// 检查对象结构是否相同，如果不相同，则使用默认对象
						if (
							!isSameStructure(
								parsedValue as Record<string, unknown>,
								defaultValue as Record<string, unknown>
							)
						) {
							return defaultValue;
						}

						// 如果结构相同，则返回解析的值
						return parsedValue;
					} catch (error) {
						console.error("解析缓存的数据失败", error);
						return defaultValue;
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
