<!--
 * @Author: mulingyuer
 * @Date: 2025-03-24 14:42:11
 * @LastEditTime: 2025-04-09 14:17:07
 * @LastEditors: mulingyuer
 * @Description: 训练用的数据
 * @FilePath: \frontend\src\views\lora\wan-video\components\TrainingData.vue
 * 怎么可能会有bug！！！
-->
<template>
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
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-宽度px"
				prop="dataset.general.resolution[0]"
				popover-content="resolution"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.resolution[0]"
					:controls="false"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				prop="dataset.general.resolution[1]"
				popover-content="resolution"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.resolution[1]"
					:controls="false"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="批次大小"
				prop="dataset.general.batch_size"
				popover-content="batch_size"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.batch_size"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="数据集重复次数"
				prop="dataset.general.num_repeats"
				popover-content="num_repeats"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.general.num_repeats"
					:step="1"
					step-strictly
					:min="1"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="总训练轮数"
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
		<el-col :span="12">
			<PopoverFormItem
				label="总训练步数"
				prop="config.max_train_steps"
				popover-content="max_train_steps"
			>
				<el-input-number
					v-model.number="ruleForm.config.max_train_steps"
					:step="1"
					step-strictly
					:min="1"
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
	</el-row>
	<PopoverFormItem
		v-show="isExpert"
		label="启用动态分辨率，启用 arb 桶以允许非固定宽高比的图片"
		prop="dataset.general.enable_bucket"
		popover-content="enable_bucket"
	>
		<el-switch v-model="ruleForm.dataset.general.enable_bucket" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="允许小图放大，arb 桶不放大图片"
		prop="dataset.general.bucket_no_upscale"
		popover-content="bucket_no_upscale"
	>
		<el-switch v-model="ruleForm.dataset.general.bucket_no_upscale" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="描述文件扩展名"
		prop="dataset.general.caption_extension"
		popover-content="caption_extension"
	>
		<el-input
			v-model="ruleForm.dataset.general.caption_extension"
			placeholder="请输入描述文件扩展名"
		/>
	</PopoverFormItem>
	<BaseSelector
		v-show="isExpert"
		v-model="ruleForm.config.mixed_precision"
		label="混合精度训练模式"
		prop="config.mixed_precision"
		popoverContent="mixed_precision"
		:options="mixedPrecisionOptions"
	/>
	<PopoverFormItem
		v-show="isExpert"
		label="保留加载训练集的worker，减少每个 epoch 之间的停顿"
		prop="config.persistent_data_loader_workers"
		popover-content="persistent_data_loader_workers"
	>
		<el-switch v-model="ruleForm.config.persistent_data_loader_workers" />
	</PopoverFormItem>
	<PopoverFormItem
		v-show="isExpert"
		label="控制数据加载并行进程数，4-16（根据CPU核心数调整）"
		prop="config.max_data_loader_n_workers"
		popover-content="max_data_loader_n_workers"
	>
		<el-input-number
			v-model.number="ruleForm.config.max_data_loader_n_workers"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../types";

const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 混合精度选项 */
const mixedPrecisionOptions = ref<ElOptions>([
	{
		label: "fp16",
		value: "fp16"
	},
	{
		label: "bf16",
		value: "bf16"
	},
	{
		label: "none",
		value: "none"
	}
]);
</script>

<style scoped></style>
