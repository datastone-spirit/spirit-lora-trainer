<!--
 * @Author: mulingyuer
 * @Date: 2025-01-03 16:19:49
 * @LastEditTime: 2025-01-03 16:43:49
 * @LastEditors: mulingyuer
 * @Description: joy-caption-alpha-two的具体prompt
 * @FilePath: \frontend\src\components\Form\JoyCaptionPromptTypeSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="item in promptTypeOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
</template>

<script setup lang="ts">
export interface FluxNetworkModuleSelectProps {
	label?: string;
	prop?: string;
	popoverContent?: string;
	placeholder?: string;
}

withDefaults(defineProps<FluxNetworkModuleSelectProps>(), {
	label: "Joy Caption 提示词类型",
	placeholder: "请选择Joy Caption 提示词类型"
});

const value = defineModel({ type: String, required: true });

const promptTypeOptions = readonly([
	{
		label: "描述性提示词",
		value: "Descriptive"
	},
	{
		label: "用于SD训练型提示词 （1.5, SDXL）",
		value: "Training Prompt"
	},
	{
		label: "MidJourney式提示词",
		value: "MidJourney"
	},
	{
		label: "Booru Tag 样式列表提示词",
		value: "Booru tag list"
	},
	{
		label: "Booru Like Tag 样式列表提示词",
		value: "Booru-like tag list"
	},
	{
		label: "艺术评论家式提示词",
		value: "Art Critic"
	},
	{
		label: "产品列表式提示词",
		value: "Product Listing"
	},
	{
		label: "社交媒体式提示词",
		value: "Social Media Post"
	}
]);
</script>

<style scoped></style>
