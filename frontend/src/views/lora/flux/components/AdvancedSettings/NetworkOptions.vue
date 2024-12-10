<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 16:25:06
 * @LastEditTime: 2024-12-10 10:59:24
 * @LastEditors: mulingyuer
 * @Description: 网络配置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\NetworkOptions.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="网络设置">
		<FluxNetworkModuleSelect
			v-model="ruleForm.network_module"
			label="训练网络模块"
			:prop="formProps.network_module"
			popover-content="network_module"
		/>
		<PopoverFormItem
			label="从已有的 LoRA 模型上继续训练，请选择文件路径"
			:prop="formProps.network_weights"
			popover-content="network_weights"
		>
			<FileSelector v-model="ruleForm.network_weights" placeholder="请选择已有的 LoRA 模型" />
		</PopoverFormItem>
		<PopoverFormItem
			label="常用值：等于 network_dim 或 network_dim*1/2 或 1。使用较小的 alpha 需要提升学习率"
			:prop="formProps.network_alpha"
			popover-content="network_alpha"
		>
			<el-input-number v-model.number="ruleForm.network_alpha" :step="1" step-strictly :min="1" />
		</PopoverFormItem>
		<PopoverFormItem
			label="dropout 概率 （与 lycoris 不兼容，需要用 lycoris 自带的）"
			:prop="formProps.network_dropout"
			popover-content="network_dropout"
		>
			<el-input-number v-model.number="ruleForm.network_dropout" :step="0.01" />
		</PopoverFormItem>
		<PopoverFormItem
			label="最大范数正则化。如果使用，推荐为 1"
			:prop="formProps.scale_weight_norms"
			popover-content="scale_weight_norms"
		>
			<el-input-number v-model.number="ruleForm.scale_weight_norms" :step="0.01" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label="自定义 network_args，回车分割"
			:prop="formProps.network_args_custom"
			popover-content="network_args_custom"
		>
			<el-input-tag
				v-model="ruleForm.network_args_custom"
				clearable
				placeholder="请输入自定义 network_args"
				tag-type="primary"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="启用基础权重（差异炼丹）"
			:prop="formProps.enable_base_weight"
			popover-content="enable_base_weight"
		>
			<el-switch v-model="ruleForm.enable_base_weight" />
		</PopoverFormItem>
		<template v-if="ruleForm.enable_base_weight">
			<PopoverFormItem
				label="合并入底模的 LoRA 路径，可以选择多个"
				:prop="formProps.base_weights"
				popover-content="base_weights"
			>
				<FileSelector
					v-model="ruleForm.base_weights"
					placeholder="请选择合并入底模的 LoRA"
					multiple
				/>
			</PopoverFormItem>
			<PopoverFormItem
				label="合并入底模的 LoRA 权重，一行一个数字"
				:prop="formProps.base_weights_multiplier"
				popover-content="base_weights_multiplier"
			>
				<el-input
					v-model="ruleForm.base_weights_multiplier"
					type="textarea"
					placeholder="请输入合并入底模的 LoRA 权重"
					:autosize="{ minRows: 3 }"
				/>
			</PopoverFormItem>
		</template>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm, RuleFormProps } from "../../types";

export interface NetworkOptionsProps {
	/** 表单props */
	formProps: RuleFormProps;
}

defineProps<NetworkOptionsProps>();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
