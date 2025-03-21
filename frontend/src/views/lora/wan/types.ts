/*
 * @Author: mulingyuer
 * @Date: 2025-03-20 09:30:27
 * @LastEditTime: 2025-03-20 17:59:42
 * @LastEditors: mulingyuer
 * @Description: wan类型
 * @FilePath: \frontend\src\views\lora\wan\types.ts
 * 怎么可能会有bug！！！
 */

/** 表单类型 */
export interface RuleForm {
	/** 输出的模型名称 */
	output_name: string;
	/** 触发词 */
	class_tokens: string;
	// ---------
	/** 数据集目录 */
	image_dir: string;
	/** 打标模型 */
	tagger_model: string;
	/** joy-caption-alpha-two打标模型的提示词类型 */
	prompt_type: string;
	/** 是否把触发词输出到打标文件中 */
	output_trigger_words: boolean;
	/** 打标高级设置 */
	tagger_advanced_settings: boolean;
	/** 打标提示词 */
	tagger_global_prompt: string;
	/** 是否追加到已有打标文件中 */
	tagger_is_append: boolean;
}
