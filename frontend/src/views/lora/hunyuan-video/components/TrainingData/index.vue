<!--
 * @Author: mulingyuer
 * @Date: 2025-01-06 15:29:03
 * @LastEditTime: 2025-09-04 09:15:56
 * @LastEditors: mulingyuer
 * @Description: 训练数据
 * @FilePath: \frontend\src\views\lora\hunyuan-video\components\TrainingData\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="数据集重复训练次数"
		prop="dataset.directory.0.num_repeats"
		popover-content="num_repeats"
	>
		<el-input-number
			v-model.number="ruleForm.dataset.directory[0].num_repeats"
			:step="1"
			step-strictly
		/>
	</PopoverFormItem>
	<PopoverFormItem label="训练轮次" prop="config.epochs" popover-content="epochs">
		<el-input-number v-model.number="ruleForm.config.epochs" :step="1" step-strictly :min="1" />
	</PopoverFormItem>
	<el-row :gutter="16">
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-宽度px"
				prop="dataset.directory.0.resolutions.0"
				popover-content="resolutions"
				class="resolution-width"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.directory[0].resolutions[0]"
					:controls="false"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem
				label="图片尺寸-高度px"
				prop="dataset.directory.0.resolutions.1"
				popover-content="resolutions"
				class="resolution-height"
			>
				<el-input-number
					v-model.number="ruleForm.dataset.directory[0].resolutions[1]"
					:controls="false"
				/>
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<el-alert
				class="training-data-alert"
				title="24g显存最大只能跑 512*512 分辨率的图片"
				type="warning"
				:closable="false"
				show-icon
				effect="dark"
			/>
		</el-col>
	</el-row>
	<el-row v-show="isExpert" :gutter="16">
		<el-col :span="24">
			<PopoverFormItem
				label="启用长宽比分桶"
				prop="dataset.enable_ar_bucket"
				popover-content="enable_ar_bucket"
			>
				<el-switch v-model="ruleForm.dataset.enable_ar_bucket" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="最小长宽比" prop="dataset.min_ar" popover-content="min_ar">
				<el-input-number v-model.number="ruleForm.dataset.min_ar" :step="0.1" :min="0" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="12">
			<PopoverFormItem label="最大长宽比" prop="dataset.max_ar" popover-content="max_ar">
				<el-input-number v-model.number="ruleForm.dataset.max_ar" :step="0.1" :min="0" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="长宽比桶的总数"
				prop="dataset.num_ar_buckets"
				popover-content="num_ar_buckets"
			>
				<el-input-number v-model.number="ruleForm.dataset.num_ar_buckets" :step="1" :min="1" />
			</PopoverFormItem>
		</el-col>
		<el-col :span="24">
			<PopoverFormItem
				label="帧桶配置。示例：1, 33, 65"
				prop="dataset.directory.0.frame_buckets"
				popover-content="target_frames"
			>
				<div class="frame-buckets-item">
					<el-input class="frame-buckets-input" :model-value="frameBucketsString">
						<template #prepend>预览</template>
					</el-input>
				</div>
				<div
					v-for="item in ruleForm.dataset.directory[0].frame_buckets"
					:key="item.key"
					class="frame-buckets-item"
				>
					<el-input-number v-model.number="item.value" :step="1" step-strictly :min="1" />
					<el-button
						class="frame-buckets-item-delete"
						:icon="RiDeleteBin_7Line"
						@click="onDeleteFrameBuckets(item)"
					/>
				</div>
				<div class="frame-buckets-item">
					<el-button
						class="frame-buckets-item-add"
						type="primary"
						:icon="RiAddCircleLine"
						@click="onAddFrameBuckets"
					>
						新增提取帧数
					</el-button>
				</div>
			</PopoverFormItem>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import type { RuleForm } from "../../types";
import { useIcon } from "@/hooks/useIcon";
import { generateUUID } from "@/utils/tools";

type FrameBucketsItem = RuleForm["dataset"]["directory"][number]["frame_buckets"][number];

//icon
const RiDeleteBin_7Line = useIcon({ name: "ri-delete-bin-7-line" });
const RiAddCircleLine = useIcon({ name: "ri-add-circle-line" });

// store
const settingsStore = useSettingsStore();

const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });

/** 是否专家模式 */
const isExpert = computed(() => settingsStore.isExpert);
/** 预览frame_buckets */
const frameBucketsString = computed(() => {
	const target_frames = ruleForm.value.dataset.directory[0].frame_buckets;
	return target_frames.map((item) => item.value).join(",");
});
function onDeleteFrameBuckets(itemData: FrameBucketsItem) {
	const { key } = itemData;
	const frame_buckets = ruleForm.value.dataset.directory[0].frame_buckets;
	const findIndex = frame_buckets.findIndex((item) => item.key === key);
	if (findIndex !== -1) {
		frame_buckets.splice(findIndex, 1);
	}
}
function onAddFrameBuckets() {
	const frame_buckets = ruleForm.value.dataset.directory[0].frame_buckets;
	frame_buckets.push({
		key: generateUUID(),
		value: void 0
	});
}
</script>

<style lang="scss" scoped>
.resolution-width,
.resolution-height {
	margin-bottom: 12px;
}
.training-data-alert {
	margin-bottom: 22px;
}
.frame-buckets-item {
	display: block;
	width: 100%;
	& + & {
		margin-top: 10px;
	}
}
.frame-buckets-input {
	:deep(.el-input-group__prepend) {
		color: var(--el-text-color-regular);
	}
}
.frame-buckets-item-delete {
	margin-left: $zl-padding;
}
</style>
