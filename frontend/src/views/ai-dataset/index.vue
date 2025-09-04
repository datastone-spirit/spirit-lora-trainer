<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:14
 * @LastEditTime: 2025-09-04 10:50:48
 * @LastEditors: mulingyuer
 * @Description: AI数据集
 * @FilePath: \frontend\src\views\ai-dataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="ai-dataset-page">
		<div class="ai-dataset-page-left">
			<el-form
				ref="ruleFormRef"
				:model="ruleForm"
				:rules="rules"
				label-width="auto"
				label-position="top"
				size="large"
			>
				<el-form
					ref="ruleFormRef"
					:model="ruleForm"
					:rules="rules"
					label-width="auto"
					label-position="top"
					size="large"
				>
					<PopoverFormItem label="打标目录" prop="image_path" popover-content="image_path">
						<FolderSelector v-model="ruleForm.image_path" placeholder="请选择打标目录" />
					</PopoverFormItem>
					<PopoverFormItem label="打标模型" prop="model_name" popover-content="model_name">
						<ModelSelect v-model="ruleForm.model_name" />
					</PopoverFormItem>
					<PopoverFormItem
						v-show="isJoy2"
						label="Joy Caption 提示词类型"
						prop="prompt_type"
						popover-content="prompt_type"
					>
						<JoyCaptionPromptTypeSelect v-model="ruleForm.prompt_type" />
					</PopoverFormItem>
					<PopoverFormItem
						label="原样输出到打标文件的文本内容"
						prop="class_token"
						popover-content="class_token"
					>
						<el-input
							v-model="ruleForm.class_token"
							:rows="6"
							type="textarea"
							placeholder="请输入原样输出到打标文件的文本内容"
						/>
					</PopoverFormItem>
					<el-collapse v-model="ruleForm.advanced_setting" class="ai-tag-advanced-setting">
						<el-collapse-item title="高级设置" name="advanced_setting">
							<PopoverFormItem
								v-show="isJoy2"
								label="提示词"
								prop="global_prompt"
								popover-content="global_prompt"
							>
								<el-input
									v-model="ruleForm.global_prompt"
									:rows="6"
									type="textarea"
									placeholder="请输入打标模型所使用的提示词"
								/>
							</PopoverFormItem>
							<PopoverFormItem label="追加模式" prop="is_append" popover-content="is_append">
								<el-switch v-model="ruleForm.is_append" />
							</PopoverFormItem>
							<PopoverFormItem>
								<el-alert
									title="说明：如果之前已经打过标，则在原文本内容后追加打标结果；否则，则直接替换打标结果。"
									:closable="false"
								></el-alert>
							</PopoverFormItem>
						</el-collapse-item>
					</el-collapse>
					<PopoverFormItem>
						<el-button
							class="ai-dataset-btn"
							type="primary"
							:loading="loading"
							:disabled="disabled"
							round
							@click="onConfirm"
						>
							<Icon class="ai-dataset-btn-icon" name="ri-price-tag-3-fill" />
							{{ hasTag ? "正在打标" : "一键打标" }}
						</el-button>
					</PopoverFormItem>
					<PopoverFormItem>
						<el-button
							class="ai-dataset-btn"
							:loading="loading"
							:disabled="disabled"
							round
							@click="onReset"
						>
							<Icon class="ai-dataset-btn-icon" name="ri-reset-left-line" />
							重置表单
						</el-button>
					</PopoverFormItem>
				</el-form>
			</el-form>
			<div class="ai-dataset-page-monitor">
				<div class="ai-dataset-page-monitor-head">
					<TagMonitor />
				</div>
				<div class="ai-dataset-page-monitor-body">
					<GPUMonitor class="ai-dataset-page-left-gpu-monitor" />
				</div>
			</div>
		</div>
		<div class="ai-dataset-page-right">
			<div id="ai-dataset-header" class="ai-dataset-header"></div>
			<div class="ai-dataset-content">
				<AiDataset
					ref="aiDatasetRef"
					btn-teleport-to="#ai-dataset-header"
					:dir="ruleForm.image_path"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AiDataset from "@/components/AiDataset/index.vue";
import { useTag } from "@/hooks/task/useTag";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useTrainingStore, useSettingsStore } from "@/stores";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { joinPrefixKey } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";
import type { AiTagRuleForm } from "@/components/AiTag/index.vue";
import { getEnv } from "@/utils/env";

const trainingStore = useTrainingStore();
const settingsStore = useSettingsStore();
const env = getEnv();
const { tag, tagMonitor, isJoyCaption2Model } = useTag();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const loading = ref(false);
const disabled = computed(() => trainingStore.useGPU);
const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();
const ruleFormRef = useTemplateRef<FormInstance>("ruleFormRef");
const localStorageKey = joinPrefixKey("ai_dataset_form");
const defaultForm: AiTagRuleForm = {
	image_path: settingsStore.whiteCheck ? env.VITE_APP_LORA_OUTPUT_PARENT_PATH : "",
	model_name: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	class_token: "",
	global_prompt: "",
	is_append: false,
	advanced_setting: ""
};
const ruleForm = useEnhancedLocalStorage<AiTagRuleForm>({
	localKey: localStorageKey,
	defaultValue: structuredClone(defaultForm),
	version: "1.0.1"
});
const rules = ref<FormRules<AiTagRuleForm>>({
	image_path: [
		{
			required: true,
			validator: (_rule, value, callback) => {
				if (typeof value !== "string" || value.trim() === "") {
					return callback(new Error("请选择打标目录"));
				}

				callback();
			},
			trigger: "change"
		},
		{
			trigger: "change",
			validator: (_rule, value, callback) => {
				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("打标目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	model_name: [{ required: true, message: "请选择打标模型", trigger: "change" }],
	prompt_type: [
		{
			validator: (_rule, value, callback) => {
				const { model_name } = ruleForm.value;
				if (!isJoyCaption2Model(model_name)) return callback();

				if (typeof value !== "string" || value.trim() === "") {
					return callback(new Error("请选择提示词类型"));
				}

				return callback();
			},
			trigger: "change"
		}
	]
});
const isJoy2 = computed(() => isJoyCaption2Model(ruleForm.value.model_name));
const hasTag = computed(() => trainingStore.currentTaskInfo.type === "tag");

async function onConfirm() {
	try {
		if (!ruleFormRef.value) return;
		loading.value = true;
		const validateResult = await LoRAValidator.validateForm(ruleFormRef.value, {
			shouldShowErrorDialog: true
		});
		if (!validateResult.valid) {
			loading.value = false;
			return;
		}

		// api
		const result = await tag({
			...ruleForm.value,
			showTaskStartPrompt: true
		});

		// 触发查询打标任务
		tagMonitor.setTaskId(result.task_id).start();

		loading.value = false;
	} catch (error) {
		loading.value = false;
		tagMonitor.stop();

		console.error("打标任务创建失败", error);
	}
}

/** 重置表单 */
function onReset() {
	// 还原数据
	ruleForm.value = structuredClone(defaultForm);

	ElMessage.success("重置成功");
}
</script>

<style lang="scss" scoped>
.ai-dataset-page {
	display: flex;
	align-items: flex-start;
	height: calc(100vh - 24px);
}
.ai-dataset-page-left {
	width: 360px;
	height: 100%;
	background-color: var(--zl-ai-dataset-bg);
	padding: $zl-padding;
	border-radius: $zl-border-radius;
	margin-right: $zl-padding;
	overflow-y: auto;
}
.ai-tag-advanced-setting {
	margin-bottom: 24px;
}
.ai-tag-advanced-setting :deep(.el-collapse-item__content) {
	padding-left: $zl-padding;
	padding-right: $zl-padding;
}
.ai-dataset-btn {
	width: 100%;
}
.ai-dataset-btn-icon {
	margin-right: 6px;
}
.ai-dataset-page-monitor {
	margin-top: 24px;
}
.ai-dataset-page-monitor-head {
	display: flex;
	justify-content: center;
}
.ai-dataset-page-monitor-body {
	margin-top: 24px;
	display: flex;
	justify-content: center;
}
.ai-dataset-page-right {
	flex-grow: 1;
	min-width: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.ai-dataset-header {
	flex-shrink: 0;
	background-color: var(--zl-ai-dataset-bg);
	padding: $zl-padding;
	border-radius: $zl-border-radius;
	margin-bottom: $zl-padding;
	text-align: right;
}
.ai-dataset-content {
	flex-grow: 1;
	min-height: 0;
}
</style>
