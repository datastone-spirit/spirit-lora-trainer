<!--
 * @Author: mulingyuer
 * @Date: 2025-04-07 16:56:46
 * @LastEditTime: 2025-04-15 10:41:30
 * @LastEditors: mulingyuer
 * @Description: 是否把触发词输出到打标文件中
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagAddGlobalPromptSwitch.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		class="tag-add-global-prompt-switch"
		:label="label"
		:prop="prop"
		:popover-content="popoverContent"
	>
		<el-switch class="tag-add-global-prompt-switch-input" v-model="value" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface TagAddGlobalPromptSwitchProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
}

withDefaults(defineProps<TagAddGlobalPromptSwitchProps>(), {
	label: "是否把触发词输出到打标文件中"
});

const value = defineModel({ type: Boolean, required: true });
</script>

<style lang="scss" scoped>
.tag-add-global-prompt-switch-input {
	@include no-select();
}
</style>
