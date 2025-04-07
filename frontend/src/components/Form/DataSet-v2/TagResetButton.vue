<!--
 * @Author: mulingyuer
 * @Date: 2025-04-07 17:13:16
 * @LastEditTime: 2025-04-07 17:25:45
 * @LastEditors: mulingyuer
 * @Description: 打标重置按钮
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagResetButton.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :class="{ 'no-mb': isBottomMargin }">
		<el-button
			class="tag-reset-button"
			:type="type"
			:loading="loading"
			:disabled="disabled"
			:size="size"
			:round="round"
			@click="emits('reset')"
		>
			<Icon class="tag-reset-button-icon" :name="iconName" />
			{{ btnText }}
		</el-button>
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { ButtonProps } from "element-plus";

export interface TagResetButtonProps {
	type?: ButtonProps["type"];
	loading?: ButtonProps["loading"];
	disabled?: ButtonProps["disabled"];
	size?: ButtonProps["size"];
	round?: ButtonProps["round"];
	btnText?: string;
	/** 是否底部margin */
	isBottomMargin?: boolean;
	/** icon 名称 */
	iconName?: string;
}

withDefaults(defineProps<TagResetButtonProps>(), {
	type: "default",
	btnText: "重置表单",
	size: "large",
	round: true,
	isBottomMargin: true,
	iconName: "ri-reset-left-line"
});

const emits = defineEmits<{
	/** 点击重置按钮 */
	reset: [];
}>();
</script>

<style lang="scss" scoped>
.el-form-item.no-mb {
	margin-bottom: 0;
}
.tag-reset-button {
	width: 100%;
}
.tag-reset-button-icon {
	margin-right: 6px;
}
</style>
