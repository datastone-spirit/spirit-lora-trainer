<!--
 * @Author: mulingyuer
 * @Date: 2024-12-16 11:43:02
 * @LastEditTime: 2024-12-20 09:56:51
 * @LastEditors: mulingyuer
 * @Description: 打标模型选择器
 * @FilePath: \frontend\src\components\Form\TaggerModelSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-form-item :label="label" :prop="prop">
		<el-select v-model="value" :placeholder="placeholder">
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</el-form-item>
</template>

<script setup lang="ts">
export interface TaggerModelSelectProps {
	label?: string;
	prop?: string;
	placeholder?: string;
}

withDefaults(defineProps<TaggerModelSelectProps>(), {
	label: "打标模型",
	placeholder: "请选择打标模型"
});

const value = defineModel({ type: String, required: true });

const options = ref([
	{ label: "Joy Caption2", value: "joy_caption2" },
	{ label: "Florence", value: "florence2" }
]);
</script>

<style scoped></style>
