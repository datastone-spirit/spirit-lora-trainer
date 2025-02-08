<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:14
 * @LastEditTime: 2025-02-08 17:08:58
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
				<el-form-item label="数据集目录" prop="image_dir">
					<FolderSelector v-model="ruleForm.image_dir" placeholder="请选择训练用的数据集目录" />
				</el-form-item>
				<TaggerModelSelect v-model="ruleForm.tagger_model" prop="tagger_model" />
				<JoyCaptionPromptTypeSelect
					v-if="ruleForm.tagger_model === 'joy-caption-alpha-two'"
					v-model="ruleForm.prompt_type"
					label="Joy Caption 提示词类型"
					prop="prompt_type"
					placeholder="请选择Joy Caption 提示词类型"
				/>
				<el-form-item label="是否把触发词输出到打标文件中" prop="output_trigger_words">
					<el-switch v-model="ruleForm.output_trigger_words" />
				</el-form-item>
				<el-form-item
					v-show="ruleForm.output_trigger_words"
					label="LoRA 触发词"
					prop="class_tokens"
				>
					<el-input
						v-model="ruleForm.class_tokens"
						placeholder="请输入触发词，多个词用英文逗号分隔"
						type="textarea"
						:rows="4"
					/>
				</el-form-item>
				<DatasetAdvanced
					:tagger-model="ruleForm.tagger_model"
					v-model:advanced="ruleForm.tagger_advanced_settings"
					v-model:tagger-prompt="ruleForm.tagger_global_prompt"
					tagger-prompt-prop="tagger_global_prompt"
					v-model:tagger-append-file="ruleForm.tagger_is_append"
					tagger-append-file-prop="tagger_is_append"
				/>
				<el-form-item>
					<el-button
						class="ai-dataset-page-left-btn"
						type="primary"
						:loading="submitLoading || monitorTagData.isListen"
						:disabled="trainingStore.useGPU"
						@click="onSubmit"
					>
						一键打标
					</el-button>
				</el-form-item>
			</el-form>
			<TagMonitor v-if="monitorTagData.isListen" />
			<GPUMonitor v-if="trainingStore.useGPU" class="ai-dataset-page-left-gpu-monitor" />
		</div>
		<div class="ai-dataset-page-right">
			<div id="ai-dataset-header" class="ai-dataset-header"></div>
			<div class="ai-dataset-content">
				<AiDataset
					ref="aiDatasetRef"
					btn-teleport-to="#ai-dataset-header"
					:dir="ruleForm.image_dir"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { batchTag } from "@/api/tag";
import AiDataset from "@/components/AiDataset/index.vue";
import { useGPU } from "@/hooks/useGPU";
import { useTag } from "@/hooks/useTag";
import { checkDirectory } from "@/utils/lora.helper";
import type { FormInstance, FormRules } from "element-plus";
import { validateForm } from "@/utils/tools";
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import { useTrainingStore } from "@/stores";

interface RuleForm {
	/** 图片目录 */
	image_dir: string;
	/** 打标模型 */
	tagger_model: string;
	/** joy-caption-alpha-two打标模型的提示词类型 */
	prompt_type: string;
	/** 是否把触发词输出到打标文件中 */
	output_trigger_words: boolean;
	/** LoRA 触发词 */
	class_tokens: string;
	/** 打标高级设置 */
	tagger_advanced_settings: boolean;
	/** 打标提示词 */
	tagger_global_prompt: string;
	/** 是否追加到已有打标文件中 */
	tagger_is_append: boolean;
}

const trainingStore = useTrainingStore();
const { monitorTagData, startTagListen, stopTagListen, isTagTaskEnd } = useTag();
const { startGPUListen, stopGPUListen } = useGPU();
const { useEnhancedLocalStorage } = useEnhancedStorage();

const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();
const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}ai_dataset_form`;
const defaultForm = readonly<RuleForm>({
	image_dir: "/root",
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	class_tokens: "",
	tagger_advanced_settings: false,
	tagger_global_prompt: "",
	tagger_is_append: false
});
const ruleForm = useEnhancedLocalStorage<RuleForm>(
	localStorageKey,
	structuredClone(toRaw(defaultForm) as RuleForm)
);
const rules = reactive<FormRules<RuleForm>>({
	image_dir: [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				checkDirectory(value).then((exists) => {
					if (!exists) {
						callback(new Error("目录不存在"));
						return;
					}
					callback();
				});
			},
			trigger: "change"
		}
	],
	tagger_model: [{ required: true, message: "请选择打标模型", trigger: "change" }],
	class_tokens: [
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				if (!ruleForm.value.output_trigger_words) return callback();
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

/** 打标 */
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		const valid = await validateForm(ruleFormRef.value);
		if (!valid) {
			submitLoading.value = false;
			return;
		}
		if (trainingStore.useGPU) {
			submitLoading.value = false;
			ElMessage({
				message: "GPU已经被占用，请等待对应任务完成再执行打标",
				type: "error"
			});
			return;
		}

		// api
		const result = await batchTag({
			image_path: ruleForm.value.image_dir,
			model_name: ruleForm.value.tagger_model,
			class_token: ruleForm.value.output_trigger_words ? ruleForm.value.class_tokens : undefined,
			prompt_type: ruleForm.value.prompt_type,
			global_prompt:
				ruleForm.value.tagger_model === "joy-caption-alpha-two"
					? ruleForm.value.tagger_global_prompt
					: "",
			is_append: ruleForm.value.tagger_is_append
		});

		startTagListen(result.task_id);
		submitLoading.value = false;

		ElMessage({
			message: "正在打标...",
			type: "success"
		});
	} catch (error) {
		submitLoading.value = false;
		stopTagListen(true);
		console.log("打标任务创建失败", error);
	}
}

// 如果GPU被占用就开始监听
watch(
	() => trainingStore.useGPU,
	(newVal) => {
		if (newVal) {
			startGPUListen();
		} else {
			stopGPUListen();
		}
	},
	{ immediate: true }
);

onMounted(() => {
	// 组件挂载时，开始监听
	if (!isTagTaskEnd()) {
		startTagListen();
	}
});
onUnmounted(() => {
	// 组件销毁时，停止监听
	stopTagListen();
	stopGPUListen();
});
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
.ai-dataset-page-left-btn {
	width: 100%;
}
.ai-dataset-page-left-gpu-monitor {
	justify-content: center;
	margin-top: 24px;
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
