<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 14:27:09
 * @LastEditTime: 2025-08-13 14:28:30
 * @LastEditors: mulingyuer
 * @Description: 系统资源配置
 * @FilePath: \frontend\src\views\lora\qwen-image\components\AdvancedSettings\System.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="系统资源配置">
		<PopoverFormItem
			label="控制数据加载并行进程数，4-16（根据CPU核心数调整）"
			prop="config.max_data_loader_n_workers"
			popover-content="max_data_loader_n_workers"
		>
			<el-input-number
				v-model.number="ruleForm.config.max_data_loader_n_workers"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="保留加载训练集的worker，减少每个 epoch 之间的停顿"
			prop="config.persistent_data_loader_workers"
			popover-content="persistent_data_loader_workers"
		>
			<el-switch v-model="ruleForm.config.persistent_data_loader_workers" />
		</PopoverFormItem>
		<PopoverFormItem
			label="指定要交换的网络块数量"
			prop="config.blocks_to_swap"
			popover-content="blocks_to_swap"
		>
			<el-input-number
				v-model.number="ruleForm.config.blocks_to_swap"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="将图像输入（img_in）和文本输入（txt_in）张量保留在CPU内存中，减少显存占用"
			prop="config.img_in_txt_in_offloading"
			popover-content="img_in_txt_in_offloading"
		>
			<el-switch v-model="ruleForm.config.img_in_txt_in_offloading" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
