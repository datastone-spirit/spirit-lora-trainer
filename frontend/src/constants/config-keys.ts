/*
 * @Author: mulingyuer
 * @Date: 2025-08-20 15:46:36
 * @LastEditTime: 2025-08-20 15:47:38
 * @LastEditors: mulingyuer
 * @Description: 设置的key值
 * @FilePath: \frontend\src\constants\config-keys.ts
 * 怎么可能会有bug！！！
 */
import { joinPrefixKey } from "@/utils/tools";

/** 配置的key值 */
export const CONFIG_KEYS = {
	TWO_SPLIT2_LEFT_KEY: joinPrefixKey("two_split_left_size"),
	TWO_SPLIT2_RIGHT_KEY: joinPrefixKey("two_split_right_size")
} as const;
