<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 08:41:44
 * @LastEditTime: 2025-07-24 09:24:46
 * @LastEditors: mulingyuer
 * @Description: 表单项组件
 * @FilePath: \frontend\src\components\Form\PopoverFormItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-form-item class="popover-form-item" :prop="prop" :rules="rules">
		<template v-if="label" #label>
			<span class="popover-form-item-label">
				{{ label }}
				<span
					v-show="isExpert && popoverContent"
					class="popover-form-item-tips"
					@click.stop.prevent
				>
					&lt;{{ popoverContent }}&gt;
				</span>
			</span>
		</template>
		<slot></slot>
	</el-form-item>
</template>

<script setup lang="ts">
import type { FormItemProps, PopoverProps } from "element-plus";
import { useSettingsStore } from "@/stores";

export interface PopoverFormItemProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: PopoverProps["content"];
	rules?: FormItemProps["rules"];
}

withDefaults(defineProps<PopoverFormItemProps>(), {});

const settingsStore = useSettingsStore();

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style lang="scss" scoped>
.popover-form-item {
	--font-size: 16px;
}
.popover-form-item :deep(.el-form-item__label) {
	white-space: break-spaces;
	color: var(--zl-popover-form-item-color);
}
.popover-form-item-icon {
	vertical-align: -0.185em;
	cursor: pointer;
}
.popover-form-item-tips {
	margin-left: 4px;
	font-size: 14px;
	color: var(--zl-popover-form-item-tips-color);
}
</style>
