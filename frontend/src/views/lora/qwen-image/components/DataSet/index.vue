<!--
 * @Author: mulingyuer
 * @Date: 2025-08-12 17:25:36
 * @LastEditTime: 2025-09-04 10:24:22
 * @LastEditors: mulingyuer
 * @Description: AI 数据集
 * @FilePath: \frontend\src\views\lora\qwen-image\components\DataSet\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-collapse class="data-set-collapse" v-model="activeNames" expand-icon-position="left">
		<el-collapse-item title="数据集公共配置" name="1">
			<General v-model:form="ruleForm" />
		</el-collapse-item>
		<el-collapse-item title="数据集" name="2">
			<Tabs v-model:form="ruleForm" v-model="ruleForm.activeDatasetId" />
		</el-collapse-item>
	</el-collapse>
	<el-form-item>
		<AiTag v-model="ruleForm.aiTagRuleForm"></AiTag>
	</el-form-item>
	<el-form-item class="data-set-alert">
		<el-alert
			class="no-select"
			title="注意：只会给当前选中的数据集进行打标，如果需要打标多个数据集，请一个一个操作。"
			type="warning"
			:closable="false"
			show-icon
			effect="dark"
		/>
	</el-form-item>
</template>

<script setup lang="ts">
import AiTag from "@/components/AiTag/index.vue";
import type { RuleForm } from "../../types";
import General from "./General.vue";
import Tabs from "./Tabs.vue";
import { useSettingsStore } from "@/stores";
import { getEnv } from "@/utils/env";

const settingsStore = useSettingsStore();
const env = getEnv();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
const activeNames = ref(["2"]);

watchEffect(() => {
	const datasets = ruleForm.value.dataset.datasets;
	const activeDatasetId = ruleForm.value.activeDatasetId;
	const findItem = datasets.find((item) => item.id === activeDatasetId);

	if (findItem) {
		ruleForm.value.aiTagRuleForm.image_path = findItem.image_directory;
	} else {
		ruleForm.value.aiTagRuleForm.image_path = settingsStore.whiteCheck
			? env.VITE_APP_LORA_OUTPUT_PARENT_PATH
			: "";
	}
});
</script>

<style lang="scss" scoped>
@use "sass:math";

.data-set-collapse {
	margin-bottom: 24px;
	:deep(.el-collapse-item__title) {
		font-size: 18px;
		font-weight: bold;
	}
	:deep(.el-collapse-item__content) {
		padding: math.div($zl-padding, 2) $zl-padding;
	}
}

.data-set-alert {
	margin-bottom: 0;
}
</style>
