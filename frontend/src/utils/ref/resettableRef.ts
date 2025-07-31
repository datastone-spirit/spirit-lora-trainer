/*
 * @Author: mulingyuer
 * @Date: 2025-07-29 10:05:56
 * @LastEditTime: 2025-07-29 10:05:56
 * @LastEditors: mulingyuer
 * @Description: 支持数据重置的ref
 * @FilePath: \frontend\src\utils\ref\resettableRef.ts
 * 怎么可能会有bug！！！
 */
import type { Ref } from "vue";

/**
 * 创建一个支持重置的响应式引用，类似 Vue 的 ref
 * @param initialValue 初始值
 * @param deepClone 是否深拷贝初始值（引用类型建议开启）
 * @returns [Ref<T>, () => void]
 * @example
 * const [state, reset] = resettableRef(0);
 * state.value = 10;
 * reset(); // state.value 重置为 0
 */
export function resettableRef<T>(initialValue: T, deepClone = true): [Ref<T>, () => void] {
	const initial = deepClone ? structuredClone(initialValue) : initialValue;
	const state = ref<T>(deepClone ? structuredClone(initial) : initial) as Ref<T>;
	const reset = () => {
		state.value = deepClone ? structuredClone(initial) : initial;
	};
	return [state, reset];
}
