<!--
 * @Author: mulingyuer
 * @Date: 2025-08-13 10:22:12
 * @LastEditTime: 2025-08-13 14:32:30
 * @LastEditors: mulingyuer
 * @Description: 训练流程控制
 * @FilePath: \frontend\src\views\lora\qwen-image\components\TrainingConfig\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-row>
		<el-col :span="24">
			<PopoverFormItem
				label="跳过Text 编码潜空间缓存阶段"
				prop="skip_cache_text_encoder_latent"
				popover-content="skip_cache_text_encoder_latent"
			>
				<el-switch class="no-select" v-model="ruleForm.skip_cache_text_encoder_latent" />
			</PopoverFormItem>
			<PopoverFormItem v-show="ruleForm.skip_cache_text_encoder_latent">
				<el-alert
					title="确保你之前使用相同的数据集的并保证数据集路径不变的情况已经做过一次训练"
					type="warning"
					:closable="false"
					show-icon
					effect="dark"
				/>
			</PopoverFormItem>
			<PopoverFormItem
				label="跳过图像潜空间缓存阶段"
				prop="skip_cache_latent"
				popover-content="skip_cache_latent"
			>
				<el-switch class="no-select" v-model="ruleForm.skip_cache_latent" />
			</PopoverFormItem>
			<PopoverFormItem v-show="ruleForm.skip_cache_latent">
				<el-alert
					title="确保你之前使用相同的数据集的并保证数据集路径不变的情况已经做过一次训练"
					type="warning"
					:closable="false"
					show-icon
					effect="dark"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="随机种子" prop="config.seed" popover-content="seed">
				<el-input-number v-model.number="ruleForm.config.seed" :step="1" step-strictly />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="最大训练步数"
				prop="config.max_train_steps"
				popover-content="max_train_steps"
			>
				<el-input-number v-model.number="ruleForm.config.max_train_steps" :step="1" step-strictly />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="最大训练 epoch（轮数）"
				prop="config.max_train_epochs"
				popover-content="max_train_epochs"
			>
				<el-input-number
					v-model.number="ruleForm.config.max_train_epochs"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				v-show="isExpert"
				label="混合精度训练模式"
				prop="config.mixed_precision"
				popoverContent="mixed_precision"
			>
				<el-select v-model="ruleForm.config.mixed_precision" placeholder="请选择混合精度训练模式">
					<el-option label="fp16" value="fp16" />
					<el-option label="bf16" value="bf16" />
					<el-option label="none" value="none" />
				</el-select>
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="保存训练状态 配合 resume 参数可以继续从某个状态训练"
				prop="config.save_state"
				popover-content="save_state"
			>
				<el-switch v-model="ruleForm.config.save_state" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="每N步保存模型"
				prop="config.save_every_n_steps"
				popover-content="save_every_n_steps"
			>
				<el-input-number
					v-model.number="ruleForm.config.save_every_n_steps"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="每N epoch保存模型"
				prop="config.save_every_n_epochs"
				popover-content="save_every_n_epochs"
			>
				<el-input-number
					v-model.number="ruleForm.config.save_every_n_epochs"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="保留最近N个epoch的检查点"
				prop="config.save_last_n_epochs"
				popover-content="save_last_n_epochs"
			>
				<el-input-number
					v-model.number="ruleForm.config.save_last_n_epochs"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col v-show="isExpert" :span="12">
			<PopoverFormItem
				label="保留最近N步训练状态"
				prop="config.save_last_n_epochs_state"
				popover-content="save_last_n_epochs_state"
			>
				<el-input-number
					v-model.number="ruleForm.config.save_last_n_epochs_state"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col v-show="isExpert" :span="12">
			<PopoverFormItem
				label="保留最近N步的检查点"
				prop="config.save_last_n_steps"
				popover-content="save_last_n_steps"
			>
				<el-input-number
					v-model.number="ruleForm.config.save_last_n_steps"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col v-show="isExpert" :span="24">
			<PopoverFormItem
				label="专门控制state步数保留（覆盖save_last_n_steps）"
				prop="config.save_last_n_steps_state"
				popover-content="save_last_n_steps_state"
			>
				<el-input-number
					v-model.number="ruleForm.config.save_last_n_steps_state"
					:step="1"
					step-strictly
					:min="0"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col v-show="isExpert" :span="24">
			<PopoverFormItem
				label="训练结束时强制保存state（即使未启用save_state）"
				prop="config.save_state_on_train_end"
				popover-content="save_state_on_train_end"
			>
				<el-switch v-model="ruleForm.config.save_state_on_train_end" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="从某个 save_state 保存的中断状态继续训练"
				prop="config.resume"
				popover-content="resume"
			>
				<FolderSelector
					v-model="ruleForm.config.resume"
					placeholder="请选择中断状态的模型目录（state目录）"
				/>
			</PopoverFormItem>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
</script>

<style scoped></style>
