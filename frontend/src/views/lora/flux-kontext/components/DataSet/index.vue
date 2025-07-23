<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 09:41:55
 * @LastEditTime: 2025-07-23 17:34:04
 * @LastEditors: mulingyuer
 * @Description: 数据集
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\DataSet\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="data-set">
		<div class="data-set-content">
			<Tabs v-model="activeTabName" v-model:form="ruleForm" />
		</div>
		<div class="data-set-footer">
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
				popover-content="is_add_global_prompt"
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
				:loading="loading || monitorTagData.isListen"
				:disabled="disabled"
				@submit="onTagClick"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { TabPaneName } from "element-plus";
import type { RuleForm } from "../../types";
import Tabs from "./Tabs.vue";
import { useTag } from "@/hooks/task/useTag";
import { useTrainingStore } from "@/stores";

const trainingStore = useTrainingStore();
const { monitorTagData, tag, tagMonitor } = useTag();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const activeTabName = defineModel("activeTabName", {
	type: String as PropType<TabPaneName>,
	required: true
});
const activeDataSetItem = computed(() => {
	const findItem = ruleForm.value.datasets.find((item) => item.id === activeTabName.value);
	return findItem;
});
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
		const { tagConfig, datasets } = ruleForm.value;
		if (datasets.length === 0 || !activeDataSetItem.value) {
			ElMessage.warning("当前选中的数据集为空，请检查是否已添加数据集");
			return;
		}

		loading.value = true;

		const tagResult = await tag({
			tagDir: activeDataSetItem.value!.folder_path,
			tagModel: tagConfig.tagger_model,
			joyCaptionPromptType: tagConfig.joy_caption_prompt_type,
			isAddGlobalPrompt: tagConfig.is_add_global_prompt,
			globalPrompt: ruleForm.value.trigger_word,
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

		console.log("打标任务创建失败", error);
	}
}

// 初始化
(function init() {
	if (ruleForm.value.datasets.length > 0) {
		activeTabName.value = ruleForm.value.datasets[0].id;
	}
})();
</script>

<style lang="scss" scoped>
.data-set {
	width: 100%;
}
.data-set-content {
	margin-bottom: 22px;
}
.data-set-tabs {
	margin-bottom: 22px;
	:deep(.el-tabs__header.is-top) {
		height: 40px;
		@include no-select();
	}
	:deep(.el-tabs__new-tab) {
		height: 100%;
		min-width: 32px;
		margin: 0;
		border: none;
		background-color: var(--el-color-primary);
		border-radius: 0;
		color: var(--el-color-white);
		&:hover {
			background-color: var(--el-color-primary-light-3);
		}
		&:active {
			opacity: 0.7;
		}
	}
	:deep(.el-tabs__nav-wrap.is-scrollable) {
		padding: 0 25px;
	}
	:deep(.el-tabs__nav-prev),
	:deep(.el-tabs__nav-next) {
		line-height: 40px;
		width: 25px;
		&:not(.is-disabled) {
			color: var(--el-color-info-light-3);
			&:hover {
				color: var(--el-color-info);
			}
		}
	}
}
.data-set-add-btn {
}
</style>
