<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 16:25:06
 * @LastEditTime: 2025-08-21 11:44:05
 * @LastEditors: mulingyuer
 * @Description: 网络配置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\NetworkOptions\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="网络设置">
		<PopoverFormItem label="训练网络模块" prop="network_module" popover-content="network_module">
			<FluxNetworkModuleSelect v-model="ruleForm.network_module" />
		</PopoverFormItem>
		<PopoverFormItem
			label="从已有的 LoRA 模型上继续训练，请选择文件路径"
			prop="network_weights"
			popover-content="network_weights"
		>
			<FileSelector v-model="ruleForm.network_weights" placeholder="请选择已有的 LoRA 模型" />
		</PopoverFormItem>
		<PopoverFormItem
			label="视为 OFT 的约束。我们建议使用 1e-2 到 1e-4"
			prop="network_alpha"
			popover-content="network_alpha"
		>
			<el-input v-model="ruleForm.network_alpha" placeholder="请输入OFT 的约束" />
		</PopoverFormItem>
		<PopoverFormItem
			label="dropout 概率 （与 lycoris 不兼容，需要用 lycoris 自带的）"
			prop="network_dropout"
			popover-content="network_dropout"
		>
			<el-input-number v-model.number="ruleForm.network_dropout" :step="0.01" />
		</PopoverFormItem>
		<PopoverFormItem
			label="最大范数正则化。如果使用，推荐为 1"
			prop="scale_weight_norms"
			popover-content="scale_weight_norms"
		>
			<el-input-number v-model.number="ruleForm.scale_weight_norms" :step="0.01" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label='自定义 network_args &#10;示例："context_attn_dim=2" "context_mlp_dim=3" "context_mod_dim=4"'
			prop="network_args"
			popover-content="network_args"
		>
			<el-input
				v-model="ruleForm.network_args"
				placeholder="请输入自定义 network_args"
				type="textarea"
				:rows="6"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="启用基础权重（差异炼丹）"
			prop="enable_base_weight"
			popover-content="enable_base_weight"
		>
			<el-switch v-model="ruleForm.enable_base_weight" />
		</PopoverFormItem>
		<template v-if="ruleForm.enable_base_weight">
			<PopoverFormItem
				label="合并入底模的 LoRA 路径"
				prop="base_weights"
				popover-content="base_weights"
			>
				<FileSelector v-model="ruleForm.base_weights" placeholder="请选择合并入底模的 LoRA" />
			</PopoverFormItem>
			<PopoverFormItem
				label="合并入底模的 LoRA 权重"
				prop="base_weights_multiplier"
				popover-content="base_weights_multiplier"
			>
				<el-input-number v-model.number="ruleForm.base_weights_multiplier" :step="0.1" :min="0" />
			</PopoverFormItem>
		</template>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../../types";
import FluxNetworkModuleSelect from "./FluxNetworkModuleSelect.vue";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
