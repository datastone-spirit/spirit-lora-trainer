<!--
 * @Author: mulingyuer
 * @Date: 2024-12-09 15:07:57
 * @LastEditTime: 2025-09-03 15:07:09
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
			prop="config.clip_skip"
			popover-content="clip_skip"
		>
			<el-slider
				v-model="ruleForm.config.clip_skip"
				:min="0"
				:max="12"
				:marks="marks"
				:show-stops="false"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="是否启用分割模式，可能用于模型或数据的特殊处理"
			prop="config.split_mode"
			popover-content="split_mode"
		>
			<el-switch v-model="ruleForm.config.split_mode" />
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="文本编码器的批次大小，影响文本处理效率"
			prop="config.text_encoder_batch_size"
			popover-content="text_encoder_batch_size"
		>
			<el-input-number
				v-model.number="ruleForm.config.text_encoder_batch_size"
				:step="1"
				:min="1"
				step-strictly
			/>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

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
	margin-bottom: 48px;
	:deep(.el-slider__marks-text) {
		color: var(--el-text-color-primary);
	}
	:deep(.el-slider__stop) {
		box-shadow: 0 0 0 2px var(--el-text-color-secondary);
	}
}
</style>
