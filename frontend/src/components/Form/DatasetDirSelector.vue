<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 10:40:26
 * @LastEditTime: 2024-12-19 17:34:09
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
			/>
		</div>
		<div class="dataset-dir-selector-right">
			<el-button
				class="train-data-dir-selector-btn"
				type="primary"
				:loading="loading"
				@click="onBtnClick"
			>
				{{ btnText }}
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import TaggerModelSelect from "./TaggerModelSelect.vue";
import type { TaggerModelSelectProps } from "./TaggerModelSelect.vue";
import { batchTag } from "@/api/tag";
import { checkDirectory } from "@/utils/lora.helper";

export interface DatasetDirSelectorProps {
	dirLabel?: string;
	dirProp?: string;
	dirPopoverContent: string;
	dirPlaceholder?: string;
	taggerLabel?: TaggerModelSelectProps["label"];
	taggerProp?: TaggerModelSelectProps["prop"];
	taggerPlaceholder?: TaggerModelSelectProps["placeholder"];
	btnText?: string;
	/** 打标开始的回调 */
	taggerStart?: () => void;
	/** 打标结束的回调 */
	taggerEnd?: () => void;
}

const props = withDefaults(defineProps<DatasetDirSelectorProps>(), {
	dirLabel: "数据集目录",
	dirPlaceholder: "请选择训练用的数据集目录",
	showBtn: true,
	btnText: "一键打标"
});

const dir = defineModel("dir", { type: String, required: true });
const taggerModel = defineModel("taggerModel", { type: String, required: true });

const loading = ref(false);
async function validate() {
	try {
		if (typeof dir.value !== "string" || dir.value.trim() === "") {
			throw new Error("请先选择训练用的数据集目录");
		}
		const exists = await checkDirectory(dir.value);
		if (!exists) throw new Error("数据集目录不存在");

		if (typeof taggerModel.value !== "string" || taggerModel.value.trim() === "") {
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
async function onBtnClick() {
	try {
		const valid = await validate();
		if (!valid) return;
		loading.value = true;
		// 打标
		await batchTag({
			image_path: dir.value,
			model_name: taggerModel.value
		});
		loading.value = false;
		ElMessage({
			message: "一键打标成功",
			type: "success"
		});
	} catch (error) {
		console.log("打标失败", error);
	}
}
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
