<!--
 * @Author: mulingyuer
 * @Date: 2025-01-07 17:09:02
 * @LastEditTime: 2025-01-07 17:33:01
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
				<el-popover placement="bottom" trigger="click" width="200" content="请前往智灵后台查看日志">
					<template #reference>
						<el-button text> 日志 </el-button>
					</template>
				</el-popover>
			</el-space>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from "element-plus";
import type { TeleportProps } from "vue";
import { downloadTomlFile, readTomlFile, tomlParse, tomlStringify } from "@/utils/toml";

type ExportConfig = Record<string, any>;

export interface ConfigProps {
	/** 左按钮组teleport节点 */
	leftTo: TeleportProps["to"];
	leftDefer?: TeleportProps["defer"];
	/** 右按钮组teleport节点 */
	rightTo?: TeleportProps["to"];
	rightDefer?: TeleportProps["defer"];
	/** 获取导出的配置对象 */
	getExportConfig: (() => Promise<ExportConfig> | ExportConfig) | ExportConfig;
	/** 导出的配置对象文件名前缀 */
	exportConfigPrefix?: string;
}

const props = withDefaults(defineProps<ConfigProps>(), {
	leftDefer: true,
	rightDefer: true
});
const emits = defineEmits<{
	/** 配置导入 */
	loadConfig: [config: any];
	/** 重置数据 */
	resetData: [];
}>();

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
</script>

<style lang="scss" scoped>
.footer-button-group-left {
	height: 100%;
}
.footer-button-group-left-content {
	height: 100%;
}
</style>
