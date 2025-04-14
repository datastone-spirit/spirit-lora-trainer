<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 15:58:45
 * @LastEditTime: 2025-04-10 10:19:46
 * @LastEditors: mulingyuer
 * @Description: 采样与验证选项
 * @FilePath: \frontend\src\views\lora\wan-video\components\SampleValidator.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="训练前生成初始样本"
		prop="config.sample_at_first"
		popover-content="sample_at_first"
	>
		<el-switch v-model="ruleForm.config.sample_at_first" />
	</PopoverFormItem>
	<PopoverFormItem
		label="每N个epoch生成样本"
		prop="config.sample_every_n_epochs"
		popover-content="sample_every_n_epochs"
	>
		<el-input-number
			v-model.number="ruleForm.config.sample_every_n_epochs"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="每N步生成样本"
		prop="config.sample_every_n_steps"
		popover-content="sample_every_n_steps"
	>
		<el-input-number
			v-model.number="ruleForm.config.sample_every_n_steps"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isI2V"
		label="I2V采样使用的底图"
		prop="config.i2v_sample_image_path"
		popover-content="i2v_sample_image_path"
	>
		<FileSelector
			v-model="ruleForm.config.i2v_sample_image_path"
			placeholder="请选择I2V采样使用的底图"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="采样使用的提示词"
		prop="config.sample_prompts"
		popover-content="sample_prompts"
	>
		<el-input
			v-model="ruleForm.config.sample_prompts"
			:autosize="{ minRows: 4 }"
			type="textarea"
			placeholder="请输入采样提示词，多个词用英文逗号分隔"
		/>
	</PopoverFormItem>
	<el-form-item>
		<el-alert
			title="注意：采样会增加训练时间，不管设置哪种采样方式，都需要配置采样提示词"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
	<PopoverFormItem
		v-show="isExpert"
		label="文本控制强度，数值越大生成结果越遵循文本提示"
		prop="config.guidance_scale"
		popover-content="guidance_scale"
	>
		<el-input-number v-model.number="ruleForm.config.guidance_scale" :step="0.1" :min="0" />
	</PopoverFormItem>
	<BaseSelector
		v-show="isExpert"
		v-model="ruleForm.config.show_timesteps"
		label="显示时间步的方式"
		prop="config.show_timesteps"
		popoverContent="show_timesteps"
		:options="showTimeStepsOptions"
	/>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 显示时间步的方式选项 */
const showTimeStepsOptions = ref<ElOptions>([
	{
		label: "生成时序图",
		value: "image"
	},
	{
		label: "打印到控制台",
		value: "console"
	}
]);
/** 是否i2v任务 */
const isI2V = computed(() => ruleForm.value.config.task === "i2v-14B");
</script>

<style scoped></style>
