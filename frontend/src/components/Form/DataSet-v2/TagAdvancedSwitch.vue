<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:27:02
 * @LastEditTime: 2025-04-07 16:28:08
 * @LastEditors: mulingyuer
 * @Description: 打标高级设置开关
 * @FilePath: \frontend\src\components\Form\DataSet-v2\TagAdvancedSwitch.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		class="tag-advanced-switch"
		:label="label"
		:prop="prop"
		:popoverContent="popoverContent"
	>
		<el-switch v-model="value" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import type { FormItemProps } from "element-plus";

export interface TagAdvancedSwitchProps {
	label?: FormItemProps["label"];
	prop?: FormItemProps["prop"];
	popoverContent?: string;
}

withDefaults(defineProps<TagAdvancedSwitchProps>(), {
	label: "打标高级设置"
});

const value = defineModel({ type: Boolean, required: true });
</script>

<style lang="scss" scoped>
.tag-advanced-switch {
	@include no-select();
}
</style>
