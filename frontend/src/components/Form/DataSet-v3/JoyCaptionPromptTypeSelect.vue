<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:21:29
 * @LastEditTime: 2025-09-02 17:08:02
 * @LastEditors: mulingyuer
 * @Description:
 * @FilePath: \frontend\src\components\Form\DataSet-v3\TagJoyCaptionPromptTypeSelect.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-select v-model="value" placeholder="请选择Joy Caption 提示词类型">
		<el-option label="描述性提示词" value="Descriptive" />
		<el-option label="用于SD训练型提示词 （1.5, SDXL）" value="Training Prompt" />
		<el-option label="MidJourney式提示词" value="MidJourney" />
		<el-option label="Booru Tag 样式列表提示词" value="Booru tag list" />
		<el-option label="Booru Like Tag 样式列表提示词" value="Booru-like tag list" />
		<el-option label="艺术评论家式提示词" value="Art Critic" />
		<el-option label="产品列表式提示词" value="Product Listing" />
		<el-option label="社交媒体式提示词" value="Social Media Post" />
	</el-select>
</template>

<script setup lang="ts">
const value = defineModel({ type: String, required: true });
</script>

<style scoped></style>
