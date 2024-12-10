<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 10:48:53
 * @LastEditTime: 2024-12-10 10:56:14
 * @LastEditors: mulingyuer
 * @Description: 训练网络模块
 * @FilePath: \frontend\src\components\Form\SDXLNetworkModuleSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem :label="label" :prop="prop" popover-content="network_module">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="item in networkModuleOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
</template>

<script setup lang="ts">
export interface SDXLNetworkModuleSelectProps {
	label?: string;
	prop?: string;
	popoverContent: string;
	placeholder?: string;
}

withDefaults(defineProps<SDXLNetworkModuleSelectProps>(), {
	label: "训练网络模块",
	placeholder: "请选择训练网络模块"
});

const value = defineModel({ type: String, required: true });

const networkModuleOptions = readonly([
	{
		label: "networks.lora",
		value: "networks.lora"
	},
	{
		label: "networks.dylora",
		value: "networks.dylora"
	},
	{
		label: "networks.oft",
		value: "networks.oft"
	},
	{
		label: "lycoris.kohya",
		value: "lycoris.kohya"
	}
]);
</script>

<style scoped></style>
