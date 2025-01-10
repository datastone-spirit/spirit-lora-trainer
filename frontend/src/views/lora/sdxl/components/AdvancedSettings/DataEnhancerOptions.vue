<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:00:46
 * @LastEditTime: 2025-01-10 11:25:01
 * @LastEditors: mulingyuer
 * @Description: 数据增强
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\DataEnhancerOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="数据增强">
		<el-row :gutter="16">
			<el-col :span="8">
				<PopoverFormItem label="颜色改变" prop="color_aug" popover-content="color_aug">
					<el-switch v-model="ruleForm.color_aug" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="8">
				<PopoverFormItem label="图像翻转" prop="flip_aug" popover-content="flip_aug">
					<el-switch v-model="ruleForm.flip_aug" />
				</PopoverFormItem>
			</el-col>
			<el-col :span="8">
				<PopoverFormItem label="随机剪裁" prop="random_crop" popover-content="random_crop">
					<el-switch v-model="ruleForm.random_crop" />
				</PopoverFormItem>
			</el-col>
		</el-row>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
