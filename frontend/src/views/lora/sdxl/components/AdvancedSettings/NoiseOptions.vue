<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 14:50:53
 * @LastEditTime: 2024-12-09 15:01:41
 * @LastEditors: mulingyuer
 * @Description: 噪声设置
 * @FilePath: \frontend\src\views\lora\sdxl\components\AdvancedSettings\NoiseOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="噪声设置">
		<PopoverFormItem
			label="在训练中添加噪声偏移来改良生成非常暗或者非常亮的图像，如果启用推荐为 0.1"
			:prop="formProps.noise_offset"
			popover-content="noise_offset"
		>
			<el-input-number v-model.number="ruleForm.noise_offset" :step="0.001" />
		</PopoverFormItem>
		<PopoverFormItem
			label="多分辨率（金字塔）噪声迭代次数 推荐 6-10。无法与 noise_offset 一同启用"
			:prop="formProps.multires_noise_iterations"
			popover-content="multires_noise_iterations"
		>
			<el-input-number
				v-model.number="ruleForm.multires_noise_iterations"
				:step="1"
				step-strictly
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="多分辨率（金字塔）衰减率 推荐 0.3-0.8，须同时与上方参数 multires_noise_iterations 一同启用"
			:prop="formProps.multires_noise_discount"
			popover-content="multires_noise_discount"
		>
			<el-input-number v-model.number="ruleForm.multires_noise_discount" :step="0.01" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";

export interface NoiseOptionsProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<NoiseOptionsProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
