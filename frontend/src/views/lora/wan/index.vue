<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 08:58:25
 * @LastEditTime: 2025-03-21 10:00:32
 * @LastEditors: mulingyuer
 * @Description: wan模型训练页面
 * @FilePath: \frontend\src\views\lora\wan\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="wan-page">
		<TwoSplit direction="horizontal" :sizes="[50, 50]" :minSize="[550, 380]">
			<template #left>
				<el-form
					ref="ruleFormRef"
					:model="ruleForm"
					:rules="rules"
					label-width="auto"
					label-position="top"
					size="large"
				>
					<Collapse v-model="openStep1" title="第1步：LoRA 基本信息">
						<BasicInfo v-model:form="ruleForm" />
					</Collapse>
					<Collapse v-model="openStep2" title="第2步：训练用的数据">
						<Dataset
							v-model:dataset-path="ruleForm.image_dir"
							dataset-path-prop="image_dir"
							dataset-path-popover-content="image_dir"
							v-model:tagger-model="ruleForm.tagger_model"
							tagger-model-prop="tagger_model"
							tagger-model-popover-content="tagger_model"
							v-model:joy-caption-prompt-type="ruleForm.prompt_type"
							joy-caption-prop="prompt_type"
							joy-caption-popover-content="prompt_type"
							v-model:output-trigger-words="ruleForm.output_trigger_words"
							output-trigger-words-prop="output_trigger_words"
							output-trigger-words-popover-content="output_trigger_words"
							:tagger-btn-loading="taggerBtnLoading || monitorTagData.isListen"
							@tagger-click="onTaggerClick"
						/>
						<DatasetAdvanced
							:tagger-model="ruleForm.tagger_model"
							v-model:advanced="ruleForm.tagger_advanced_settings"
							v-model:tagger-prompt="ruleForm.tagger_global_prompt"
							tagger-prompt-prop="tagger_global_prompt"
							tagger-prompt-popover-content="tagger_global_prompt"
							v-model:tagger-append-file="ruleForm.tagger_is_append"
							tagger-append-file-prop="tagger_is_append"
							tagger-append-file-popover-content="tagger_is_append"
						/>
					</Collapse>
				</el-form>
			</template>
			<template #right>
				<SplitRightPanel :toml="toml" :dir="ruleForm.image_dir" />
			</template>
		</TwoSplit>
		<FooterButtonGroup
			left-to="#footer-bar-left"
			:getExportConfig="onExportConfig"
			export-config-prefix="wan"
			@load-config="onLoadConfig"
			@reset-data="onResetData"
			right-to="#footer-bar-center"
			:submit-loading="submitLoading"
			@submit="onSubmit"
		>
			<!-- <template #right-btn-group>
				<el-button
					v-if="monitorFluxLoraData.data.showSampling"
					size="large"
					@click="onViewSampling"
				>
					查看采样
				</el-button>
			</template> -->
		</FooterButtonGroup>
		<SavePathWarningDialog v-model="openSavePathWarningDialog" />
	</div>
</template>

<script setup lang="ts">
import { useEnhancedStorage } from "@/hooks/useEnhancedStorage";
import type { RuleForm } from "./types";
import type { FormInstance, FormRules } from "element-plus";
import { tomlStringify } from "@/utils/toml";
import { useSettingsStore, useTrainingStore } from "@/stores";
import BasicInfo from "./components/BasicInfo.vue";
import { useTag } from "@/hooks/useTag/index";
const settingsStore = useSettingsStore();
const trainingStore = useTrainingStore();
const { useEnhancedLocalStorage } = useEnhancedStorage();
const { monitorTagData, tag, startQueryTagTask, stopQueryTagTask } = useTag();

const ruleFormRef = ref<FormInstance>();
const localStorageKey = `${import.meta.env.VITE_APP_LOCAL_KEY_PREFIX}lora_wan_form`;
const defaultForm = readonly<RuleForm>({
	output_name: "",
	class_tokens: "",
	// -----
	image_dir: "/root",
	tagger_model: "joy-caption-alpha-two",
	prompt_type: "Training Prompt",
	output_trigger_words: true,
	tagger_advanced_settings: false,
	tagger_global_prompt: "",
	tagger_is_append: false
});
const ruleForm = useEnhancedLocalStorage(localStorageKey, structuredClone(toRaw(defaultForm)));
const rules = reactive<FormRules<RuleForm>>({});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 是否已经恢复训练配置 */
const isRestored = ref(false);
/** lora保存警告弹窗 */
const openSavePathWarningDialog = ref(false);

// 折叠
const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
const openStep4 = ref(true);

/** toml */
const toml = ref("");
const generateToml = useDebounceFn(() => {
	toml.value = tomlStringify(ruleForm.value);
}, 300);
watch(ruleForm, generateToml, { deep: true, immediate: true });

/** 导入配置 */
function onLoadConfig(toml: RuleForm) {
	try {
		// mergeDataToForm(toml, ruleForm.value);
		ElMessage.success("配置导入成功");
	} catch (error) {
		ElMessage.error((error as Error)?.message ?? "配置导入失败");
		console.error(error);
	}
}
/** 导出配置 */
function onExportConfig() {
	return ruleForm.value;
}

/** 打标 */
const taggerBtnLoading = ref(false);
async function onTaggerClick() {
	try {
		taggerBtnLoading.value = true;

		const tagResult = await tag({
			tagDir: ruleForm.value.image_dir,
			tagModel: ruleForm.value.tagger_model,
			joyCaptionPromptType: ruleForm.value.prompt_type,
			isAddGlobalPrompt: ruleForm.value.output_trigger_words,
			globalPrompt: ruleForm.value.class_tokens,
			tagPrompt: ruleForm.value.tagger_global_prompt,
			isAppend: ruleForm.value.tagger_is_append,
			showTaskStartPrompt: true
		});

		// 触发查询打标任务
		startQueryTagTask(tagResult.task_id);
		taggerBtnLoading.value = false;
	} catch (error) {
		taggerBtnLoading.value = false;
		stopQueryTagTask();

		console.log("打标任务创建失败", error);
	}
}

/** 重置表单 */
function onResetData() {
	// 重置数据
	ruleForm.value = structuredClone(toRaw(defaultForm) as RuleForm);
	// 重置表单
	if (ruleFormRef.value) {
		ruleFormRef.value.resetFields();
	}

	ElMessage.success("重置成功");
}

/** 提交表单 */
const submitLoading = ref(false);
async function onSubmit() {
	try {
		if (!ruleFormRef.value) return;
		submitLoading.value = true;
		// const valid = await validateForm({
		// 	formRef: ruleFormRef,
		// 	formData: ruleForm,
		// 	trainingStore: trainingStore,
		// 	openSavePathWarningDialog: openSavePathWarningDialog
		// });
		// if (!valid) {
		// 	submitLoading.value = false;
		// 	return;
		// }

		// // 开始训练
		// const data: StartFluxTrainingData = formatFormData(ruleForm.value);
		// const { task_id } = await startFluxTraining(data);
		// // 监听训练数据
		// startFluxLoraListen(task_id);

		submitLoading.value = false;
		// isRestored.value = true;

		ElMessage.success("成功创建训练任务");
	} catch (error) {
		// 停止监控LoRA训练数据
		// stopFluxLoraListen(true);
		submitLoading.value = false;
		console.error("创建训练任务失败", error);
	}
}
</script>

<style lang="scss" scoped>
.wan-page {
	height: $zl-view-footer-bar-height;
}
</style>
