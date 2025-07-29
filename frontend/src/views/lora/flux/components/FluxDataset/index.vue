<!--
 * @Author: mulingyuer
 * @Date: 2025-04-08 09:58:29
 * @LastEditTime: 2025-07-29 09:51:55
 * @LastEditors: mulingyuer
 * @Description: flux数据集组件
 * @FilePath: \frontend\src\views\lora\flux\components\FluxDataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<TagDirectory
		v-model="ruleForm.image_dir"
		label="数据集目录"
		placeholder="请选择训练用的数据集目录"
		prop="image_dir"
		popover-content="image_dir"
	/>
	<TagModelSelect
		v-model="ruleForm.tagger_model"
		label="打标模型"
		prop="tagConfig.tagger_model"
		popover-content="tagger_model"
		placeholder="请选择打标模型"
	/>
	<TagJoyCaptionPromptTypeSelect
		v-if="isJoyCaption2Model"
		v-model="ruleForm.prompt_type"
		label="Joy Caption 提示词类型"
		prop="prompt_type"
		popover-content="prompt_type"
		placeholder="请选择Joy Caption 提示词类型"
	/>
	<TagAddGlobalPromptSwitch
		v-model="ruleForm.output_trigger_words"
		label="是否把触发词输出到打标文件中"
		prop="output_trigger_words"
		popover-content="output_trigger_words"
	/>
	<TagAdvancedSwitch
		v-model="ruleForm.tagger_advanced_settings"
		label="打标高级设置"
		prop="tagger_advanced_settings"
		popover-content="tagger_advanced_settings"
	/>
	<template v-if="isAdvancedSetting">
		<TagJoyCaptionPrompt
			v-if="isJoyCaption2Model"
			v-model="ruleForm.tagger_global_prompt"
			label="打标提示词"
			prop="tagger_global_prompt"
			popover-content="tagger_global_prompt"
			placeholder="请输入打标提示词"
		/>
		<TagAppendSwitch
			v-model="ruleForm.tagger_is_append"
			label="是否追加到已有打标文件中"
			prop="tagger_is_append"
			popover-content="tagger_is_append"
		/>
	</template>
	<TagSubmitButton
		:loading="loading || trainingStore.trainingTagData.isListen"
		:disabled="disabled"
		@submit="onTagClick"
	/>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import { useTag } from "@/hooks/task/useTag";
import { useTrainingStore } from "@/stores";

const trainingStore = useTrainingStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
// hooks
const { tag, tagMonitor } = useTag();

const loading = ref(false);
const disabled = computed(() => loading.value || trainingStore.useGPU);
/** 是否是Joy Caption 2.0模型 */
const isJoyCaption2Model = computed(() => ruleForm.value.tagger_model === "joy-caption-alpha-two");
/** 是否开启打标高级设置 */
const isAdvancedSetting = computed(() => ruleForm.value.tagger_advanced_settings);

/** 打标 */
async function onTagClick() {
	try {
		loading.value = true;

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
		tagMonitor.setTaskId(tagResult.task_id).start();
		loading.value = false;
	} catch (error) {
		loading.value = false;
		tagMonitor.stop();

		console.error("打标任务创建失败", error);
	}
}
</script>

<style scoped></style>
