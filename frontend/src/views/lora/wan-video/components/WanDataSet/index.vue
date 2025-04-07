<!--
 * @Author: mulingyuer
 * @Date: 2025-03-31 10:37:56
 * @LastEditTime: 2025-04-07 10:56:15
 * @LastEditors: mulingyuer
 * @Description: wan AI数据集
 * @FilePath: \frontend\src\views\lora\wan-video\components\WanDataSet\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem label="训练的数据模式" prop="data_mode" popover-content="data_mode">
		<el-radio-group v-model="ruleForm.data_mode" @change="onDataModeChange">
			<el-radio-button label="图片训练" value="image" />
			<el-radio-button label="视频训练" value="video" />
		</el-radio-group>
	</PopoverFormItem>
	<ImageDataSet v-if="isImageTraining" v-model:form="ruleForm" />
	<VideoDataSet v-else v-model:form="ruleForm" />
</template>

<script setup lang="ts">
import type { ElRadioGroup } from "element-plus";
import type { RuleForm } from "../../types";
import ImageDataSet from "./ImageDataSet.vue";
import VideoDataSet from "./VideoDataSet.vue";

type RadioGroup = InstanceType<typeof ElRadioGroup>;

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
/** 是否图片训练 */
const isImageTraining = computed(() => ruleForm.value.data_mode === "image");

const onDataModeChange: RadioGroup["onChange"] = (value) => {
	if (value === "video") {
		ruleForm.value.config.sage_attn = true;
	}
};
</script>

<style scoped></style>
