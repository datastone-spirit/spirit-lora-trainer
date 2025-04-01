/*
 * @Author: mulingyuer
 * @Date: 2024-12-18 15:40:09
 * @LastEditTime: 2025-04-01 15:58:37
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

/** 检测目录或者目录下的文件是否存在参数 */
export interface CheckDirectoryExistsParams {
	/** 路径 */
	path: string;
	/** 是否检查目录中是否有数据 */
	has_data: boolean;
}

/** 检测目录或者目录下的文件是否存在结果 */
export interface CheckDirectoryExistsResult {
	/** 是否存在 */
	exists: boolean;
	/** 是否有数据 */
	has_data: boolean;
}

/** 上传文件参数 */
export interface UploadFilesParams {
	/** 上传的文件路径 */
	upload_path: string;
	/** 由请求方生成的唯一的 upload_id，标识这一批上传的文件  */
	upload_id: string;
}

/** 上传文件结果 */
export type UploadFilesResult = Array<{
	/** 文件名 */
	filename: string;
	/** 路径 */
	path: string;
	/** 上传时间 */
	upload_time: string;
	/** 由请求方生成的唯一的 upload_id，标识这一批上传的文件 */
	upload_id: string;
}>;

/** 获取目录下的文件 */
export interface DirectoryFilesParams {
	/** 目录路径 */
	path: string;
}

/** 获取目录下的结果 */
export type DirectoryFilesResult = Array<{
	image_name: string;
	image_path: string;
	txt_content: string;
	txt_name: string;
	txt_path: string;
	mime_type: string;
}>;

/** 混元视频：检测目录是否存参数 */
export interface HYCheckDirectoryExistsParams {
	/** 需要检测的目录路径 */
	path: string;
	/** 是否检查目录中是否有数据 */
	has_data: boolean;
}
/** 混元视频：检测目录是否存结果 */
export interface HYCheckDirectoryExistsResult {
	/** 是否存在 */
	exists: boolean;
	/** 是否有数据 */
	has_data: boolean;
}
