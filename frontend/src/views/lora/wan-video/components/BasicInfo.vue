<!--
 * @Author: mulingyuer
 * @Date: 2025-03-20 10:12:06
 * @LastEditTime: 2025-09-04 15:24:37
 * @LastEditors: mulingyuer
 * @Description: lora基本信息
 * @FilePath: \frontend\src\views\lora\wan-video\components\BasicInfo.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="训练任务类型" prop="config.task" popover-content="task">
		<el-radio-group v-model="ruleForm.config.task" @change="onTaskChange">
			<el-radio-button label="I2V (Wan 2.1)" value="i2v-14B" />
			<el-radio-button label="T2V (Wan 2.1)" value="t2v-14B" />
			<el-radio-button label="I2V (Wan 2.2)" value="i2v-A14B" />
			<el-radio-button label="T2V (Wan 2.2)" value="t2v-A14B" />
		</el-radio-group>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 名称" prop="config.output_name" popover-content="output_name">
		<el-input v-model="ruleForm.config.output_name" placeholder="请输入LoRA名称" />
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert" label="wan2模型地址" prop="config.dit" popover-content="dit">
		<FileSelector
			v-model="ruleForm.config.dit"
			placeholder="请选择训练用的wan2模型，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isWan22"
		label="wan2.2 模型类型"
		prop="dit_model_type"
		popover-content="dit_model_type"
	>
		<el-radio-group v-model="ruleForm.dit_model_type" @change="onDitModelTypeChange">
			<el-radio-button label="high" value="high" />
			<el-radio-button label="low" value="low" />
			<el-radio-button label="both" value="both" />
		</el-radio-group>
	</PopoverFormItem>
	<el-form-item v-show="isExpert && isWan22 && ruleForm.dit_model_type === 'both'">
		<el-alert
			class="no-select"
			title="注意：24GB显存不支持both类型训练，请选择high或low类型训练。"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
	<PopoverFormItem
		v-show="isExpert && isWan22"
		label="wna2.2 high模型地址"
		prop="config.dit_high_noise"
		popover-content="dit_high_noise"
	>
		<FileSelector
			v-model="ruleForm.config.dit_high_noise"
			placeholder="请选择训练用的wan2.2 high模型地址，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert && isI2V"
		label="CLIP模型路径"
		prop="config.clip"
		popover-content="clip"
	>
		<FileSelector
			v-model="ruleForm.config.clip"
			placeholder="请选择CLIP模型，不知道可以不填，智灵会自动选择合适的模型"
		/>
	</PopoverFormItem>
	<PopoverFormItem v-show="isExpert && isT2V" label="T5模型" prop="config.t5" popover-content="t5">
		<FileSelector
			v-model="ruleForm.config.t5"
			placeholder="请选择T5模型，不知道可以不填，智灵会自动选择合适的模型"
		/>
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
		<FileSelector
			v-model="ruleForm.config.vae"
			placeholder="请选择VAE模型，不知道可以不填，智灵会自动选择合适的模型"
		/>
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
			<el-option label="float16" value="float16" />
			<el-option label="bfloat16" value="bfloat16" />
			<el-option label="float32" value="float32" />
		</el-select>
	</PopoverFormItem>
	<PopoverFormItem label="LoRA 保存路径" prop="config.output_dir" popover-content="output_dir">
		<FolderSelector v-model="ruleForm.config.output_dir" placeholder="请选择LoRA保存路径" />
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";
import { WanHelper } from "../wan.helper";

const settingsStore = useSettingsStore();
const wanHelper = new WanHelper();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 是否wan2.1 i2v任务 */
const isI2V = computed(() => ruleForm.value.config.task === "i2v-14B");
/** 是否是wan2.1 t2v任务 */
const isT2V = computed(() => ruleForm.value.config.task === "t2v-14B");
/** 是否wan2.2 */
const isWan22 = computed(() => wanHelper.isWan2(ruleForm.value.config.task));

// 任务类型发生变化
function onTaskChange(val: unknown) {
	switch (val as RuleForm["config"]["task"]) {
		case "t2v-14B":
		case "i2v-14B":
			ruleForm.value.config.timestep_boundary = undefined;
			ruleForm.value.config.min_timestep = undefined;
			ruleForm.value.config.max_timestep = undefined;
			ruleForm.value.config.mixed_precision = "bf16";

			ElMessage.success("检测到任务类型变化，已应用对应的默认配置");
			break;
		case "i2v-A14B":
		case "t2v-A14B":
			ruleForm.value.config.mixed_precision = "fp16";
			onDitModelTypeChange(ruleForm.value.dit_model_type, val as RuleForm["config"]["task"]);
			break;
		default:
			console.warn(`未处理的任务类型: ${val}`);
	}
}

// wan2.2训练的模型发生变化
function onDitModelTypeChange(val: unknown, task?: RuleForm["config"]["task"]) {
	task = task ?? ruleForm.value.config.task;

	switch (val as RuleForm["dit_model_type"]) {
		case "low":
			ruleForm.value.config.min_timestep = 0;
			ruleForm.value.config.max_timestep = 875;
			ruleForm.value.config.timestep_boundary = undefined;

			break;
		case "high":
			ruleForm.value.config.min_timestep = 875;
			ruleForm.value.config.max_timestep = 1000;
			ruleForm.value.config.timestep_boundary = undefined;

			break;
		case "both":
			ruleForm.value.config.min_timestep = 0;
			ruleForm.value.config.max_timestep = 1000;

			if (task === "i2v-A14B") {
				ruleForm.value.config.timestep_boundary = 900;
			} else if (task === "t2v-A14B") {
				ruleForm.value.config.timestep_boundary = 875;
			}

			break;
		default:
			console.warn(`未处理的DIT模型类型: ${val}`);
	}

	ElMessage.success("检测到任务类型变化，已应用对应的默认配置");
}
</script>

<style scoped></style>
