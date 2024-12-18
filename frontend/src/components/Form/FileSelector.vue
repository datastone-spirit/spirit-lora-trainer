<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 08:55:24
 * @LastEditTime: 2024-12-18 17:28:37
 * @LastEditors: mulingyuer
 * @Description: 文件选择器
 * @FilePath: \frontend\src\components\Form\FileSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<InputTreeSelector v-model="value" :is-dir="false" />
</template>

<script setup lang="ts">
const value = defineModel({ type: String, required: true });
</script>

<style lang="scss" scoped></style>
