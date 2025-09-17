<!--
 * @Author: mulingyuer
 * @Date: 2025-04-08 09:22:10
 * @LastEditTime: 2025-09-04 10:23:30
 * @LastEditors: mulingyuer
 * @Description: 混元AI数据集
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\HYDataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="数据集目录" prop="aiTagRuleForm.image_path" popover-content="image_path">
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
// hooks
</script>

<style scoped></style>
