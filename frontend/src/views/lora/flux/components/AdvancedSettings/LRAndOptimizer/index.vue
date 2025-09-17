<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 15:38:25
 * @LastEditTime: 2025-09-03 15:28:02
 * @LastEditors: mulingyuer
 * @Description: 学习率与优化器设置
 * @FilePath: \frontend\src\views\lora\flux\components\AdvancedSettings\LRAndOptimizer\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<FieldSetWrapper title="学习率与优化器设置">
		<PopoverFormItem label="U-Net 学习率" prop="config.unet_lr" popover-content="unet_lr">
			<el-input-number v-model.number="ruleForm.config.unet_lr" :step="0.000001" />
		</PopoverFormItem>
		<PopoverFormItem
			label="文本编码器学习率"
			prop="config.text_encoder_lr"
			popover-content="text_encoder_lr"
		>
			<el-input-number v-model.number="ruleForm.config.text_encoder_lr" :step="0.0001" />
		</PopoverFormItem>
		<PopoverFormItem
			label="学习率调度器设置"
			prop="config.lr_scheduler"
			popover-content="lr_scheduler"
		>
			<el-select v-model="ruleForm.config.lr_scheduler" placeholder="请选择学习率调度器设置">
				<el-option label="linear" value="linear" />
				<el-option label="cosine" value="cosine" />
				<el-option label="cosine_with_restarts" value="cosine_with_restarts" />
				<el-option label="polynomial" value="polynomial" />
				<el-option label="constant" value="constant" />
				<el-option label="constant_with_warmup" value="constant_with_warmup" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="学习率预热步数"
			prop="config.lr_warmup_steps"
			popover-content="lr_warmup_steps"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_warmup_steps"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="重启次数"
			prop="config.lr_scheduler_num_cycles"
			popover-content="lr_scheduler_num_cycles"
		>
			<el-input-number
				v-model.number="ruleForm.config.lr_scheduler_num_cycles"
				:step="1"
				step-strictly
				:min="0"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="优化器设置"
			prop="config.optimizer_type"
			popover-content="optimizer_type"
		>
			<el-select v-model="ruleForm.config.optimizer_type" placeholder="请选择优化器设置">
				<el-option label="AdamW" value="adamw" />
				<el-option label="AdamW8bit" value="adamw8bit" />
				<el-option label="PagedAdamW8bit" value="pagedadamw8bit" />
				<el-option label="Lion" value="lion" />
				<el-option label="Lion8bit" value="lion8bit" />
				<el-option label="PagedLion8bit" value="pagedlion8bit" />
				<el-option label="SGDNesterov" value="sgdnesterov" />
				<el-option label="SGDNesterov8bit" value="sgdnesterov8bit" />
				<el-option label="DAdaptation" value="dadaptation" />
				<el-option label="DAdaptAdam" value="dadaptadam" />
				<el-option label="DAdaptAdaGrad" value="dadaptadagrad" />
				<el-option label="DAdaptAdan" value="dadaptadan" />
				<el-option label="DAdaptAdanIP" value="dadaptadanip" />
				<el-option label="DAdaptLion" value="dadaptlion" />
				<el-option label="DAdaptSGD" value="dadaptsgd" />
				<el-option label="Prodigy" value="prodigy" />
				<el-option label="AdaFactor" value="adafactor" />
			</el-select>
		</PopoverFormItem>
		<PopoverFormItem
			label="最小信噪比伽马值, 如果启用推荐为 5"
			prop="config.min_snr_gamma"
			popover-content="min_snr_gamma"
		>
			<el-input-number
				v-model.number="ruleForm.config.min_snr_gamma"
				:step="1"
				step-strictly
				:min="1"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			label="自定义优化器选项参数，可以key=value的格式指定多个值，以空格分隔。&#10;示例：weight_decay=0.01 betas=.9,.999"
			prop="config.optimizer_args"
			popover-content="optimizer_args"
		>
			<el-input
				v-model="ruleForm.config.optimizer_args"
				:rows="6"
				type="textarea"
				placeholder="请输入自定义优化器参数"
			/>
		</PopoverFormItem>
		<PopoverFormItem
			v-show="isExpert"
			label="权重分配方案，控制训练中各部分的权重分布"
			prop="config.weighting_scheme"
			popover-content="weighting_scheme"
		>
			<el-select
				v-model="ruleForm.config.weighting_scheme"
				placeholder="权重分配方案，控制训练中各部分的权重分布"
			>
				<el-option label="sigma_sqrt" value="sigma_sqrt" />
				<el-option label="logit_normal" value="logit_normal" />
				<el-option label="mode" value="mode" />
				<el-option label="cosmap" value="cosmap" />
				<el-option label="uniform" value="uniform" />
				<el-option label="none" value="none" />
			</el-select>
		</PopoverFormItem>
	</FieldSetWrapper>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../../types";
import { useSettingsStore } from "@/stores";

const settingsStore = useSettingsStore();
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
