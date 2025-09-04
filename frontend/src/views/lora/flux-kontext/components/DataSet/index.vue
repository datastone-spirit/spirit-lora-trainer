<!--
 * @Author: mulingyuer
 * @Date: 2025-07-23 09:41:55
 * @LastEditTime: 2025-09-04 10:22:58
 * @LastEditors: mulingyuer
 * @Description: 数据集
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\DataSet\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="data-set">
		<div class="data-set-content">
			<Tabs v-model="ruleForm.activeDatasetId" v-model:form="ruleForm" />
		</div>
		<div class="data-set-footer">
			<el-form-item>
				<AiTag
					v-model="ruleForm.aiTagRuleForm"
					show-get-trigger-words-btn
					:get-trigger-words="() => ruleForm.trigger_word"
				></AiTag>
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
		</div>
	</div>
</template>

<script setup lang="ts">
import AiTag from "@/components/AiTag/index.vue";
import { useSettingsStore } from "@/stores";
import { getEnv } from "@/utils/env";
import type { RuleForm } from "../../types";
import Tabs from "./Tabs.vue";

const settingsStore = useSettingsStore();
const env = getEnv();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
watchEffect(() => {
	const datasets = ruleForm.value.datasets;
	const activeDatasetId = ruleForm.value.activeDatasetId;
	const findItem = datasets.find((item) => item.id === activeDatasetId);

	if (findItem) {
		ruleForm.value.aiTagRuleForm.image_path = findItem.folder_path;
	} else {
		ruleForm.value.aiTagRuleForm.image_path = settingsStore.whiteCheck
			? env.VITE_APP_LORA_OUTPUT_PARENT_PATH
			: "";
	}
});
</script>

<style lang="scss" scoped>
.data-set {
	width: 100%;
}
.data-set-content {
	margin-bottom: 22px;
}
.data-set-tabs {
	margin-bottom: 22px;
	:deep(.el-tabs__header.is-top) {
		height: 40px;
		@include no-select();
	}
	:deep(.el-tabs__new-tab) {
		height: 100%;
		min-width: 32px;
		margin: 0;
		border: none;
		background-color: var(--el-color-primary);
		border-radius: 0;
		color: var(--el-color-white);
		&:hover {
			background-color: var(--el-color-primary-light-3);
		}
		&:active {
			opacity: 0.7;
		}
	}
	:deep(.el-tabs__nav-wrap.is-scrollable) {
		padding: 0 25px;
	}
	:deep(.el-tabs__nav-prev),
	:deep(.el-tabs__nav-next) {
		line-height: 40px;
		width: 25px;
		&:not(.is-disabled) {
			color: var(--el-color-info-light-3);
			&:hover {
				color: var(--el-color-info);
			}
		}
	}
}
.data-set-alert {
	margin-bottom: 0;
}
</style>
