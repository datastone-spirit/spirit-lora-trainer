<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 11:04:52
 * @LastEditTime: 2025-07-29 09:52:21
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
	<TagAddGlobalPromptSwitch
		v-model="ruleForm.tagConfig.is_add_global_prompt"
		label="是否把触发词输出到打标文件中"
		prop="tagConfig.is_add_global_prompt"
	/>
	<TagGlobalPrompt
		v-show="ruleForm.tagConfig.is_add_global_prompt"
		v-model="ruleForm.tagConfig.global_prompt"
		label="原样保留的打标提示词"
		prop="tagConfig.global_prompt"
		placeholder="请输入原样保留的打标提示词"
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
		:loading="loading || trainingStore.trainingTagData.isListen"
		:disabled="disabled"
		@submit="onTagClick"
	/>
</template>

<script setup lang="ts">
import { useTrainingStore } from "@/stores";
import type { RuleForm } from "../../types";
import { useTag } from "@/hooks/task/useTag";

const trainingStore = useTrainingStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
// hooks
const { tag, tagMonitor } = useTag();

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
			isAddGlobalPrompt: tagConfig.is_add_global_prompt,
			globalPrompt: tagConfig.global_prompt,
			tagPrompt: tagConfig.tag_global_prompt,
			isAppend: tagConfig.tag_is_append,
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
