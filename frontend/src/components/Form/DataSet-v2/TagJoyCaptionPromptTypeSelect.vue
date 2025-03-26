<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:21:29
 * @LastEditTime: 2025-03-26 11:32:08
 * @LastEditors: mulingyuer
 * @Description: joy-caption-alpha-two的具体prompt类型选择
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagJoyCaptionPromptTypeSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" :popover-content="popoverContent">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="(item, index) in options"
				:key="index"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface FluxNetworkModuleSelectProps {
	label: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
	placeholder?: string;
	options?: ElOptions;
}

withDefaults(defineProps<FluxNetworkModuleSelectProps>(), {
	label: "Joy Caption 提示词类型",
	placeholder: "请选择Joy Caption 提示词类型",
	options: () => [
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
	]
});

const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
