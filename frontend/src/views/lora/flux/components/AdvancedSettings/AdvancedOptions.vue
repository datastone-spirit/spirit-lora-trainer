<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:07:57
 * @LastEditTime: 2025-01-10 17:47:25
 * @LastEditors: mulingyuer
 * @Description: 高级设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\AdvancedOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="高级设置">
		<PopoverFormItem
			class="clip-skip"
			label="CLIP 跳过层数（玄学）"
			prop="clip_skip"
			popover-content="clip_skip"
		>
			<el-slider
				v-model="ruleForm.clip_skip"
				:min="0"
				:max="12"
				:marks="marks"
				:show-stops="false"
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

const marks = {
	0: "0",
	1: "1",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "11",
	12: "12"
};
</script>

<style lang="scss" scoped>
.clip-skip {
	padding: 0 20px;
	:deep(.el-slider__marks-text) {
		color: var(--el-text-color-primary);
	}
}
</style>
