<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 16:08:09
 * @LastEditTime: 2024-12-04 17:19:11
 * @LastEditors: mulingyuer
 * @Description: 难易度设置
 * @FilePath: \frontend\src\layout\admin-layout\components\Header\ComplexitySetting.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="complexity-setting">
		<el-radio-group v-model="complexityValue" size="default">
			<el-radio-button label="简单" :value="ComplexityEnum.BEGINNER" />
			<el-radio-button label="专家" :value="ComplexityEnum.EXPERT" />
		</el-radio-group>
	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import { ComplexityEnum } from "@/enums/complexity.enum";

const settingsStore = useSettingsStore();

const complexityValue = computed({
	get() {
		return settingsStore.complexity;
	},
	set(value) {
		settingsStore.complexity = value;
	}
});
</script>

<style lang="scss" scoped>
.complexity-setting {
	margin-right: 10px;
}
</style>
