/*
 * @Author: mulingyuer
 * @Date: 2025-03-25 15:56:35
 * @LastEditTime: 2025-03-25 17:02:07
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
