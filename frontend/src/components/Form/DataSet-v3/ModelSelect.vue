<!--
 * @Author: mulingyuer
 * @Date: 2025-09-02 16:53:27
 * @LastEditTime: 2025-09-02 16:55:03
 * @LastEditors: mulingyuer
 * @Description: 打标模型选择器
 * @FilePath: \frontend\src\components\Form\DataSet-v3\TagModelSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" placeholder="请选择打标模型">
		<el-option label="Joy Caption2" value="joy-caption-alpha-two" />
		<el-option label="Florence2" value="florence2" />
	</el-select>
</template>

<script setup lang="ts">
const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
