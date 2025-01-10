<!--
 * @Author: mulingyuer
 * @Date: 2025-01-10 09:19:47
 * @LastEditTime: 2025-01-10 10:09:37
 * @LastEditors: mulingyuer
 * @Description: 数据集
 * @FilePath: \frontend\src\components\Form\Dataset.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="dataset">
		<div class="dataset-head">
			<div class="dataset-head-left">
				<PopoverFormItem
					:label="datasetPathLabel"
					:prop="datasetPathProp"
					:popover-content="datasetPathPopoverContent"
				>
					<FolderSelector v-model="datasetPath" :placeholder="datasetPathPlaceholder" />
				</PopoverFormItem>
				<TaggerModelSelect
					v-model="taggerModel"
					:label="taggerModelLabel"
					:prop="taggerModelProp"
					:placeholder="taggerModelPlaceholder"
					:popover-content="taggerModelPopoverContent"
				/>
			</div>
			<el-button
				class="dataset-head-btn"
				type="primary"
				:loading="taggerBtnLoading"
				:disabled="taggerDisabled"
				@click="emits('taggerClick')"
			>
				{{ taggerBtnText }}
			</el-button>
		</div>
		<div class="dataset-body">
			<JoyCaptionPromptTypeSelect
				v-if="taggerModel === 'joy-caption-alpha-two'"
				v-model="joyCaptionPromptType"
				:label="joyCaptionLabel"
				:prop="joyCaptionProp"
				:popover-content="joyCaptionPopoverContent"
				:placeholder="joyCaptionPlaceholder"
			/>
			<PopoverFormItem
				:label="outputTriggerWordsLabel"
				:prop="outputTriggerWordsProp"
				:popover-content="outputTriggerWordsPopoverContent"
			>
				<el-switch v-model="outputTriggerWords" />
			</PopoverFormItem>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useTrainingStore } from "@/stores";

export interface DatasetProps {
	/** 数据集路径 */
	datasetPathLabel?: string;
	datasetPathProp?: string;
	datasetPathPlaceholder?: string;
	datasetPathPopoverContent?: string;
	/** 打标模型 */
	taggerModelLabel?: string;
	taggerModelProp?: string;
	taggerModelPlaceholder?: string;
	taggerModelPopoverContent?: string;
	/** joy-caption 打标模型输出类型 */
	joyCaptionLabel?: string;
	joyCaptionProp?: string;
	joyCaptionPlaceholder?: string;
	joyCaptionPopoverContent?: string;
	/** 是否把触发词输出到打标文件中 */
	outputTriggerWordsLabel?: string;
	outputTriggerWordsProp?: string;
	outputTriggerWordsPopoverContent?: string;
	/** 打标按钮 */
	taggerBtnText?: string;
	taggerBtnLoading?: boolean;
	taggerBtnDisabled?: boolean;
}

const props = withDefaults(defineProps<DatasetProps>(), {
	datasetPathLabel: "数据集目录",
	datasetPathPlaceholder: "请选择训练用的数据集目录",
	taggerModelLabel: "打标模型",
	taggerModelPlaceholder: "请选择打标模型",
	joyCaptionLabel: "Joy Caption 提示词类型",
	joyCaptionPlaceholder: "请选择Joy Caption 提示词类型",
	outputTriggerWordsLabel: "是否把触发词输出到打标文件中",
	taggerBtnText: "一键打标",
	taggerBtnLoading: false,
	taggerBtnDisabled: false
});
const emits = defineEmits<{
	taggerClick: [];
}>();

const datasetPath = defineModel("datasetPath", { type: String, required: true });
const taggerModel = defineModel("taggerModel", { type: String, required: true });
const joyCaptionPromptType = defineModel("joyCaptionPromptType", { type: String, required: true });
const outputTriggerWords = defineModel("outputTriggerWords", { type: Boolean, required: true });

const trainingStore = useTrainingStore();

const taggerDisabled = computed(() => {
	return trainingStore.useGPU || props.taggerBtnDisabled;
});
</script>

<style lang="scss" scoped>
.dataset-head {
	display: flex;
}
.dataset-head-left {
	flex-grow: 1;
	min-width: 0;
}
.dataset-head-btn {
	margin-left: 16px;
	min-width: 120px;
	height: 140px;
	align-self: center;
}
</style>
