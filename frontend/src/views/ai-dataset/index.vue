<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:14
 * @LastEditTime: 2025-09-02 10:53:14
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
				<TagDirectory
					v-model="ruleForm.image_path"
					label="数据集目录"
					prop="image_path"
					placeholder="请选择训练用的数据集目录"
				/>
				<TagModelSelect
					v-model="ruleForm.model_name"
					label="打标模型"
					prop="tagger_model"
					placeholder="请选择打标模型"
				/>
				<TagJoyCaptionPromptTypeSelect
					v-show="isJoyCaption2Model"
					v-model="ruleForm.prompt_type"
					label="Joy Caption 提示词类型"
					prop="prompt_type"
					placeholder="请选择Joy Caption 提示词类型"
				/>
				<TagAddGlobalPromptSwitch
					v-model="ruleForm.is_add_global_prompt"
					label="是否把触发词输出到打标文件中"
					prop="is_add_global_prompt"
				/>
				<TagGlobalPrompt
					v-show="ruleForm.is_add_global_prompt"
					v-model="ruleForm.class_token"
					label="原样保留的打标提示词"
					prop="class_tokens"
					placeholder="请输入原样保留的打标提示词"
				/>
				<TagAdvancedSwitch
					v-model="ruleForm.tag_advanced_settings"
					label="打标高级设置"
					prop="tag_advanced_settings"
				/>
				<template v-if="isAdvancedSetting">
					<TagJoyCaptionPrompt
						v-show="isJoyCaption2Model"
						v-model="ruleForm.global_prompt"
						label="打标提示词"
						prop="global_prompt"
						placeholder="请输入打标提示词"
					/>
					<TagAppendSwitch
						v-model="ruleForm.is_append"
						label="追加到已有打标文件中"
						prop="is_append"
					/>
				</template>
				<TagSubmitButton
					:loading="submitLoading"
					:disabled="trainingStore.useGPU"
					:is-bottom-margin="false"
					@submit="onSubmit"
				/>
				<TagResetButton @reset="onReset" />
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
import { useTrainingStore } from "@/stores";
import { LoRAValidator } from "@/utils/lora/lora.validator";
import { joinPrefixKey } from "@/utils/tools";
import type { FormInstance, FormRules } from "element-plus";

interface RuleForm {
	/** 图片目录 */
	image_path: string;
	/** 打标模型 */
	model_name: string;
	/** joy-caption-alpha-two打标模型的提示词类型 */
	prompt_type: string;
	/** 是否把触发词输出到打标文件中 */
	is_add_global_prompt: boolean;
	/** LoRA 触发词 */
	class_token: string;
	/** 打标高级设置 */
	tag_advanced_settings: boolean;
	/** 打标提示词 */
	global_prompt: string;
	/** 是否追加到已有打标文件中 */
	is_append: boolean;
}

const trainingStore = useTrainingStore();
const { tag, tagMonitor } = useTag();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();
const ruleFormRef = ref<FormInstance>();
const localStorageKey = joinPrefixKey("ai_dataset_form");
const defaultForm = readonly<RuleForm>({
	image_path: "/root",
	model_name: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	is_add_global_prompt: true,
	class_token: "",
	tag_advanced_settings: false,
	global_prompt: "",
	is_append: false
});
const ruleForm = useEnhancedLocalStorage<RuleForm>({
	localKey: localStorageKey,
	defaultValue: structuredClone(toRaw(defaultForm) as RuleForm),
	version: "1.0.0"
});
const rules = reactive<FormRules<RuleForm>>({
	image_path: [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				LoRAValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("目录不存在"));
						return;
					}

					callback();
				});
			},
			trigger: "change"
		}
	],
	model_name: [{ required: true, message: "请选择打标模型", trigger: "change" }],
	class_token: [
		{
			validator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!ruleForm.value.is_add_global_prompt) return callback();
				if (typeof value !== "string" || value.trim() === "") {
					callback(new Error("请填写触发词"));
					return;
				}
				callback();
			},
			trigger: "change"
		}
	]
});
const submitLoading = ref(false);
/** 是否是Joy Caption 2.0模型 */
const isJoyCaption2Model = computed(() => ruleForm.value.model_name === "joy-caption-alpha-two");
/** 是否开启打标高级设置 */
const isAdvancedSetting = computed(() => ruleForm.value.tag_advanced_settings);

/** 打标 */
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;

		const tagResult = await tag({
			tagDir: ruleForm.value.image_path,
			tagModel: ruleForm.value.model_name,
			joyCaptionPromptType: ruleForm.value.prompt_type,
			isAddGlobalPrompt: ruleForm.value.is_add_global_prompt,
			globalPrompt: ruleForm.value.class_token,
			tagPrompt: ruleForm.value.global_prompt,
			isAppend: ruleForm.value.is_append,
			showTaskStartPrompt: true
		});

		// 触发查询打标任务
		tagMonitor.setTaskId(tagResult.task_id).start();
		submitLoading.value = false;
	} catch (error) {
		submitLoading.value = false;
		tagMonitor.stop();
		console.error("打标任务创建失败", error);
	}
}

/** 重置表单 */
function onReset() {
	// 还原数据
	ruleForm.value = structuredClone(toRaw(defaultForm));

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
	width: 320px;
	height: 100%;
	background-color: var(--zl-ai-dataset-bg);
	padding: $zl-padding;
	border-radius: $zl-border-radius;
	margin-right: $zl-padding;
	overflow-y: auto;
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
