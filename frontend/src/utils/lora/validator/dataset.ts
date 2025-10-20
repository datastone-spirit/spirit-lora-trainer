/*
 * @Author: mulingyuer
 * @Date: 2025-10-09 16:23:56
 * @LastEditTime: 2025-10-10 11:09:26
 * @LastEditors: mulingyuer
 * @Description: 数据集校验
 * @FilePath: \frontend\src\utils\lora\validator\dataset.ts
 * 怎么可能会有bug！！！
 */
import { checkDirectoryExists, directoryFiles } from "@/api/common";
import type {
	ValidateControlDatasetOptions,
	ValidateDirectoryOptions,
	ValidationResult
} from "./types";
import { ValidatorBase } from "./base";

// // 辅助函数：将控制数据集图片名称还原为对应的数据集图片名称
// // 例如: '1_0' -> '1', '2_0001' -> '2', '3' -> '3'
// // 匹配模式: (原始文件名)_(数字). (原始文件名)_(4位数字).
// function getBaseImageName(controlImageName: string): string {
// 	const regex = /_(\d{1}|\d{4})$/;
// 	const match = controlImageName.match(regex);

// 	if (match) {
// 		// 如果匹配成功，则移除匹配到的后缀部分
// 		// 例如: '1_0' 或 '1_0000'
// 		const suffix = match[0];
// 		// 确保 suffix 在字符串的末尾 (防止文件名中间有 _数字 的情况)
// 		if (controlImageName.endsWith(suffix)) {
// 			return controlImageName.substring(0, controlImageName.length - suffix.length);
// 		}
// 	}
// 	// 如果不匹配任何新模式，则返回原始名称 (例如 '1')
// 	return controlImageName;
// }

export class DatasetValidator extends ValidatorBase {
	/** 从文件名中提取主ID（如 "1.jpg" → "1"） */
	private static getMainId(filename: string): string {
		const dotIndex = filename.indexOf(".");
		return dotIndex === -1 ? filename : filename.substring(0, dotIndex);
	}

	/** 从控制集文件名中提取编号信息 */
	private static parseSequenceItem(
		item: string,
		mainId: string
	): { num: number; str: string } | null {
		// 正则：mainId + '_' + 一个或多个数字 + '.' + 任意扩展名
		const regex = new RegExp(`^${mainId}_(\\d+)\\.[^.]+$`);
		const match = item.match(regex);
		if (!match) return null;
		const numStr = match[1];
		const num = parseInt(numStr, 10);
		return { num, str: numStr };
	}

	/**
	 * 校验目录是否存在及其内容是否符合要求
	 * @remarks
	 * - 支持检查目录是否存在
	 * - 当 checkImageAndLabel 为 true 时，检查目录下是否有图片和标注数据
	 */
	static async validateDirectory(options: ValidateDirectoryOptions): Promise<ValidationResult> {
		const { path, checkImageAndLabel = false, shouldShowErrorDialog = false } = options;
		try {
			const pathList = Array.isArray(path) ? path : [path];

			for (const dir of pathList) {
				const result = await checkDirectoryExists({
					path: dir,
					has_data: checkImageAndLabel
				});

				if (!result.exists) {
					const message = `目录 ${dir} 不存在，请检查路径是否正确`;
					if (shouldShowErrorDialog) {
						this.showErrorMessage({ message });
					}

					return { valid: false, message };
				}

				if (checkImageAndLabel && !result.has_data) {
					const message = `数据集目录 ${dir} 下没有数据，请上传训练素材`;
					if (shouldShowErrorDialog) {
						this.showErrorMessage({ message });
					}

					return { valid: false, message };
				}
			}

			return { valid: true };
		} catch (error) {
			// 校验不通过会直接触发catch
			const message = (error as Error)?.message ?? "未知错误";
			if (shouldShowErrorDialog) {
				this.showErrorMessage({ message });
			}

			return {
				valid: false,
				message
			};
		}
	}

	/** 数据集与控制数据集校验
	 * 控制数据集中图片的数量可以大于数据集图片数量，但不能少于数据集图片数量
	 * 控制数据集中的图片名称必须要与数据集中的图片名称完全一致，不考虑文件格式
	 */
	static async validateControlDataset(
		options: ValidateControlDatasetOptions
	): Promise<ValidationResult> {
		const { controlPath, datasetPath, shouldShowErrorDialog = false } = options;
		try {
			const datasetResult = await directoryFiles({ path: datasetPath });
			const datasetImageList = datasetResult.map((item) => {
				return item.image_name.split(".").slice(0, -1).join(".");
			});
			const controlResult = await directoryFiles({ path: controlPath });
			const controlImageList = controlResult.map((item) => {
				return item.image_name.split(".").slice(0, -1).join(".");
			});

			if (controlImageList.length < datasetImageList.length) {
				return { valid: false, message: "控制数据集图片数量与数据集图片数量不匹配" };
			}
			// 文件名必须一致
			const diff = controlImageList.every((item) => datasetImageList.includes(item));
			if (!diff) {
				return { valid: false, message: "控制数据集图片名称与数据集图片名称不匹配" };
			}

			return { valid: true };
		} catch (error) {
			const message = (error as Error)?.message ?? "数据集与控制数据集校验发生未知错误";
			if (shouldShowErrorDialog) {
				this.showErrorMessage({ message });
			}

			return { valid: false, message };
		}
	}

	/**
	 * 数据集与控制数据集校验 (支持 1:N 匹配)
	 *
	 * 规则：
	 * 1. 控制数据集中图片的数量可以大于数据集图片数量，但不能少于数据集图片数量（且每个 dataset 图片必须至少有一个 control 对应）。
	 * 2. 匹配模式支持：
	 *    - 1.jpg -> 1.jpg (1:1)
	 *    - 1.jpg -> 1_0.jpg, 1_1.jpg, ... (1:N, 0开始，任意位数数字后缀)
	 *    - 1.jpg -> 1_0000.jpg, 1_0001.jpg, ... (1:N, 0开始，四位数字后缀)
	 */
	public static async validateControlDatasetPlus(
		options: ValidateControlDatasetOptions
	): Promise<ValidationResult> {
		const { controlPath, datasetPath, shouldShowErrorDialog = false } = options;
		try {
			// api获取目录数据
			const datasetResult = await directoryFiles({ path: datasetPath });
			const controlResult = await directoryFiles({ path: controlPath });

			// 基础数量校验 (控制集不能少于数据集)
			if (controlResult.length < datasetResult.length) {
				return { valid: false, message: "控制数据集图片数量少于数据集图片数量" };
			}

			// 如果数量相同，就判断是不是非1:N的控制集方式
			if (controlResult.length === datasetResult.length) {
				const datasetImageList = datasetResult.map((item) => {
					return item.image_name.split(".").slice(0, -1).join(".");
				});
				const controlImageList = controlResult.map((item) => {
					return item.image_name.split(".").slice(0, -1).join(".");
				});

				// 文件名必须一致
				const diff = controlImageList.every((item) => datasetImageList.includes(item));
				if (!diff) {
					return { valid: false, message: "控制数据集图片名称与数据集图片名称不匹配" };
				} else {
					return { valid: true };
				}
			}

			const mainIds = datasetResult.map((item) => this.getMainId(item.image_name));
			for (const id of mainIds) {
				// 找出所有匹配该id的B中的项
				const matches = controlResult
					.map((item) => {
						return this.parseSequenceItem(item.image_name, id);
					})
					.filter(Boolean) as Array<{ num: number; str: string }>;

				if (matches.length === 0) {
					// 必须至少有一个匹配项
					return { valid: false, message: `没有找到 ${id} 的控制集图片，请确保命名格式统一` };
				}

				// 按数字排序
				matches.sort((a, b) => a.num - b.num);

				// 检查是否从0开始连续
				for (let i = 0; i < matches.length; i++) {
					if (matches[i].num !== i) {
						return {
							valid: false,
							message: `${id} 的控制集图片编号不连续或未从0开始。期望 ${i}，实际 ${matches[i].num}`
						};
					}
				}

				// 检查编号格式是否统一（所有str长度相同，且无前导零除非统一有）
				const firstLen = matches[0].str.length;
				const hasLeadingZero = matches[0].str.length > 1 && matches[0].str[0] === "0";

				for (const match of matches) {
					if (match.str.length !== firstLen) {
						return { valid: false, message: `${id} 的控制集图片编号格式不统一（长度不一致）` };
					}
					// 如果第一位是0，说明是固定位数格式；否则应无前导零
					if (hasLeadingZero) {
						// 所有都应有前导零（即长度 >1 且第一位是0）
						if (match.str.length === 1 || match.str[0] !== "0") {
							return { valid: false, message: `${id} 的控制集图片编号格式不统一（前导零不一致）` };
						}
					} else {
						// 不应有前导零
						if (match.str.length > 1 && match.str[0] === "0") {
							return { valid: false, message: `${id} 的控制集图片不应有前导零` };
						}
					}
				}
			}

			return { valid: true };
		} catch (error) {
			const message = (error as Error)?.message ?? "数据集与控制数据集校验发生未知错误";
			if (shouldShowErrorDialog) {
				this.showErrorMessage({ message });
			}

			return { valid: false, message };
		}
	}
}
