<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 09:20:16
 * @LastEditTime: 2025-01-10 11:17:16
 * @LastEditors: mulingyuer
 * @Description: 模型参数
 * @FilePath: \frontend\src\views\lora\sdxl\components\ModelParameters\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="随机种子" prop="seed" popover-content="seed">
		<el-input-number v-model.number="ruleForm.seed" :step="1" step-strictly />
	</PopoverFormItem>
	<PopoverFormItem
		label="总学习率, 在分开设置 U-Net 与文本编码器学习率后这个值失效"
		prop="learning_rate"
		popover-content="learning_rate"
	>
		<el-input v-model="ruleForm.learning_rate" placeholder="请输入总学习率" />
	</PopoverFormItem>
	<PopoverFormItem
		label="每 N epoch（轮）自动保存一次模型"
		prop="save_every_n_epochs"
		popover-content="save_every_n_epochs"
	>
		<el-input-number
			v-model.number="ruleForm.save_every_n_epochs"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="网络维度，常用 4~128，不是越大越好, 低dim可以降低显存占用"
		prop="network_dim"
		popover-content="network_dim"
	>
		<el-input-number v-model.number="ruleForm.network_dim" :step="1" step-strictly />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
