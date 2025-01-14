<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 10:40:26
 * @LastEditTime: 2025-01-10 10:33:52
 * @LastEditors: mulingyuer
 * @Description: 数据集目录选择器
 * @FilePath: \frontend\src\components\Form\DatasetDirSelector.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="dataset-dir-selector">
		<div class="dataset-dir-selector-left">
			<PopoverFormItem :label="dirLabel" :prop="dirProp" :popover-content="dirPopoverContent">
				<FolderSelector v-model="dir" :placeholder="dirPlaceholder" />
			</PopoverFormItem>
			<TaggerModelSelect
				v-model="taggerModel"
				:label="taggerLabel"
				:prop="taggerProp"
				:placeholder="taggerPlaceholder"
				:popover-content="taggerPopoverContent"
			/>
		</div>
		<div class="dataset-dir-selector-right">
			<el-button
				class="train-data-dir-selector-btn"
				type="primary"
				:loading="loading || monitorTagData.isListen"
				:disabled="trainingStore.useGPU"
				@click="onBtnClick"
			>
				{{ btnText }}
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTag } from "@/hooks/useTag";
import type { TaggerModelSelectProps } from "./TaggerModelSelect.vue";
import TaggerModelSelect from "./TaggerModelSelect.vue";
import { useTrainingStore } from "@/stores";

export interface DatasetDirSelectorProps {
	dirLabel?: string;
	dirProp?: string;
	dirPopoverContent: string;
	dirPlaceholder?: string;
	taggerLabel?: TaggerModelSelectProps["label"];
	taggerProp?: TaggerModelSelectProps["prop"];
	taggerPopoverContent: string;
	taggerPlaceholder?: TaggerModelSelectProps["placeholder"];
	btnText?: string;
	/** 打标submit函数 */
	tagSubmit: () => Promise<unknown> | unknown;
}

const props = withDefaults(defineProps<DatasetDirSelectorProps>(), {
	dirLabel: "数据集目录",
	dirPlaceholder: "请选择训练用的数据集目录",
	btnText: "一键打标"
});

const dir = defineModel("dir", { type: String, required: true });
const taggerModel = defineModel("taggerModel", { type: String, required: true });

const trainingStore = useTrainingStore();
const { monitorTagData } = useTag();
const loading = ref(false);
async function onBtnClick() {
	try {
		loading.value = true;

		await props.tagSubmit();

		loading.value = false;
	} catch (error) {
		loading.value = false;
		console.log("打标任务创建失败", error);
	}
}

onMounted(() => {
	console.warn("该组件已废弃，请使用Dataset.vue");
});
</script>

<style lang="scss" scoped>
.dataset-dir-selector {
	display: flex;
}
.dataset-dir-selector-left {
	flex-grow: 1;
	min-width: 0;
}
.train-data-dir-selector-btn {
	min-width: 120px;
	height: 140px;
}
.dataset-dir-selector-right {
	margin-left: 16px;
	display: flex;
	align-items: center;
}
</style>
