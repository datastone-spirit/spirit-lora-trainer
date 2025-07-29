/*
 * @Author: mulingyuer
 * @Date: 2025-03-25 15:56:35
 * @LastEditTime: 2025-07-28 11:24:55
 * @LastEditors: mulingyuer
 * @Description: 类型工具
 * @FilePath: \frontend\types\type-utils.d.ts
 * 怎么可能会有bug！！！
 */

// 提取必填属性的键
type RequiredKeys<T> = {
	[K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

// 挑选必填属性构造新类型
type RequiredProps<T> = Pick<T, RequiredKeys<T>>;

// 将类型转换为可读性更好的类型
type Prettify<T> = {
	[K in keyof T]: T[K];
};

// 深度美化类型
type DeepPrettify<T> = T extends (...args: any[]) => any
	? T // 保留函数类型
	: T extends object
		? T extends any[]
			? DeepPrettifyArray<T> // 处理数组
			: { [K in keyof T]: DeepPrettify<T[K]> } // 处理对象
		: T; // 基本类型直接返回

// 专门处理数组类型
type DeepPrettifyArray<T> = T extends (infer U)[] ? DeepPrettify<U>[] : T;
