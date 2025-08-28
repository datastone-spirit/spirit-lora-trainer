/*
 * @Author: mulingyuer
 * @Date: 2024-12-30 11:31:58
 * @LastEditTime: 2025-08-28 10:07:26
 * @LastEditors: mulingyuer
 * @Description: 自定义useLocalStorage
 * @FilePath: \frontend\src\hooks\useEnhancedStorage.ts
 * 怎么可能会有bug！！！
 */
import type { RemovableRef } from "@vueuse/core";

export function useEnhancedStorage() {
	/** undefined 占位符 */
	const UNDEFINED_PLACEHOLDER = "__undefined__";

	/**
	 * 获取一个值的精确类型字符串。
	 * @param value - 任何 JavaScript 值。
	 * @returns 类型的字符串表示，例如 "object", "array", "string"。
	 */
	function getPreciseType(value: any): string {
		return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
	}

	/** 检查两个对象是否具有相同的“结构” */
	function isSameStructure(templateObj: any, dataObj: any): boolean {
		// 检查顶级类型是否一致，（例如：一个是对象，另一个是数组或原始类型）
		const templateType = getPreciseType(templateObj);
		const dataType = getPreciseType(dataObj);

		if (templateType === "undefined" || templateType === "null") return true;
		if (templateType !== dataType) return false;

		// 如果是数组
		if (templateType === "array") {
			if (dataType !== "array") return false;

			// 如果模板数组是空的
			if (templateObj.length === 0) {
				if (dataObj.length === 0) return true;

				// 如果缓存有数据，而模板数组为空，预计为相同，返回true
				return true;
			} else {
				// 模板数组有值
				if (dataObj.length === 0) return false;

				// 递归模板中已有的对象结构
				for (let i = 0, len = templateObj.length; i < len; i++) {
					if (!isSameStructure(templateObj[i], dataObj[i])) return false;
				}

				// 数组所有元素结构都匹配
				return true;
			}
		}

		// 如果是键值对象
		if (templateType === "object") {
			if (dataType !== "object") return false;

			const templateKeys = Object.keys(templateObj);
			const dataKeys = Object.keys(dataObj);

			// 比对 key 的数量
			if (templateKeys.length !== dataKeys.length) return false;

			// 比对key是否一致
			const sortedTemplateKeys = [...templateKeys].sort();
			const sortedDataKeys = [...dataKeys].sort();
			if (sortedTemplateKeys.join(",") !== sortedDataKeys.join(",")) return false;
			// 递归每个 key 的结构
			for (const key of templateKeys) {
				if (!isSameStructure(templateObj[key], dataObj[key])) {
					return false;
				}
			}

			// 全部通过
			return true;
		}

		// 如果是原始类型 (string, number, boolean, undefined)
		// 因为已经检查了顶级类型，所以是相同的
		return true;
	}

	// 递归地将 undefined 转换为占位符
	function serializeUndefined(obj: any): any {
		if (typeof obj === "undefined") return UNDEFINED_PLACEHOLDER;

		if (Array.isArray(obj)) {
			return obj.map(serializeUndefined);
		}

		if (getPreciseType(obj) === "object") {
			return Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [key, serializeUndefined(value)])
			);
		}

		return obj;
	}

	// 递归地将占位符还原为 undefined
	function deserializeUndefined(obj: any): any {
		if (obj === UNDEFINED_PLACEHOLDER) return undefined;

		if (Array.isArray(obj)) {
			return obj.map(deserializeUndefined);
		}

		if (getPreciseType(obj) === "object") {
			return Object.fromEntries(
				Object.entries(obj).map(([key, value]) => [key, deserializeUndefined(value)])
			);
		}

		return obj;
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
						const deserializedValue = deserializeUndefined(parsedValue);

						// 检查对象结构是否相同，如果不相同，则使用默认对象
						if (!isSameStructure(defaultValue, deserializedValue)) {
							return defaultValue;
						}

						// 如果结构相同，则返回解析的值
						return deserializedValue;
					} catch (error) {
						console.error("解析缓存的数据失败", error);
						return defaultValue;
					}
				},
				write: (value) => {
					// 将 undefined 替换为占位符
					const serialized = serializeUndefined(value);
					return JSON.stringify(serialized);
				}
			}
		});
	}

	return {
		useEnhancedLocalStorage
	};
}
