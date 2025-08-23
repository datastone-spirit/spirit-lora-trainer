<!--
 * @Author: mulingyuer
 * @Date: 2025-03-26 15:31:41
 * @LastEditTime: 2025-08-21 11:44:40
 * @LastEditors: mulingyuer
 * @Description: 模型结构参数设置
 * @FilePath: \frontend\src\views\lora\wan-video\components\AdvancedSettings\ModelOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="模型结构参数">
		<PopoverFormItem
			label="LoRA权重缩放因子"
			prop="config.network_alpha"
			popover-content="network_alpha"
		>
			<el-input-number v-model.number="ruleForm.config.network_alpha" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="自定义网络参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：conv_dim=4 conv_alpha=1"
			prop="config.network_args"
			popover-content="network_args"
		>
			<el-input
				v-model="ruleForm.config.network_args"
				:rows="6"
				type="textarea"
				placeholder="自定义网络参数"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="LoRA的秩（rank）"
			prop="config.network_dim"
			popover-content="network_dim"
		>
			<el-input-number
				v-model.number="ruleForm.config.network_dim"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="训练时随机失活比例"
			prop="config.network_dropout"
			popover-content="network_dropout"
		>
			<el-input-number v-model.number="ruleForm.config.network_dropout" :step="0.1" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="预训练权重文件"
			prop="config.network_weights"
			popover-content="network_weights"
		>
			<FileSelector v-model="ruleForm.config.network_weights" placeholder="请选择预训练权重文件" />
		</PopoverFormItem>
		<PopoverFormItem
			label="用于自动从预训练权重中推断网络维度（rank）,必须与 --network_weights 配合使用"
			prop="config.dim_from_weights"
			popover-content="dim_from_weights"
		>
			<el-switch v-model="ruleForm.config.dim_from_weights" />
		</PopoverFormItem>
		<PopoverFormItem
			label="指定要交换的网络块数量"
			prop="config.blocks_to_swap"
			popover-content="blocks_to_swap"
		>
			<el-input-number
				v-model.number="ruleForm.config.blocks_to_swap"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<el-form-item>
			<el-alert
				class="no-select"
				title="注意：指定要交换的网络块数量数值越大，训练时长增加的越长"
				type="warning"
				:closable="false"
				show-icon
				effect="dark"
			/>
		</el-form-item>
		<PopoverFormItem
			v-show="isWan22"
			label="指定的时间步长切换"
			prop="config.timestep_boundary"
			popover-content="timestep_boundary"
		>
			<el-input-number
				v-model.number="ruleForm.config.timestep_boundary"
				:step="0.001"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<el-form-item v-show="isWan22">
			<el-alert
				class="no-select"
				title="注意：wan2.2专用，与blocks_to_swap冲突，如果blocks_to_swap设置了值，请调整为0"
				type="warning"
				:closable="false"
				show-icon
				effect="dark"
			/>
		</el-form-item>
		<PopoverFormItem label="启用基础FP8模式" prop="config.fp8_base" popover-content="fp8_base">
			<el-switch v-model="ruleForm.config.fp8_base" @change="onFP8BaseChange" />
		</PopoverFormItem>
		<PopoverFormItem label="启用FP8缩放模式" prop="config.fp8_scaled" popover-content="fp8_scaled">
			<el-switch v-model="ruleForm.config.fp8_scaled" @change="onFP8ScaledChange" />
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import type { ElSwitch } from "element-plus";

type ChangeCallback = InstanceType<typeof ElSwitch>["onChange"];

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否wan2.2 */
const isWan22 = computed(() => ["t2v-A14B", "i2v-A14B"].includes(ruleForm.value.config.task));

// 监听fp8_base和fp8_scaled的变化，如果同时启用，则自动关闭另一个
const onFP8BaseChange: ChangeCallback = (val) => {
	if (val && ruleForm.value.config.fp8_scaled) {
		ruleForm.value.config.fp8_scaled = false;
	}
};
const onFP8ScaledChange: ChangeCallback = (val) => {
	if (val && ruleForm.value.config.fp8_base) {
		ruleForm.value.config.fp8_base = false;
	}
};
</script>

<style scoped></style>
