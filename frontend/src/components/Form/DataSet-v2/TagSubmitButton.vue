<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:47:17
 * @LastEditTime: 2025-03-26 16:47:10
 * @LastEditors: mulingyuer
 * @Description: 打标提交按钮
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagSubmitButton.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-form-item :class="{ 'no-mb': !isBottomMargin }">
		<el-button
			class="tag-submit-button"
			type="primary"
			:loading="loading"
			:disabled="disabled"
			:size="size"
			:round="round"
			@click="emits('submit')"
		>
			<Icon class="tag-submit-button-icon" :name="iconName" />
			{{ btnText }}
		</el-button>
	</el-form-item>
</template>

<script setup lang="ts">
import type { ButtonProps } from "element-plus";

export interface TagSubmitButtonProps {
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

withDefaults(defineProps<TagSubmitButtonProps>(), {
	type: "primary",
	btnText: "一键打标",
	size: "large",
	round: true,
	isBottomMargin: false,
	iconName: "ri-price-tag-3-fill"
});

const emits = defineEmits<{
	/** 提交按钮点击事件 */
	submit: [];
}>();
</script>

<style lang="scss" scoped>
.el-form-item.no-mb {
	margin-bottom: 0;
}
.tag-submit-button {
	width: 100%;
}
.tag-submit-button-icon {
	margin-right: 6px;
}
</style>
