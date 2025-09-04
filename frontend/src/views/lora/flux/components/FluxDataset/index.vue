<!--
 * @Author: mulingyuer
 * @Date: 2025-04-08 09:58:29
 * @LastEditTime: 2025-09-04 10:25:55
 * @LastEditors: mulingyuer
 * @Description: flux数据集组件
 * @FilePath: \frontend\src\views\lora\flux\components\FluxDataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="数据集目录"
		prop="aiTagRuleForm.image_path"
		popover-content="image_path"
		required
	>
		<FolderSelector
			v-model="ruleForm.aiTagRuleForm.image_path"
			placeholder="请选择训练用的数据集目录"
		/>
	</PopoverFormItem>
	<el-form-item class="margin-bottom-0">
		<AiTag
			v-model="ruleForm.aiTagRuleForm"
			show-get-trigger-words-btn
			:getTriggerWords="() => ruleForm.dataset.class_tokens"
		></AiTag>
	</el-form-item>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
// import { useTag } from "@/hooks/task/useTag";
// import { useTrainingStore } from "@/stores";
import AiTag from "@/components/AiTag/index.vue";

// const trainingStore = useTrainingStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
// // hooks
// const { tag, tagMonitor } = useTag();

// const loading = ref(false);
// const disabled = computed(() => loading.value || trainingStore.useGPU);
// /** 是否是Joy Caption 2.0模型 */
// const isJoyCaption2Model = computed(() => ruleForm.value.tagger_model === "joy-caption-alpha-two");
// /** 是否开启打标高级设置 */
// const isAdvancedSetting = computed(() => ruleForm.value.tagger_advanced_settings);

// /** 打标 */
// async function onTagClick() {
// 	try {
// 		loading.value = true;

// 		const tagResult = await tag({
// 			tagDir: ruleForm.value.image_dir,
// 			tagModel: ruleForm.value.tagger_model,
// 			joyCaptionPromptType: ruleForm.value.prompt_type,
// 			isAddGlobalPrompt: ruleForm.value.output_trigger_words,
// 			globalPrompt: ruleForm.value.class_tokens,
// 			tagPrompt: ruleForm.value.tagger_global_prompt,
// 			isAppend: ruleForm.value.tagger_is_append,
// 			showTaskStartPrompt: true
// 		});

// 		// 触发查询打标任务
// 		tagMonitor.setTaskId(tagResult.task_id).start();
// 		loading.value = false;
// 	} catch (error) {
// 		loading.value = false;
// 		tagMonitor.stop();

// 		console.error("打标任务创建失败", error);
// 	}
// }
</script>

<style scoped></style>
