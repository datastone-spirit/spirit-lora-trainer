<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 10:56:35
 * @LastEditTime: 2024-12-10 11:41:34
 * @LastEditors: mulingyuer
 * @Description: 训练网络模块
 * @FilePath: \frontend\src\components\Form\FluxNetworkModuleSelect.vue
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
export interface FluxNetworkModuleSelectProps {
	label?: string;
	prop?: string;
	popoverContent: string;
	placeholder?: string;
}

withDefaults(defineProps<FluxNetworkModuleSelectProps>(), {
	label: "训练网络模块",
	placeholder: "请选择训练网络模块"
});

const value = defineModel({ type: String, required: true });

const networkModuleOptions = readonly([
	{
		label: "networks.lora_flux",
		value: "networks.lora_flux"
	},
	{
		label: "networks.oft_flux",
		value: "networks.oft_flux"
	}
]);
</script>

<style scoped></style>
