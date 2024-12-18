<!--
 * @Author: mulingyuer
 * @Date: 2024-12-05 16:54:42
 * @LastEditTime: 2024-12-18 17:20:06
 * @LastEditors: mulingyuer
 * @Description: 目录选择器
 * @FilePath: \frontend\src\components\Form\FolderSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<InputTreeSelector v-model="value" :is-dir="true" />
</template>

<script setup lang="ts">
const value = defineModel({ type: String, required: true });
</script>

<style lang="scss" scoped></style>
