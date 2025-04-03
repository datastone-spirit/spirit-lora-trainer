<!--
 * @Author: mulingyuer
 * @Date: 2025-03-31 10:42:26
 * @LastEditTime: 2025-04-03 14:55:31
 * @LastEditors: mulingyuer
 * @Description: 视频数据集
 * @FilePath: \frontend\src\views\lora\wan-video\components\WanDataSet\VideoDataSet.vue
 * 怎么可能会有bug！！！
-->
<template>
	<PopoverFormItem
		label="视频目录"
		prop="dataset.datasets.0.video_directory"
		popover-content="video_directory"
	>
		<FolderSelector
			v-model="ruleForm.dataset.datasets[0].video_directory"
			placeholder="请选择视频目录"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="提取首帧方式"
		prop="dataset.datasets.0.frame_extraction"
		popover-content="frame_extraction"
	>
		<el-input v-show="false" :model-value="ruleForm.dataset.datasets[0].frame_extraction">
		</el-input>
		<el-space>
			<el-button
				v-for="(item, index) in frameExtractionOptions"
				:key="index"
				:type="item.value === ruleForm.dataset.datasets[0].frame_extraction ? 'primary' : ''"
				@click="onFrameExtractionChange(item.value)"
			>
				{{ item.value }}
			</el-button>
		</el-space>
	</PopoverFormItem>
	<el-form-item>
		<div class="frame-extraction-explain">
			<div class="frame-extraction-explain-title">{{ currentFrameExtractionExplain.title }}</div>
			<div class="frame-extraction-explain-code">
				<div class="frame-extraction-explain-code-title">代码示例：</div>
				<div>{{ currentFrameExtractionExplain.code }}</div>
			</div>
			<div
				class="frame-extraction-explain-content"
				v-html="currentFrameExtractionExplain.content"
			></div>
		</div>
	</el-form-item>
	<PopoverFormItem
		label="指定了从视频中提取的帧的数量"
		prop="dataset.datasets.0.target_frames"
		popover-content="target_frames"
	>
		<div class="target-frames-item">
			<el-input class="target-frames-input" :model-value="targetFramesString">
				<template #prepend>预览</template>
			</el-input>
		</div>
		<div
			v-for="item in ruleForm.dataset.datasets[0].target_frames"
			:key="item.key"
			class="target-frames-item"
		>
			<el-input-number v-model.number="item.value" :step="1" step-strictly :min="1" :max="129" />
			<el-button
				class="target-frames-item-delete"
				:icon="RiDeleteBin_7Line"
				@click="onDeleteTargetFrames(item)"
			/>
		</div>
		<div class="target-frames-item">
			<el-button
				class="target-frames-item-add"
				type="primary"
				:icon="RiAddCircleLine"
				@click="onAddTargetFrames"
			>
				新增提取帧数
			</el-button>
		</div>
	</PopoverFormItem>
	<PopoverFormItem
		label="提取帧时的步长，仅在 frame_extraction 为 slide 时有效"
		prop="dataset.datasets.0.frame_stride"
		popover-content="frame_stride"
	>
		<el-input-number
			v-model.number="ruleForm.dataset.datasets[0].frame_stride"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<PopoverFormItem
		label="从视频中均匀提取的样本数量，仅在 frame_extraction 为 uniform 时有效"
		prop="dataset.datasets.0.frame_sample"
		popover-content="frame_sample"
	>
		<el-input-number
			v-model.number="ruleForm.dataset.datasets[0].frame_sample"
			:step="1"
			step-strictly
			:min="1"
		/>
	</PopoverFormItem>
	<el-form-item class="no-mb">
		<el-button
			class="video-dataset-calc-button"
			type="primary"
			:loading="calcLoading"
			round
			@click="onGetCalcVideoImageCount"
		>
			<Icon class="video-dataset-calc-button-icon" name="ri-calculator-line" />
			预估训练集图片数量：{{ calcVideoImageCount }}
		</el-button>
	</el-form-item>
</template>

<script setup lang="ts">
import type { RuleForm } from "../../types";
import { useIcon } from "@/hooks/useIcon";
import { generateUUID } from "@/utils/tools";
import { wanVideoTrainingImageDatasetCount } from "@/api/lora";
import { WanHelper } from "../../wan.helper";

export type FrameExtractionExplain = Array<{
	id: string;
	title: string;
	code: string;
	content: string;
}>;

type TargetFramesItem = RuleForm["dataset"]["datasets"][number]["target_frames"][number];

const wanHelper = new WanHelper();
const RiDeleteBin_7Line = useIcon({ name: "ri-delete-bin-7-line" });
const RiAddCircleLine = useIcon({ name: "ri-add-circle-line" });
const ruleForm = defineModel("form", { type: Object as PropType<RuleForm>, required: true });
/** 提取首帧方式 */
const frameExtractionOptions = ref<ElOptions>([
	{
		label: "head：从视频的开头提取前 N 帧",
		value: "head"
	},
	{
		label: "chunk：将视频分成 N 帧的块，然后提取帧",
		value: "chunk"
	},
	{
		label: "slide：以 frame_stride 为步长，从视频中提取 N 帧",
		value: "slide"
	},
	{
		label: "uniform：从视频中均匀地提取 frame_sample 个 N 帧",
		value: "uniform"
	}
]);
/** 提取帧的解释 */
const frameExtractionExplain = ref<FrameExtractionExplain>([
	{
		id: "head",
		title: "从视频的开头提取前 N 帧",
		code: "frame_extraction=head;	target_frames=[1, 13, 25];",
		content: `<div>表示所有切片取帧都是从视频开头开始，只取一次，1表示取第一帧为一个切片，13表示1-13帧的切片，25表示1-25帧切片。</div>`
	},
	{
		id: "chunk",
		title: "将视频分成 N 帧的块，然后提取帧",
		code: "frame_extraction=chunk; target_frames=[13,25];",
		content: `<div>视频切片根据设置的帧数循环取帧，比如这里设置了两个：13、25，那么就会分两种取帧的循环，第一种是从视频开头开始，每13帧截取成一次切片，无限循环，直到最大帧，不足13帧舍弃，第二种就是从视频开头开始每25帧取成一次切片，以此类推。</div><div class="frame-extraction-explain-warning">所以chunk不要设置1这个值，这会将所有帧都提取了。</div>`
	},
	{
		id: "slide",
		title: "以 frame_stride 为步长，从视频中提取 N 帧",
		code: "frame_extraction=slide;	target_frames=[1, 13, 25];	frame_stride=10;",
		content:
			"<div>以frame_stride的值为取帧间隔，从0开始乘递增倍率（0-N），根据配置的值分别进行切片处理，比如上面的1，10*0得0 ，提取从0开始的1帧，10*1得10，取从10开始的1帧，然后10*2得20，依次类推，当乘以的倍率得到的起始位置不足提取时，切换到下13的配置，重复以上步骤。</div>"
	},
	{
		id: "uniform",
		title: "从视频中均匀地提取 frame_sample 个 N 帧",
		code: "frame_extraction=uniform; target_frames=[1, 13, 25]; frame_sample=4;",
		content:
			"<div>frame_sample表示每次帧提取的切片次数，这里是4次，假设总帧为40帧，每次提取都会从开头提取一次，以设置的1帧为例，开头取了1帧后还剩39帧，且用了1次切片次数，剩余3次切片，用39除以3得到均分的向下取整值13，每13帧间隔取一帧，取3次，然后切换到下一个提取配置：13，开头取13帧为1个切片，剩余的除以3得到均分的向下取整值9，间隔9取13帧的切片取3次，依次类推。</div>"
	}
]);
/** 当前提取帧的解释 */
const currentFrameExtractionExplain = computed(() => {
	const item = frameExtractionExplain.value.find(
		(item) => item.id === ruleForm.value.dataset.datasets[0].frame_extraction
	) ?? {
		id: "",
		code: "",
		title: "",
		content: ""
	};
	return item;
});
/** 切换提取帧方式 */
function onFrameExtractionChange(value: ElOptions[number]["value"]) {
	ruleForm.value.dataset.datasets[0].frame_extraction = value as string;
}

const targetFramesString = computed(() => {
	const target_frames = ruleForm.value.dataset.datasets[0].target_frames;
	return `[${target_frames.map((item) => item.value).toString()}]`;
});
/** 删除提取帧 */
function onDeleteTargetFrames(item: TargetFramesItem) {
	const { key } = item;
	const target_frames = ruleForm.value.dataset.datasets[0].target_frames;
	const findIndex = target_frames.findIndex((item) => item.key === key);
	if (findIndex !== -1) {
		target_frames.splice(findIndex, 1);
	}
}
/** 新增提取帧 */
function onAddTargetFrames() {
	const target_frames = ruleForm.value.dataset.datasets[0].target_frames;
	target_frames.push({
		key: generateUUID(),
		value: undefined
	});
}

/** 预估图片数量 */
const calcLoading = ref(false);
const calcVideoImageCount = ref<string | number>("??");
function onGetCalcVideoImageCount() {
	calcLoading.value = true;
	wanVideoTrainingImageDatasetCount(wanHelper.formatImagesCountEstimate(ruleForm.value))
		.then((res) => {
			calcVideoImageCount.value = res.total_image;
		})
		.catch((_error) => {
			calcVideoImageCount.value = "计算失败，请检查输入参数";
		})
		.finally(() => {
			calcLoading.value = false;
		});
}
</script>

<style lang="scss" scoped>
@use "sass:math";

.frame-extraction-explain {
	background-color: var(--zl-frame-extraction-explain-bg);
	border-radius: math.div($zl-border-radius, 2);
	padding: $zl-padding;
	font-size: 14px;
	color: var(--el-text-color-secondary);
	line-height: 1.5;
}
.frame-extraction-explain-title {
	color: var(--zl-popover-form-item-color);
}
.frame-extraction-explain-title,
.frame-extraction-explain-code-title,
.frame-extraction-explain-code {
	margin-bottom: 10px;
}
.frame-extraction-explain-content :deep(div + div) {
	margin-top: 10px;
}
.frame-extraction-explain-content :deep(.frame-extraction-explain-warning) {
	color: var(--el-color-primary);
}
.target-frames-item {
	display: block;
	width: 100%;
	& + & {
		margin-top: 10px;
	}
}
.target-frames-input {
	:deep(.el-input-group__prepend) {
		color: var(--el-text-color-regular);
	}
}
.target-frames-item-delete {
	margin-left: $zl-padding;
}
.el-form-item.no-mb {
	margin-bottom: 0;
}
.video-dataset-calc-button {
	width: 100%;
}
.video-dataset-calc-button-icon {
	margin-right: 6px;
}
</style>
