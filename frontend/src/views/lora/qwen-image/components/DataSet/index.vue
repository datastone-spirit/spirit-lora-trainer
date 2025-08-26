<!--
 * @Author: mulingyuer
 * @Date: 2025-08-12 17:25:36
 * @LastEditTime: 2025-08-26 16:45:38
 * @LastEditors: mulingyuer
 * @Description: AI 数据集
 * @FilePath: \frontend\src\views\lora\qwen-image\components\DataSet\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-collapse class="data-set-collapse" v-model="activeNames" expand-icon-position="left">
		<el-collapse-item title="数据集公共配置" name="1">
			<General v-model:form="ruleForm" />
		</el-collapse-item>
		<el-collapse-item title="数据集" name="2">
			<Tabs v-model:form="ruleForm" v-model="ruleForm.activeDatasetId" />
		</el-collapse-item>
	</el-collapse>
	<TagModelSelect
		v-model="ruleForm.tagConfig.tagger_model"
		label="打标模型"
		prop="tagConfig.tagger_model"
		popover-content="tagger_model"
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
		v-model="ruleForm.tagConfig.tagger_advanced_settings"
		label="打标高级设置"
		prop="tagConfig.tagger_advanced_settings"
		popover-content="tagger_advanced_settings"
	/>
	<template v-if="isAdvancedSetting">
		<TagJoyCaptionPrompt
			v-if="isJoyCaption2Model"
			v-model="ruleForm.tagConfig.tagger_global_prompt"
			label="打标提示词"
			prop="tagConfig.tagger_global_prompt"
			popover-content="tagger_global_prompt"
			placeholder="请输入打标提示词"
		/>
		<TagAppendSwitch
			v-model="ruleForm.tagConfig.tagger_is_append"
			label="是否追加到已有打标文件中"
			prop="tagConfig.tagger_is_append"
			popover-content="tagger_is_append"
		/>
	</template>
	<TagSubmitButton
		:is-bottom-margin="false"
		:loading="loading"
		:disabled="disabled"
		@submit="onTagClick"
	/>
	<el-form-item class="data-set-alert">
		<el-alert
			class="no-select"
			title="注意：只会给当前选中的数据集进行打标，如果需要打标多个数据集，请一个一个操作。"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import General from "./General.vue";
import Tabs from "./Tabs.vue";
import { useTrainingStore } from "@/stores";
import { useTag } from "@/hooks/task/useTag";

const trainingStore = useTrainingStore();
const { tag, tagMonitor } = useTag();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

const activeNames = ref(["2"]);
const loading = ref(false);
const disabled = computed(() => loading.value || trainingStore.useGPU);
/** 是否是Joy Caption 2.0模型 */
const isJoyCaption2Model = computed(
	() => ruleForm.value.tagConfig.tagger_model === "joy-caption-alpha-two"
);
/** 是否开启打标高级设置 */
const isAdvancedSetting = computed(() => ruleForm.value.tagConfig.tagger_advanced_settings);

/** 打标 */
async function onTagClick() {
	try {
		loading.value = true;

		const { dataset, tagConfig, activeDatasetId } = ruleForm.value;
		const activeDataset = dataset.datasets.find((item) => item.id === activeDatasetId);
		if (!activeDataset) {
			ElMessage.error("请选择数据集");
			loading.value = false;
			return;
		}

		const tagResult = await tag({
			tagDir: activeDataset.image_directory,
			tagModel: tagConfig.tagger_model,
			joyCaptionPromptType: tagConfig.joy_caption_prompt_type,
			isAddGlobalPrompt: tagConfig.is_add_global_prompt,
			globalPrompt: tagConfig.global_prompt,
			tagPrompt: tagConfig.tagger_global_prompt,
			isAppend: tagConfig.tagger_is_append,
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

<style lang="scss" scoped>
@use "sass:math";

.data-set-collapse {
	margin-bottom: 24px;
	:deep(.el-collapse-item__title) {
		font-size: 18px;
		font-weight: bold;
	}
	:deep(.el-collapse-item__content) {
		padding: math.div($zl-padding, 2) $zl-padding;
	}
}

.data-set-alert {
	margin-bottom: 0;
}
</style>
