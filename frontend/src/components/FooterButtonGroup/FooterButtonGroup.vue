<!--
 * @Author: mulingyuer
 * @Date: 2025-01-07 17:09:02
 * @LastEditTime: 2025-02-07 08:32:54
 * @LastEditors: mulingyuer
 * @Description: 页脚按钮组
 * @FilePath: \frontend\src\components\FooterButtonGroup\FooterButtonGroup.vue
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
				<el-popconfirm title="确定要重置数据吗？" width="180" @confirm="emits('resetData')">
					<template #reference>
						<el-button text> 重置数据 </el-button>
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
		<el-space class="footer-button-group-right" :size="40">
			<GPUMonitor v-if="trainingStore.useGPU" />
			<LoRATrainingMonitor v-if="monitorFluxLoraData.isListen" />
			<HYTrainingMonitor v-if="monitorHYLoraData.isListen" />
			<TagMonitor v-if="monitorTagData.isListen" />
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
		</el-space>
	</Teleport>
</template>

<script setup lang="ts">
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from "element-plus";
import type { TeleportProps } from "vue";
import { downloadTomlFile, readTomlFile, tomlParse, tomlStringify } from "@/utils/toml";
import { useGPU } from "@/hooks/useGPU";
import { useTrainingStore } from "@/stores";
import { useTag } from "@/hooks/useTag";
import { useFluxLora } from "@/hooks/useFluxLora";
import { useHYLora } from "@/hooks/useHYLora";

type ExportConfig = Record<string, any>;

export interface ConfigProps {
	/** 左按钮组teleport节点 */
	leftTo: TeleportProps["to"];
	leftDefer?: TeleportProps["defer"];
	/** 右按钮组teleport节点 */
	rightTo: TeleportProps["to"];
	rightDefer?: TeleportProps["defer"];
	/** 获取导出的配置对象 */
	getExportConfig: (() => Promise<ExportConfig> | ExportConfig) | ExportConfig;
	/** 导出的配置对象文件名前缀 */
	exportConfigPrefix?: string;
	/** 提交表单loading */
	submitLoading?: boolean;
}

const props = withDefaults(defineProps<ConfigProps>(), {
	leftDefer: true,
	rightDefer: true,
	submitLoading: false
});
const emits = defineEmits<{
	/** 配置导入 */
	loadConfig: [config: any];
	/** 重置数据 */
	resetData: [];
	/** 提交表单 */
	submit: [];
	/** 停止训练 */
	stop: [];
}>();

const trainingStore = useTrainingStore();
const { startGPUListen, stopGPUListen } = useGPU();
const { monitorTagData, startTagListen, stopTagListen, isTagTaskEnd } = useTag();
const { monitorFluxLoraData, startFluxLoraListen, stopFluxLoraListen, isFluxLoraTaskEnd } =
	useFluxLora();
const { monitorHYLoraData, startHYLoraListen, stopHYLoraListen, isHYLoraTaskEnd } = useHYLora();

// 配置导入
const uploadRef = ref<UploadInstance>();
const uploadFileList = ref<UploadUserFile[]>([]);
const onUploadExceed: UploadProps["onExceed"] = (files) => {
	uploadRef.value!.clearFiles();
	const file = files[0] as UploadRawFile;
	file.uid = genFileId();
	uploadRef.value!.handleStart(file);
};
const onUploadRequest: UploadProps["beforeUpload"] = async (file) => {
	try {
		const data = await readTomlFile(file);
		emits("loadConfig", tomlParse(data));
	} catch (error) {
		ElMessage.error((error as Error)?.message ?? "读取toml配置文件失败");
		console.error(error);
	}
	return false;
};

// 配置导出
async function onExportConfig() {
	try {
		let configData: ExportConfig;
		if (typeof props.getExportConfig === "function") {
			configData = await props.getExportConfig();
		} else {
			configData = props.getExportConfig;
		}
		const tomlStr = tomlStringify(configData);
		downloadTomlFile({ text: tomlStr, fileNamePrefix: props.exportConfigPrefix });
	} catch (error) {
		ElMessage.error(`配置导出发生错误：${(error as Error)?.message ?? "未知错误"}`);
		console.error(error);
	}
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

// 如果GPU被占用就开始监听
watch(
	() => trainingStore.useGPU,
	(newVal) => {
		if (newVal) {
			startGPUListen();
		} else {
			stopGPUListen();
		}
	},
	{ immediate: true }
);

// 组件生命周期
onMounted(() => {
	if (!isTagTaskEnd()) {
		startTagListen();
	}
	if (!isFluxLoraTaskEnd()) {
		startFluxLoraListen();
	}
	if (!isHYLoraTaskEnd()) {
		startHYLoraListen();
	}
});
onUnmounted(() => {
	stopGPUListen();
	stopTagListen();
	stopFluxLoraListen();
	stopHYLoraListen();
});
</script>

<style lang="scss" scoped>
.footer-button-group-left {
	height: 100%;
}
.footer-button-group-left-content {
	height: 100%;
}
.footer-button-group-right {
	width: 100%;
	height: 100%;
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
