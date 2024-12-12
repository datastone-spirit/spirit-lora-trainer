/*
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:31:33
 * @LastEditTime: 2024-12-12 16:23:11
 * @LastEditors: mulingyuer
 * @Description: 工具函数
 * @FilePath: \frontend\src\utils\tools.ts
 * 怎么可能会有bug！！！
 */

/** 生成一个键值对对象，键为接口的键，值为键名 */
export function generateKeyMapFromInterface<
	T extends Record<string, any>,
	R extends Record<keyof T, any> = Record<keyof T, string>
>(instance: T): R {
	return Object.keys(instance).reduce((acc, key) => {
		// 这里我们需要确保 `key` 被正确地断言为 `keyof T`
		const typedKey = key as keyof T;
		// 使用类型断言来满足 R 的类型要求
		// @ts-expect-error 由于 TypeScript 类型系统的限制，这里使用类型断言
		acc[typedKey] = key;
		return acc;
	}, {} as R);
}

/** 剔除键值对对象中值为 undefined 的键 */
export function removeUndefinedKeys<T extends Record<string, any>>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}
