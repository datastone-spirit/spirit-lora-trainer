<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:50:40
 * @LastEditTime: 2024-12-06 11:02:38
 * @LastEditors: mulingyuer
 * @Description: sdxl 模型训练页面
 * @FilePath: \frontend\src\views\lora\sdxl\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<TwoSplit class="lora-sdxl-page" direction="horizontal" :sizes="[40, 60]">
		<template #left>
			<div class="lora-sdxl-content">
				<el-form
					ref="ruleFormRef"
					:model="ruleForm"
					:rules="rules"
					label-width="auto"
					label-position="top"
					size="large"
				>
					<Collapse v-model="openStep1" title="第1步：LoRA 基本信息">
						<PopoverFormItem label="LoRA 名称" prop="output_name" popover-content="output_name">
							<el-input v-model="ruleForm.output_name" placeholder="请输入LoRA名称" />
						</PopoverFormItem>
						<PopoverFormItem label="LoRA 触发词" prop="class_tokens" popover-content="class_tokens">
							<el-input
								v-model="ruleForm.class_tokens"
								placeholder="请输入触发词，多个词用英文逗号分隔"
								type="textarea"
								:rows="4"
							/>
						</PopoverFormItem>
						<PopoverFormItem
							label="底模"
							prop="pretrained_model_name_or_path"
							popover-content="pretrained_model_name_or_path"
						>
							<FolderSelector
								v-model="ruleForm.pretrained_model_name_or_path"
								placeholder="请选择训练用的底模"
							/>
						</PopoverFormItem>
						<PopoverFormItem label="VAE" prop="vae" popover-content="vae">
							<FolderSelector v-model="ruleForm.vae" placeholder="请选择VAE" />
						</PopoverFormItem>
						<PopoverFormItem label="LoRA 保存路径" prop="output_dir" popover-content="output_dir">
							<FolderSelector v-model="ruleForm.output_dir" placeholder="请选择LoRA保存路径" />
						</PopoverFormItem>
					</Collapse>
					<Collapse v-model="openStep2" title="第2步：训练用的数据">
						<DatasetDirSelector v-model:dir="ruleForm.train_data_dir" dir-prop="train_data_dir" />
						<PopoverFormItem
							label="每个图像重复训练次数"
							prop="num_repeats"
							popover-content="num_repeats"
						>
							<el-input-number v-model.number="ruleForm.num_repeats" :step="1" step-strictly />
						</PopoverFormItem>
						<el-row :gutter="20">
							<el-col :span="8">
								<PopoverFormItem
									label="图片尺寸-宽度px"
									prop="resolution_width"
									popover-content="resolution"
								>
									<el-input-number v-model.number="ruleForm.resolution_width" :controls="false" />
								</PopoverFormItem>
							</el-col>
							<el-col :span="8">
								<PopoverFormItem
									label="图片尺寸-高度px"
									prop="resolution_height"
									popover-content="resolution"
								>
									<el-input-number v-model.number="ruleForm.resolution_height" :controls="false" />
								</PopoverFormItem>
							</el-col>
						</el-row>
						<ARB
							v-if="isExpert"
							v-model:enable_bucket="ruleForm.enable_bucket"
							v-model:bucket_reso_steps="ruleForm.bucket_reso_steps"
							v-model:min_bucket_reso="ruleForm.min_bucket_reso"
							v-model:max_bucket_reso="ruleForm.max_bucket_reso"
							enable-bucket-prop="enable_bucket"
							min-bucket-reso-prop="min_bucket_reso"
							max-bucket-reso-prop="max_bucket_reso"
							bucket-reso-steps-prop="bucket_reso_steps"
						/>
					</Collapse>
					<Collapse v-model="openStep3" title="第3步：训练参数配置">
						<div style="height: 2000px">xx</div>
					</Collapse>
				</el-form>
			</div>
		</template>
		<template #right>
			<div style="height: 100%">AI 数据集</div>
		</template>
	</TwoSplit>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import ARB from "./components/ARB.vue";
import { useSettingsStore } from "@/stores";

interface RuleForm {
	/** lora名称 */
	output_name: string;
	/** 触发词 */
	class_tokens: string;
	/** 底模 */
	pretrained_model_name_or_path: string;
	/** vae */
	vae: string;
	/** lora保存路径 */
	output_dir: string;
	/** 数据集目录 */
	train_data_dir: string;
	/** 每个图像重复训练次数 */
	num_repeats: number;
	/** 图片尺寸-宽度 */
	resolution_width: number;
	/** 图片尺寸-高度 */
	resolution_height: number;
	/** 启用 arb 桶以允许非固定宽高比的图片 */
	enable_bucket: boolean;
	/** arb 桶最小分辨率 */
	min_bucket_reso: number;
	/** arb 桶最大分辨率 */
	max_bucket_reso: number;
	/** arb 桶分辨率划分单位，SDXL 可以使用 32 (SDXL低于32时失效) */
	bucket_reso_steps: number;
}

const settingsStore = useSettingsStore();

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleForm>({
	output_name: "",
	class_tokens: "",
	pretrained_model_name_or_path: "",
	vae: "",
	output_dir: "",
	train_data_dir: "",
	num_repeats: 10,
	resolution_width: 512,
	resolution_height: 512,
	enable_bucket: true,
	min_bucket_reso: 256,
	max_bucket_reso: 1024,
	bucket_reso_steps: 64
});
const rules = reactive<FormRules<RuleForm>>({
	output_name: [{ required: true, message: "请输入LoRA名称", trigger: "blur" }],
	class_tokens: [{ required: true, message: "请输入触发词", trigger: "blur" }],
	pretrained_model_name_or_path: [
		{ required: true, message: "请选择训练用的底模", trigger: "change" }
	],
	output_dir: [{ required: true, message: "请选择LoRA保存路径", trigger: "blur" }],
	train_data_dir: [{ required: true, message: "请选择训练用的数据集目录", trigger: "change" }],
	num_repeats: [{ required: true, message: "请输入每个图像重复训练次数", trigger: "blur" }],
	resolution_width: [{ required: true, message: "请输入图片尺寸-宽度", trigger: "blur" }],
	resolution_height: [{ required: true, message: "请输入图片尺寸-高度", trigger: "blur" }]
});
/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);

const openStep1 = ref(true);
const openStep2 = ref(true);
const openStep3 = ref(true);
</script>

<style lang="scss" scoped>
.lora-sdxl-page {
	height: calc(100vh - $header-height - $padding * 2);
}
.lora-sdxl-content {
	padding: 16px 36px 16px 16px;
}
</style>
