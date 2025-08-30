/*
 * @Author: mulingyuer
 * @Date: 2024-12-30 11:31:58
 * @LastEditTime: 2025-08-29 11:44:18
 * @LastEditors: mulingyuer
 * @Description: 自定义useLocalStorage
 * @FilePath: \frontend\src\hooks\useEnhancedStorage.ts
 * 怎么可能会有bug！！！
 */
import { deepMerge, SerializeUndefined } from "@/utils/tools";
import type { RemovableRef } from "@vueuse/core";

export interface EnhancedLocalStorageOptions<T = any> {
	localKey: string;
	defaultValue: T;
	version: string;
}

export function useEnhancedStorage() {
	/** 增强版的 useLocalStorage Ref
	 * 在从 localStorage 读取数据时，会校验其数据结构是否与默认值一致
	 * 如果不一致（例如，应用版本更新导致数据结构变更），则会使用默认值，防止程序出错
	 * @param localKey - localStorage 的键。
	 * @param defaultValue - 默认值，也作为结构校验的“模板”。
	 */
	function useEnhancedLocalStorage<T = any>(
		options: EnhancedLocalStorageOptions<T>
	): RemovableRef<T> {
		const { localKey, defaultValue, version } = options;

		return useLocalStorage<T>(localKey, defaultValue, {
			serializer: {
				read(raw) {
					try {
						if (!raw) return defaultValue;

						const parsedValue = JSON.parse(raw);

						// 检查版本号
						if (parsedValue.version !== version) return defaultValue;
						// 检查数据是否存在
						if (!parsedValue?.data) return defaultValue;

						const deserializedValue = SerializeUndefined.deserialize(parsedValue.data);

						return deepMerge(defaultValue, deserializedValue);
					} catch (error) {
						console.error("解析缓存的数据失败", error);
						return defaultValue;
					}
				},
				write: (value) => {
					// 将 undefined 替换为占位符
					const serialized = SerializeUndefined.serialize(value);
					return JSON.stringify({
						version,
						data: serialized
					});
				}
			}
		});
	}

	return {
		useEnhancedLocalStorage
	};
}
