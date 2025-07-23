<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 16:32:59
 * @LastEditTime: 2025-07-23 17:38:06
 * @LastEditors: mulingyuer
 * @Description: 样本提示组件
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\SampleConfig\SamplePrompts.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="sample-prompts">
		<div class="sample-prompts-list">
			<div
				v-for="(item, index) in ruleForm.sample.prompts"
				:key="item.id"
				class="sample-prompts-item"
			>
				<el-button
					class="sample-prompts-item-delete-btn"
					type="danger"
					size="small"
					:icon="DeleteIcon"
					text
					circle
					@click="deleteSample(item, index)"
				/>
				<div class="sample-prompts-item-title">Prompt</div>
				<FileSelector
					class="sample-prompts-item-file"
					v-model="item.ctrl_img"
					placeholder="请选择采样图片"
				/>
				<el-input
					class="sample-prompts-item-input"
					v-model="item.prompt"
					placeholder="请输入样本提示词"
				/>
			</div>
		</div>
		<el-button class="sample-prompts-add-btn" :icon="AddIcon" @click="onAdd">
			新增样本提示
		</el-button>
	</div>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import { useIcon } from "@/hooks/useIcon";
import { generateUUID } from "@/utils/tools";

// icon
const AddIcon = useIcon({ name: "ri-add-line" });
const DeleteIcon = useIcon({ name: "ri-close-line", size: 16 });

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

// 新增样本提示
function onAdd() {
	ruleForm.value.sample.prompts.push({
		id: generateUUID(),
		prompt: "",
		ctrl_img: ""
	});
}

// 删除样本提示
function deleteSample(_item: unknown, index: number) {
	ruleForm.value.sample.prompts.splice(index, 1);
}
</script>

<style lang="scss" scoped>
@use "sass:math";

.sample-prompts {
	width: 100%;
}
.sample-prompts-add-btn {
	width: 100%;
}
.sample-prompts-list {
	margin-bottom: $zl-padding;
}
.sample-prompts-item {
	margin-bottom: $zl-padding;
	padding: math.div($zl-padding, 2);
	background-color: var(--zl-flux-kontext-sample-prompts-item-bg);
	border-radius: $zl-border-radius;
	position: relative;
}
.sample-prompts-item-title {
	font-size: 14px;
	line-height: 24px;
	margin-bottom: math.div($zl-padding, 2);
	color: var(--zl-popover-form-item-tips-color);
}
.sample-prompts-item-delete-btn {
	position: absolute;
	top: math.div($zl-padding, 2);
	right: math.div($zl-padding, 2);
	z-index: 1;
}
.sample-prompts-item-input {
	margin-top: math.div($zl-padding, 2);
}
</style>
