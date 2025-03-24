<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 15:54:42
 * @LastEditTime: 2025-03-24 15:54:43
 * @LastEditors: mulingyuer
 * @Description: t2v训练参数
 * @FilePath: \frontend\src\views\lora\wan\components\T2VOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="初始帧的图片文件地址"
		prop="image_jsonl_file_image_path"
		popover-content="image_jsonl_file_image_path"
	>
		<FileSelector
			v-model="ruleForm.image_jsonl_file_image_path"
			placeholder="请选择初始帧的图片文件地址"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="初始帧的图片描述"
		prop="image_jsonl_file_caption"
		popover-content="image_jsonl_file_caption"
	>
		<el-input
			v-model="ruleForm.image_jsonl_file_caption"
			placeholder="请输入初始帧的图片描述，多个词用英文逗号分隔"
			type="textarea"
			:rows="4"
		/>
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { RuleForm } from "../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
