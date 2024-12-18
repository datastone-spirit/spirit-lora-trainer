/*
 * @Author: mulingyuer
 * @Date: 2024-12-18 15:40:09
 * @LastEditTime: 2024-12-18 16:19:34
 * @LastEditors: mulingyuer
 * @Description: 公共api类型
 * @FilePath: \frontend\src\api\common\types.ts
 * 怎么可能会有bug！！！
 */

/** 获取目录结构请求参数 */
export interface GetDirectoryStructureParams {
	/** 当前路径 */
	parent_path: string;
	/** 是否是目录 默认1 只返回目录 不返回文件 */
	is_dir: boolean;
}

/** 获取目录结构请求结果 */
export type GetDirectoryStructureResult = Array<{
	/** 是否是叶子节点 */
	isLeaf: boolean;
	/** 节点名称 */
	label: string;
	/** 节点路径 */
	value: string;
}>;
