<!--
 * @Author: mulingyuer
 * @Date: 2025-04-08 09:58:29
 * @LastEditTime: 2025-09-04 16:28:45
 * @LastEditors: mulingyuer
 * @Description: flux数据集组件
 * @FilePath: \frontend\src\views\lora\flux\components\FluxDataset\index.vue
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
		<AiTag
			v-model="ruleForm.aiTagRuleForm"
			show-get-trigger-words-btn
			:getTriggerWords="() => ruleForm.dataset.class_tokens"
		></AiTag>
	</el-form-item>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import AiTag from "@/components/AiTag/index.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
