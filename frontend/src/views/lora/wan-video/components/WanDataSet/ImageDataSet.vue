<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:04:52
 * @LastEditTime: 2025-09-04 10:24:44
 * @LastEditors: mulingyuer
 * @Description: wan数据集
 * @FilePath: \frontend\src\views\lora\wan-video\components\WanDataSet\ImageDataSet.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="数据集目录"
		prop="aiTagRuleForm.image_path"
		popover-content="image_path"
		required
	>
		<FolderSelector
			v-model="ruleForm.aiTagRuleForm.image_path"
			placeholder="请选择训练用的数据集目录"
		/>
	</PopoverFormItem>
	<el-form-item class="margin-bottom-0">
		<AiTag v-model="ruleForm.aiTagRuleForm" />
	</el-form-item>
</template>

<script setup lang="ts">
import AiTag from "@/components/AiTag/index.vue";
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
