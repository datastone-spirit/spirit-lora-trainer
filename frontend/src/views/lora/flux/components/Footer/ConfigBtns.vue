<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:25:37
 * @LastEditTime: 2024-12-17 10:14:22
 * @LastEditors: mulingyuer
 * @Description: 底部配置栏
 * @FilePath: \frontend\src\views\lora\flux\components\Footer\ConfigBtns.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Teleport :to="to" :defer="defer">
		<div class="lora-flux-config-panel">
			<el-space class="lora-flux-config-wrapper" :size="12">
				<el-upload
					ref="uploadRef"
					class="upload-demo"
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

export interface ConfigProps {
	to?: TeleportProps["to"];
	defer?: TeleportProps["defer"];
	/** 获取导出的配置对象 */
	exportConfig: () => Promise<Record<string, any>> | Record<string, any>;
}

const props = withDefaults(defineProps<ConfigProps>(), {
	to: "#footer-bar-left",
	defer: true
});
const emits = defineEmits<{
	/** 配置导入 */
	loadConfig: [config: Record<string, any>];
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
		const configData = await props.exportConfig();
		const tomlStr = tomlStringify(configData);
		downloadTomlFile(tomlStr);
	} catch (error) {
		ElMessage.error(`配置导出发生错误：${(error as Error)?.message ?? "未知错误"}`);
		console.error(error);
	}
}
</script>

<style lang="scss" scoped>
.lora-flux-config-panel {
	height: 100%;
}
.lora-flux-config-wrapper {
	height: 100%;
}
</style>
