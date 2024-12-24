<!--
 * @Author: mulingyuer
 * @Date: 2024-12-04 09:59:14
 * @LastEditTime: 2024-12-24 10:17:39
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
						:loading="submitLoading"
						@click="onSubmit"
					>
						一键打标
					</el-button>
				</el-form-item>
			</el-form>
			<TagMonitor v-show="showTagMonitor" />
			<GPUMonitor v-show="showGPUMonitor" class="ai-dataset-page-left-gpu-monitor" />
		</div>
		<div class="ai-dataset-page-right">
			<div id="ai-dataset-header" class="ai-dataset-header"></div>
			<div class="ai-dataset-content">
				<AiDataset
					ref="aiDatasetRef"
					btn-teleport-to="#ai-dataset-header"
					:dir="ruleForm.image_dir"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AiDataset from "@/components/AiDataset/index.vue";
import type { FormInstance, FormRules } from "element-plus";
import { checkDirectory } from "@/utils/lora.helper";
import { batchTag } from "@/api/tag";
import { EventBus } from "@/utils/event-bus";

interface RuleForm {
	/** 图片目录 */
	image_dir: string;
	/** 打标模型 */
	tagger_model: string;
}

const aiDatasetRef = ref<InstanceType<typeof AiDataset>>();
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<RuleForm>({
	image_dir: "/",
	tagger_model: "florence2"
});
const rules = reactive<FormRules<RuleForm>>({
	image_dir: [
		{ required: true, message: "请选择训练用的数据集目录", trigger: "change" },
		{
			asyncValidator: (_rule: any, value: string, callback: (error?: string | Error) => void) => {
				checkDirectory(value).then((exists) => {
					if (!exists) {
						callback(new Error("目录不存在"));
						return;
					}
					callback();
				});
			}
		}
	],
	tagger_model: [{ required: true, message: "请选择打标模型", trigger: "change" }]
});
const submitLoading = ref(false);

// 系统监控
const showGPUMonitor = ref(false);
function startGPUMonitor() {
	showGPUMonitor.value = true;
	EventBus.emit("gpu_monitor_start");
}
function stopGPUMonitor() {
	showGPUMonitor.value = false;
	EventBus.emit("gpu_monitor_stop");
}
// 打标监控
const showTagMonitor = ref(false);
function onTaggerStart(task_id: string) {
	showTagMonitor.value = true;
	EventBus.emit("tag_monitor_start", { taskId: task_id });
}
function onTaggerComplete() {
	showTagMonitor.value = false;
	submitLoading.value = false;
}
function onTaggerFailed() {
	showTagMonitor.value = false;
}

/** 校验 */
async function validate() {
	try {
		if (typeof ruleForm.value.image_dir !== "string" || ruleForm.value.image_dir.trim() === "") {
			throw new Error("请先选择训练用的数据集目录");
		}
		const exists = await checkDirectory(ruleForm.value.image_dir);
		if (!exists) throw new Error("数据集目录不存在");

		if (
			typeof ruleForm.value.tagger_model !== "string" ||
			ruleForm.value.tagger_model.trim() === ""
		) {
			throw new Error("请先选择打标模型");
		}

		return true;
	} catch (error) {
		ElMessage({
			message: (error as Error).message ?? "数据集相关信息不完整",
			type: "warning"
		});
		return false;
	}
}

// 打标
async function onSubmit() {
	try {
		const valid = await validate();
		if (!valid) return;
		submitLoading.value = true;
		// 打标
		const { task_id } = await batchTag({
			image_path: ruleForm.value.image_dir,
			model_name: ruleForm.value.tagger_model
		});
		// 监控GPU数据
		startGPUMonitor();
		// 监控打标数据
		onTaggerStart(task_id);

		ElMessage({
			message: "正在打标...",
			type: "success"
		});
	} catch (error) {
		// 停止监控GPU
		stopGPUMonitor();
		// 停止监控打标
		onTaggerFailed();

		submitLoading.value = false;
		console.log("打标任务创建失败", error);
	}
}

onMounted(() => {
	EventBus.on("tag_complete", onTaggerComplete);
	EventBus.on("tag_failed", onTaggerFailed);
});
onUnmounted(() => {
	EventBus.off("tag_complete", onTaggerComplete);
	EventBus.off("tag_failed", onTaggerFailed);
});
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
.ai-dataset-page-left-gpu-monitor {
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
