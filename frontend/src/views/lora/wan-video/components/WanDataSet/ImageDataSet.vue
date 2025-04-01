<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:04:52
 * @LastEditTime: 2025-03-31 10:39:39
 * @LastEditors: mulingyuer
 * @Description: wan数据集
 * @FilePath: \frontend\src\views\lora\wan-video\components\WanDataSet\ImageDataSet.vue
 * 怎么可能会有bug！！！
-->
<template>
	<TagDirectory
		v-model="ruleForm.dataset.datasets[0].image_directory"
		label="数据集目录"
		placeholder="请选择训练用的数据集目录"
		prop="dataset.datasets.0.image_directory"
		popover-content="image_directory"
	/>
	<TagModelSelect
		v-model="ruleForm.tagConfig.tag_model"
		label="打标模型"
		prop="tagConfig.tag_model"
		popover-content="tag_model"
		placeholder="请选择打标模型"
	/>
	<TagJoyCaptionPromptTypeSelect
		v-if="isJoyCaption2Model"
		v-model="ruleForm.tagConfig.joy_caption_prompt_type"
		label="Joy Caption 提示词类型"
		prop="tagConfig.joy_caption_prompt_type"
		popover-content="joy_caption_prompt_type"
		placeholder="请选择Joy Caption 提示词类型"
	/>
	<TagAdvancedSwitch
		v-model="ruleForm.tagConfig.tag_advanced_settings"
		label="打标高级设置"
		prop="tagConfig.tag_advanced_settings"
		popover-content="tag_advanced_settings"
	/>
	<template v-if="isAdvancedSetting">
		<TagJoyCaptionPrompt
			v-if="isJoyCaption2Model"
			v-model="ruleForm.tagConfig.tag_global_prompt"
			label="打标提示词"
			prop="tagConfig.tag_global_prompt"
			popover-content="tag_global_prompt"
			placeholder="请输入打标提示词"
		/>
		<TagAppendSwitch
			v-model="ruleForm.tagConfig.tag_is_append"
			label="是否追加到已有打标文件中"
			prop="tagConfig.tag_is_append"
			popover-content="tag_is_append"
		/>
	</template>
	<TagSubmitButton
		:loading="loading || monitorTagData.isListen"
		:disabled="disabled"
		@submit="onTagClick"
	/>
</template>

<script setup lang="ts">
import { useTrainingStore } from "@/stores";
import type { RuleForm } from "../../types";
import { useTag } from "@/hooks/useTag";

const trainingStore = useTrainingStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
// hooks
const { monitorTagData, tag, startQueryTagTask, stopQueryTagTask } = useTag();

const loading = ref(false);
const disabled = computed(() => loading.value || trainingStore.useGPU);
/** 是否是Joy Caption 2.0模型 */
const isJoyCaption2Model = computed(
	() => ruleForm.value.tagConfig.tag_model === "joy-caption-alpha-two"
);
/** 是否开启打标高级设置 */
const isAdvancedSetting = computed(() => ruleForm.value.tagConfig.tag_advanced_settings);

/** 打标 */
async function onTagClick() {
	try {
		loading.value = true;

		const { dataset, tagConfig } = ruleForm.value;
		const tagResult = await tag({
			tagDir: dataset.datasets[0].image_directory,
			tagModel: tagConfig.tag_model,
			joyCaptionPromptType: tagConfig.joy_caption_prompt_type,
			isAddGlobalPrompt: false,
			tagPrompt: tagConfig.tag_global_prompt,
			isAppend: tagConfig.tag_is_append,
			showTaskStartPrompt: true
		});

		// 触发查询打标任务
		startQueryTagTask(tagResult.task_id);
		loading.value = false;
	} catch (error) {
		loading.value = false;
		stopQueryTagTask();

		console.log("打标任务创建失败", error);
	}
}
</script>

<style scoped></style>
