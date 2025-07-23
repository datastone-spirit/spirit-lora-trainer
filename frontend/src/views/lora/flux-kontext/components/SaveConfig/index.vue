<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 15:26:13
 * @LastEditTime: 2025-07-22 17:34:59
 * @LastEditors: mulingyuer
 * @Description: 保存配置
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\SaveConfig\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="模型保存精度" prop="config.save.dtype" popover-content="dtype">
		<SaveDataType v-model="ruleForm.config.save.dtype" />
	</PopoverFormItem>
	<PopoverFormItem
		label="多少步骤（steps）保存一次模型"
		prop="config.save.save_every"
		popover-content="save_every"
	>
		<el-input-number
			v-model.number="ruleForm.config.save.save_every"
			:step="10"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="训练过程中最多保留多少个检查点"
		prop="config.save.max_step_saves_to_keep"
		popover-content="max_step_saves_to_keep"
	>
		<el-input-number
			v-model.number="ruleForm.config.save.max_step_saves_to_keep"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import SaveDataType from "./SaveDataType.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
