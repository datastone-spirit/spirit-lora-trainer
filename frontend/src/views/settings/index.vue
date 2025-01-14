<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 10:01:07
 * @LastEditTime: 2025-01-09 15:32:00
 * @LastEditors: mulingyuer
 * @Description: 设置页面
 * @FilePath: \frontend\src\views\settings\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="settings">
		<div class="settings-content">
			<el-form
				ref="ruleFormRef"
				class="settings-form"
				:model="ruleForm"
				:rules="rules"
				label-width="auto"
				label-position="left"
				size="large"
				label-suffix="："
			>
				<el-form-item label="动画图标" prop="openAnimatedFavicon">
					<el-switch v-model="ruleForm.openAnimatedFavicon"></el-switch>
				</el-form-item>
				<div class="form-item-info">
					开启动画图标后可以在GPU被占用时，在浏览器标签栏看到动态变化的智灵图标（仅参考用）
				</div>
				<el-form-item label="训练工具栏进度条背景" prop="openFooterBarProgress">
					<el-switch v-model="ruleForm.openFooterBarProgress"></el-switch>
				</el-form-item>
				<div class="form-item-info">开启后可以更明显的看到打标和训练进度</div>
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { TrainerSettings } from "@/stores";
import type { FormInstance, FormRules } from "element-plus";

const settingsStore = useSettingsStore();

const ruleFormRef = ref<FormInstance>();
const ruleForm = storeToRefs(settingsStore).trainerSettings;
const rules = reactive<FormRules<TrainerSettings>>({});
</script>

<style lang="scss" scoped>
.settings {
	height: 100%;
	background-color: var(--zl-about-page-bg);
	border-radius: $zl-border-radius;
}
.settings-content {
	padding: 20px 30px;
}
.settings-form {
	:deep(.el-form-item) {
		--font-size: 16px;
		margin-bottom: 2px;
	}
	:deep(.el-form-item__label) {
		color: var(--zl-popover-form-item-color);
	}
}
.form-item-info {
	font-size: 14px;
	color: var(--zl-popover-form-item-tips-color);
	margin-bottom: 22px;
}
</style>
