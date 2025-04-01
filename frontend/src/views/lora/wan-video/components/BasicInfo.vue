<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 10:12:06
 * @LastEditTime: 2025-03-31 10:33:53
 * @LastEditors: mulingyuer
 * @Description: lora基本信息
 * @FilePath: \frontend\src\views\lora\wan-video\components\BasicInfo.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="训练任务类型" prop="config.task" popover-content="task">
		<el-radio-group v-model="ruleForm.config.task">
			<el-radio-button label="I2V" value="i2v-14B" />
			<el-radio-button label="T2V" value="t2v-14B" />
		</el-radio-group>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 名称" prop="config.output_name" popover-content="output_name">
		<el-input v-model="ruleForm.config.output_name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert" label="wan2模型地址" prop="config.dit" popover-content="dit">
		<FileSelector v-model="ruleForm.config.dit" placeholder="请选择训练用的wan2模型" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert && isI2V"
		label="CLIP模型路径"
		prop="config.clip"
		popover-content="clip"
	>
		<FileSelector v-model="ruleForm.config.clip" placeholder="请选择CLIP模型" />
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert && isT2V" label="T5模型" prop="config.t5" popover-content="t5">
		<FileSelector v-model="ruleForm.config.t5" placeholder="请选择T5模型" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert && isT2V"
		label="T5使用FP8模式"
		prop="config.fp8_t5"
		popover-content="fp8_t5"
	>
		<el-switch v-model="ruleForm.config.fp8_t5" />
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert" label="VAE模型路径" prop="config.vae" popover-content="vae">
		<FileSelector v-model="ruleForm.config.vae" placeholder="请选择VAE模型" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="将VAE缓存保留在CPU内存中（减少显存占用，但可能影响推理速度）"
		prop="config.vae_cache_cpu"
		popover-content="vae_cache_cpu"
	>
		<el-switch v-model="ruleForm.config.vae_cache_cpu" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="VAE模型的计算精度"
		prop="config.vae_dtype"
		popover-content="vae_dtype"
	>
		<el-select v-model="ruleForm.config.vae_dtype" placeholder="请选择VAE模型的计算精度">
			<el-option
				v-for="(item, index) in vaeDTypeOptions"
				:key="index"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" prop="config.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.config.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 是否i2v任务 */
const isI2V = computed(() => ruleForm.value.config.task === "i2v-14B");
/** 是否是t2v任务 */
const isT2V = computed(() => ruleForm.value.config.task === "t2v-14B");
/** VAE模型的计算精度选项 */
const vaeDTypeOptions = ref<ElOptions>([
	{
		label: "float16",
		value: "float16"
	},
	{
		label: "bfloat16",
		value: "bfloat16"
	},
	{
		label: "float32",
		value: "float32"
	}
]);
</script>

<style scoped></style>
