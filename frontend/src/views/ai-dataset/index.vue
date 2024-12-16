<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:14
 * @LastEditTime: 2024-12-16 17:55:45
 * @LastEditors: mulingyuer
 * @Description: AI数据集
 * @FilePath: \frontend\src\views\ai-dataset\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="ai-dataset-page">
		<div class="ai-dataset-page-left">
			<el-form
				ref="ruleFormRef"
				:model="ruleForm"
				:rules="rules"
				label-width="auto"
				label-position="top"
				size="large"
			>
				<el-form-item label="数据集目录" prop="image_dir">
					<FolderSelector v-model="ruleForm.image_dir" placeholder="请选择训练用的数据集目录" />
				</el-form-item>
				<TaggerModelSelect v-model="ruleForm.tagger_model" prop="tagger_model" />
				<el-form-item>
					<el-button
						class="ai-dataset-page-left-btn"
						type="primary"
						:loading="loading"
						@click="onSubmit"
					>
						一键打标
					</el-button>
				</el-form-item>
			</el-form>
			<TagMonitor v-if="showTagMonitor" :data="tagMonitorData" />
			<SystemMonitor
				v-if="showSystemMonitor"
				class="ai-dataset-page-left-system-monitor"
				:data="systemMonitorData"
			/>
		</div>
		<div class="ai-dataset-page-right">
			<div class="ai-dataset-header">
				<el-space>
					<el-button :loading="refreshing" @click="onRefresh">刷新</el-button>
					<el-button type="primary">上传文件</el-button>
				</el-space>
			</div>
			<div class="ai-dataset-content">
				<AiDataset ref="aiDatasetRef" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AiDataset from "@/components/AiDataset/index.vue";
import type { FormInstance, FormRules } from "element-plus";
import type { SystemMonitorProps } from "@/components/Monitor/SystemMonitor/index.vue";
import type { TagMonitorProps } from "@/components/Monitor/TagMonitor/index.vue";

interface RuleForm {
	/** 图片目录 */
	image_dir: string;
	/** 打标模型 */
	tagger_model: string;
}

const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleForm>({
	image_dir: "",
	tagger_model: ""
});
const rules = reactive<FormRules<RuleForm>>({
	image_dir: [{ required: true, message: "请选择训练用的数据集目录", trigger: "change" }],
	tagger_model: [{ required: true, message: "请选择打标模型", trigger: "change" }]
});
const loading = ref(false);

// 系统监控
const showSystemMonitor = ref(false);
const systemMonitorData = ref<SystemMonitorProps["data"]>({
	gpuUsage: 0, // gpu占用百分比
	gpuPower: 0, // gpu功率百分比
	gpuMemory: 0 // gpu显存百分比
});
// 打标监控
const showTagMonitor = ref(false);
const tagMonitorData = ref<TagMonitorProps["data"]>({
	currentRound: 0,
	totalRound: 0
});

// 打标
function onSubmit() {
	loading.value = true;
	setTimeout(() => {
		loading.value = false;
	}, 1000);
}

// 刷新
const refreshing = ref(false);
async function onRefresh() {
	if (!aiDatasetRef.value) return;
	refreshing.value = true;
	aiDatasetRef.value.getList().finally(() => {
		refreshing.value = false;
	});
}
</script>

<style lang="scss" scoped>
.ai-dataset-page {
	display: flex;
	height: 100%;
}
.ai-dataset-page-left {
	width: 300px;
	background-color: var(--zl-ai-dataset-bg);
	padding: $zl-padding;
	border-radius: $zl-border-radius;
	margin-right: $zl-padding;
}
.ai-dataset-page-left-btn {
	width: 100%;
}
.ai-dataset-page-left-system-monitor {
	justify-content: center;
	margin-top: 24px;
}
.ai-dataset-page-right {
	flex-grow: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
}
.ai-dataset-header {
	flex-shrink: 0;
	background-color: var(--zl-ai-dataset-bg);
	padding: $zl-padding;
	border-radius: $zl-border-radius;
	margin-bottom: $zl-padding;
	text-align: right;
}
.ai-dataset-content {
	flex-grow: 1;
	min-height: 0;
}
</style>
