<!--
 * @Author: mulingyuer
 * @Date: 2025-01-07 17:09:02
 * @LastEditTime: 2025-11-05 09:46:06
 * @LastEditors: mulingyuer
 * @Description: 传送至FooterBar组件中的内容
 * @FilePath: \frontend\src\components\TeleportFooterBarContent\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Teleport :to="leftTo" :defer="leftDefer">
		<div class="footer-button-group-left">
			<el-space class="footer-button-group-left-content" :size="12">
				<el-upload
					ref="uploadRef"
					v-model:file-list="uploadFileList"
					accept=".toml"
					:limit="1"
					:show-file-list="false"
					:on-exceed="onUploadExceed"
					:before-upload="onUploadRequest"
				>
					<el-button text> 配置导入 </el-button>
				</el-upload>
				<el-button text @click="onExportConfig"> 配置导出 </el-button>
				<el-popconfirm title="确定要重置配置吗？" width="180" @confirm="onResetData">
					<template #reference>
						<el-button text> 重置配置 </el-button>
					</template>
				</el-popconfirm>
				<el-popover
					placement="bottom"
					trigger="click"
					width="200"
					content="请前往智灵后台GPU详情页查看日志"
				>
					<template #reference>
						<el-button text> 日志 </el-button>
					</template>
				</el-popover>
			</el-space>
		</div>
	</Teleport>
	<Teleport :to="rightTo" :defer="rightDefer">
		<div class="footer-button-group-right">
			<GPUMonitor />
			<TagMonitor />
			<div v-if="mismatchWarning.show" class="footer-button-group-right-info">
				<el-text>{{ mismatchWarning.message }}</el-text>
			</div>
			<slot name="monitor-progress-bar"></slot>
			<el-space>
				<el-button
					v-if="!trainingStore.useGPU"
					type="primary"
					size="large"
					:loading="submitLoading || trainingStore.useGPU"
					@click="emits('submit')"
				>
					开始训练
				</el-button>
				<slot name="right-btn-group"></slot>
				<el-button v-if="trainingStore.useGPU" type="danger" size="large" @click="onStopTraining">
					停止训练
				</el-button>
			</el-space>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { useTrainingStore } from "@/stores";
import { LoRAHelper } from "@/utils/lora/lora.helper";
import { TomlUtils } from "@/utils/toml";
import type {
	FormInstance,
	UploadInstance,
	UploadProps,
	UploadRawFile,
	UploadUserFile
} from "element-plus";
import { genFileId } from "element-plus";
import type { TeleportProps } from "vue";

export interface ConfigProps {
	/** 左按钮组teleport节点 */
	leftTo?: TeleportProps["to"];
	/** 左按钮组defer */
	leftDefer?: TeleportProps["defer"];
	/** 右按钮组teleport节点 */
	rightTo?: TeleportProps["to"];
	/** 右按钮组defer */
	rightDefer?: TeleportProps["defer"];
	/** 提交表单loading */
	submitLoading?: boolean;
	/** 重置用的原数据 */
	resetData: Record<string, any>;
	/** 表单对象，传入后会在导入配置后重新校验 */
	formInstance?: FormInstance;
	/** 导出的配置文件前缀 */
	exportFileNamePrefix?: string;
}

const route = useRoute();
const trainingStore = useTrainingStore();

const props = withDefaults(defineProps<ConfigProps>(), {
	leftTo: "#footer-bar-teleport-left",
	leftDefer: true,
	rightTo: "#footer-bar-teleport-right",
	rightDefer: true,
	submitLoading: false
});
const emits = defineEmits<{
	/** 重置数据 */
	resetData: [];
	/** 提交表单 */
	submit: [];
	/** 停止训练 */
	stop: [];
	/** 配置导入 */
	importConfig: [];
	/** 配置导出 */
	exportConfig: [];
}>();
/** 合并的数据 */
const mergeData = defineModel("mergeData", { type: Object, required: true });

/** 当前路由的训练类型 */
const routeTrainingType = computed(() => route.meta.loRATaskType ?? "none");
/** 当前任务信息 */
const currentTaskInfo = computed(() => trainingStore.currentTaskInfo);
/** 不匹配的任务提示 */
const mismatchWarning = computed<{ show: boolean; message: string }>(() => {
	const { type, name } = currentTaskInfo.value;
	const blackList: Array<TaskType> = ["none", "tag"];
	if (blackList.includes(type) || type === routeTrainingType.value) {
		return { show: false, message: "" };
	}

	return { show: true, message: `请切换到 ${name} 训练页面查看训练进度` };
});

// 配置导入
const uploadRef = ref<UploadInstance>();
const uploadFileList = ref<UploadUserFile[]>([]);
// 保持文件只有一个，新的文件会覆盖旧的
const onUploadExceed: UploadProps["onExceed"] = (files) => {
	uploadRef.value!.clearFiles();
	const file = files[0] as UploadRawFile;
	file.uid = genFileId();
	uploadRef.value!.handleStart(file);
};
// 上传文件之前的钩子函数
const onUploadRequest: UploadProps["beforeUpload"] = async (file) => {
	try {
		const data = await TomlUtils.readTomlFile(file);
		onMergeData(TomlUtils.tomlParse(data));
		// 重置表单
		if (props.formInstance) props.formInstance?.validate();
		emits("importConfig");
	} catch (error) {
		ElMessage.error((error as Error)?.message ?? "读取toml配置文件失败");
		console.error(error);
	}
	return false;
};
// 合并数据
async function onMergeData(tomlObj: Record<string, any>) {
	try {
		// 合并数据
		await LoRAHelper.mergeTrainingFormData(mergeData.value, tomlObj);

		ElMessage.success("配置导入成功");
	} catch (error) {
		ElMessage.error((error as Error)?.message ?? "配置导入失败");
		console.error("配置导入失败：", error);
	}
}

// 配置导出
async function onExportConfig() {
	try {
		const tomlStr = TomlUtils.tomlStringify(mergeData.value);
		let fileNamePrefix = "";
		if (props.exportFileNamePrefix) {
			fileNamePrefix = props.exportFileNamePrefix;
		} else {
			fileNamePrefix = routeTrainingType.value !== "none" ? routeTrainingType.value : "";
		}
		TomlUtils.downloadTomlFile({ text: tomlStr, fileNamePrefix });
		emits("exportConfig");
	} catch (error) {
		ElMessage.error(`配置导出发生错误：${(error as Error)?.message ?? "未知错误"}`);
		console.error(error);
	}
}

// 重置数据
function onResetData() {
	// 还原数据
	mergeData.value = structuredClone(toRaw(props.resetData));
	// 触发事件
	emits("resetData");

	ElMessage.success("重置成功");
}

// 停止训练
function onStopTraining() {
	ElMessageBox({
		title: "提示",
		message:
			"本页面无法直接停止训练任务。若要中止训练，需进入GPU详情页面手动关闭GPU服务来停止训练进程",
		confirmButtonText: "知道了",
		customClass: "stop-training-dialog"
	})
		.then(() => {
			emits("stop");
		})
		.catch(() => {});
}
</script>

<style lang="scss" scoped>
.footer-button-group-left {
	height: 100%;
}
.footer-button-group-left-content {
	height: 100%;
}
.footer-button-group-right {
	display: flex;
	height: 100%;
	justify-content: flex-end;
	gap: 20px;
}
.footer-button-group-right-info {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
<style lang="scss">
.stop-training-dialog {
	.el-message-box__title,
	.el-message-box__message {
		color: var(--zl-stop-training-dialog-color);
		font-weight: bold;
	}
}
</style>
