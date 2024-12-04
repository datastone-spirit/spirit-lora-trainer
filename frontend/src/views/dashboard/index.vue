<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:39:40
 * @LastEditTime: 2024-12-04 17:16:42
 * @LastEditors: mulingyuer
 * @Description: 仪表盘
 * @FilePath: \frontend\src\views\dashboard\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div>
		仪表盘
		<div class="mb-4">
			<el-button>Default</el-button>
			<el-button type="primary">Primary</el-button>
			<el-button type="success">Success</el-button>
			<el-button type="info">Info</el-button>
			<el-button type="warning">Warning</el-button>
			<el-button type="danger">Danger</el-button>
		</div>

		<div class="mb-4">
			<el-button plain>Plain</el-button>
			<el-button type="primary" plain>Primary</el-button>
			<el-button type="success" plain>Success</el-button>
			<el-button type="info" plain>Info</el-button>
			<el-button type="warning" plain>Warning</el-button>
			<el-button type="danger" plain>Danger</el-button>
		</div>

		<div class="mb-4">
			<el-button round>Round</el-button>
			<el-button type="primary" round>Primary</el-button>
			<el-button type="success" round>Success</el-button>
			<el-button type="info" round>Info</el-button>
			<el-button type="warning" round>Warning</el-button>
			<el-button type="danger" round>Danger</el-button>
		</div>

		<el-button :plain="true" @click="open1">Success</el-button>
		<el-button :plain="true" @click="open2">Warning</el-button>
		<el-button :plain="true" @click="open3">Message</el-button>
		<el-button :plain="true" @click="open4">Error</el-button>
	</div>
</template>

<script setup lang="ts">
const open1 = () => {
	ElMessage({
		message: "Congrats, this is a success message.",
		type: "success",
		plain: true
	});
};
const open2 = () => {
	ElMessage({
		message: "Warning, this is a warning message.",
		type: "warning",
		plain: true
	});
};
const open3 = () => {
	ElMessage({
		message: "This is a message.",
		type: "info",
		plain: true
	});
};
const open4 = () => {
	ElMessage({
		message: "Oops, this is a error message.",
		type: "error",
		plain: true
	});
};
</script>

<style scoped></style>
