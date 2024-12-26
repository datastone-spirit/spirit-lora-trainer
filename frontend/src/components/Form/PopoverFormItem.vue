<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 08:41:44
 * @LastEditTime: 2024-12-11 10:07:30
 * @LastEditors: mulingyuer
 * @Description: 表单项组件
 * @FilePath: \frontend\src\components\Form\PopoverFormItem.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-form-item class="popover-form-item" :prop="prop">
		<template #label>
			{{ label }}
			<el-popover
				:placement="popoverPlacement"
				:trigger="popoverTrigger"
				:content="popoverContent"
				popper-class="popover-form-item-wrapper"
				:popper-style="{ width: 'auto', minWidth: 'auto' }"
			>
				<template #reference>
					({{ popoverPlacement }})
					<!-- <Icon
						class="popover-form-item-icon"
						:name="iconName"
						:size="iconSize"
						:color="iconColor"
					/> -->
				</template>
			</el-popover>
		</template>
		<slot></slot>
	</el-form-item>
</template>

<script setup lang="ts">
import type { FormItemProps, PopoverProps } from "element-plus";
import type { IconProps } from "@/components/Icon/Icon.vue";

export interface PopoverFormItemProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	iconName?: IconProps["name"];
	iconSize?: IconProps["size"];
	iconColor?: IconProps["color"];
	popoverPlacement?: PopoverProps["placement"];
	popoverTrigger?: PopoverProps["trigger"];
	popoverContent?: PopoverProps["content"];
}

withDefaults(defineProps<PopoverFormItemProps>(), {
	iconName: "ri-information-fill",
	popoverTrigger: "hover",
	popoverPlacement: "top-start",
	iconColor: "var(--el-text-color-placeholder)"
});
</script>

<style lang="scss" scoped>
.popover-form-item :deep(.el-form-item__label) {
	white-space: break-spaces;
}
.popover-form-item-icon {
	vertical-align: -0.185em;
	cursor: pointer;
}
</style>
