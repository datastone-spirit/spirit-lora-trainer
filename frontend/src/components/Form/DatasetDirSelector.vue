<!--
 * @Author: mulingyuer
 * @Date: 2024-12-06 10:40:26
 * @LastEditTime: 2024-12-09 09:54:32
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
			<el-form-item :label="taggerLabel" :prop="taggerProp">
				<el-select v-model="taggerModel" :placeholder="taggerPlaceholder">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
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
export interface DatasetDirSelectorProps {
	dirLabel?: string;
	dirProp?: string;
	dirPopoverContent: string;
	dirPlaceholder?: string;
	taggerLabel?: string;
	taggerProp?: string;
	taggerPopoverContent?: string;
	taggerPlaceholder?: string;
	btnText?: string;
}

withDefaults(defineProps<DatasetDirSelectorProps>(), {
	dirLabel: "数据集目录",
	dirPlaceholder: "请选择训练用的数据集目录",
	taggerLabel: "打标模型",
	taggerPlaceholder: "请选择打标模型",
	showBtn: true,
	btnText: "一键打标"
});

const dir = defineModel("dir", { type: String, required: true });
const taggerModel = ref("florence");

const options = ref([
	{ label: "Joy Caption2", value: "joy_caption2" },
	{ label: "Florence", value: "florence" }
]);

const loading = ref(false);
function onBtnClick() {
	if (typeof dir.value !== "string" || dir.value.trim() === "") {
		ElMessage({
			message: "请先选择训练用的数据集目录",
			type: "warning"
		});
		return;
	}

	if (typeof taggerModel.value !== "string" || taggerModel.value.trim() === "") {
		ElMessage({
			message: "请先选择打标模型",
			type: "warning"
		});
		return;
	}

	loading.value = true;
	setTimeout(() => {
		loading.value = false;
		ElMessage({
			message: "一键打标成功",
			type: "success"
		});
	}, 2000);
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
