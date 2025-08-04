<!--
 * @Author: mulingyuer
 * @Date: 2025-07-22 16:32:59
 * @LastEditTime: 2025-08-04 08:43:24
 * @LastEditors: mulingyuer
 * @Description: 样本提示组件
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\SampleConfig\SamplePrompts.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="sample-prompts">
		<div v-if="ruleForm.sample.prompts.length > 0" class="sample-prompts-list">
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
				<el-form-item :prop="`sample.prompts[${index}].ctrl_img`" :rules="rules.ctrl_img">
					<FileSelector
						class="sample-prompts-item-file"
						v-model="item.ctrl_img"
						placeholder="请选择采样图片"
					/>
				</el-form-item>
				<el-form-item :prop="`sample.prompts[${index}].prompt`" :rules="rules.prompt">
					<el-input
						class="sample-prompts-item-input"
						v-model="item.prompt"
						placeholder="请输入样本提示词"
					/>
				</el-form-item>
			</div>
		</div>
		<el-button class="sample-prompts-add-btn" :icon="AddIcon" @click="onAdd">
			新增样本提示
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";
import { generateDefaultSamplePrompt } from "../../flex-kontext.helper";
import type { RuleForm } from "../../types";
import type { FormInstance, FormItemRule } from "element-plus";

type DynamicKeys = keyof RuleForm["sample"]["prompts"][number];
type DynamicRules = Partial<Record<DynamicKeys, FormItemRule[]>>;
export interface SamplePromptsProps {
	/** 表单实例 */
	formInstance: FormInstance | undefined;
}

const props = defineProps<SamplePromptsProps>();

// icon
const AddIcon = useIcon({ name: "ri-add-line" });
const DeleteIcon = useIcon({ name: "ri-close-line", size: 16 });

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const rules = reactive<DynamicRules>({
	ctrl_img: [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const disable = ruleForm.value.train.disable_sampling;
				if (disable) {
					callback();
					return;
				}
				// 联动校验
				props.formInstance?.validateField("sample.prompts");

				if (typeof value !== "string" || value.trim() === "") {
					callback(new Error("请选择采样图片"));
					return;
				}

				callback();
			}
		}
	],
	prompt: [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				const disable = ruleForm.value.train.disable_sampling;
				if (disable) {
					callback();
					return;
				}
				// 联动校验
				props.formInstance?.validateField("sample.prompts");

				if (typeof value !== "string" || value.trim() === "") {
					callback(new Error("请输入样本提示词"));
					return;
				}

				callback();
			},
			trigger: "blur"
		}
	]
});

// 新增样本提示
function onAdd() {
	ruleForm.value.sample.prompts.push(generateDefaultSamplePrompt());
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
.sample-prompts :deep(.el-form-item) {
	&.el-form-item {
		margin-bottom: 22px;
	}
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
	line-height: 34px;
	margin-bottom: math.div($zl-padding, 2);
	color: var(--zl-popover-form-item-tips-color);
}
.sample-prompts-item-delete-btn {
	position: absolute;
	top: math.div($zl-padding, 2);
	right: math.div($zl-padding, 2);
	z-index: 1;
}
</style>
