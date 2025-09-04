<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 16:25:06
 * @LastEditTime: 2025-09-03 15:28:41
 * @LastEditors: mulingyuer
 * @Description: 网络配置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\NetworkOptions\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="网络设置">
		<PopoverFormItem
			label="训练网络模块"
			prop="config.network_module"
			popover-content="network_module"
		>
			<el-select v-model="ruleForm.config.network_module" placeholder="请选择训练网络模块">
				<el-option label="networks.lora_flux" value="networks.lora_flux" />
				<el-option label="networks.oft_flux" value="networks.oft_flux" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="从已有的 LoRA 模型上继续训练，请选择文件路径"
			prop="config.network_weights"
			popover-content="network_weights"
		>
			<FileSelector
				v-model="ruleForm.config.network_weights"
				placeholder="请选择已有的 LoRA 模型"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="视为 OFT 的约束。我们建议使用 1e-2 到 1e-4"
			prop="config.network_alpha"
			popover-content="network_alpha"
		>
			<el-input-number v-model.number="ruleForm.config.network_alpha" :step="0.01" />
		</PopoverFormItem>
		<PopoverFormItem
			label="dropout 概率 （与 lycoris 不兼容，需要用 lycoris 自带的）"
			prop="config.network_dropout"
			popover-content="network_dropout"
		>
			<el-input-number v-model.number="ruleForm.config.network_dropout" :step="0.01" />
		</PopoverFormItem>
		<PopoverFormItem
			label="最大范数正则化。如果使用，推荐为 1"
			prop="config.scale_weight_norms"
			popover-content="scale_weight_norms"
		>
			<el-input-number v-model.number="ruleForm.config.scale_weight_norms" :step="0.01" :min="0" />
		</PopoverFormItem>
		<PopoverFormItem
			label='自定义 network_args &#10;示例："context_attn_dim=2" "context_mlp_dim=3" "context_mod_dim=4"'
			prop="config.network_args"
			popover-content="network_args"
		>
			<el-input
				v-model="ruleForm.config.network_args"
				placeholder="请输入自定义 network_args"
				type="textarea"
				:rows="6"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="启用基础权重（差异炼丹）"
			prop="config.enable_base_weight"
			popover-content="enable_base_weight"
		>
			<el-switch v-model="ruleForm.config.enable_base_weight" />
		</PopoverFormItem>
		<template v-if="ruleForm.config.enable_base_weight">
			<PopoverFormItem
				label="合并入底模的 LoRA 路径"
				prop="config.base_weights"
				popover-content="base_weights"
			>
				<FileSelector
					v-model="ruleForm.config.base_weights"
					placeholder="请选择合并入底模的 LoRA"
				/>
			</PopoverFormItem>
			<PopoverFormItem
				label="合并入底模的 LoRA 权重"
				prop="config.base_weights_multiplier"
				popover-content="base_weights_multiplier"
			>
				<el-input-number
					v-model.number="ruleForm.config.base_weights_multiplier"
					:step="0.1"
					:min="0"
				/>
			</PopoverFormItem>
		</template>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../../types";

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
</script>

<style scoped></style>
