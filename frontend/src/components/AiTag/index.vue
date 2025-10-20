<!--
 * @Author: mulingyuer
 * @Date: 2025-09-02 15:46:18
 * @LastEditTime: 2025-10-13 14:43:51
 * @LastEditors: mulingyuer
 * @Description: ai打标
 * @FilePath: \frontend\src\components\AiTag\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-button
		class="ai-tag-btn"
		:type="showDrawer ? 'danger' : hasTag ? 'warning' : 'primary'"
		round
		:plain="showDrawer"
		@click="onToggleDrawer"
	>
		<Icon v-if="!showDrawer" class="ai-tag-btn-icon" name="ri-price-tag-3-fill" />
		{{ showDrawer ? "关闭打标配置" : hasTag ? "正在打标，点击查看打标配置" : "打标" }}
	</el-button>
	<el-drawer
		class="ai-tag-drawer"
		modal-class="ai-tag-drawer-modal"
		v-model="showDrawer"
		title="打标配置"
		direction="rtl"
		:modal="false"
		:close-on-click-modal="false"
		:lock-scroll="false"
		append-to-body
		size="650px"
	>
		<el-form
			ref="ruleFormRef"
			:model="ruleForm"
			:rules="rules"
			label-width="auto"
			label-position="top"
			size="large"
		>
			<PopoverFormItem label="打标目录" prop="image_path" popover-content="image_path">
				<FolderSelector v-model="ruleForm.image_path" placeholder="请选择打标目录" />
			</PopoverFormItem>
			<PopoverFormItem label="打标模型" prop="model_name" popover-content="model_name">
				<ModelSelect v-model="ruleForm.model_name" />
			</PopoverFormItem>
			<PopoverFormItem
				v-show="isJoy2"
				label="Joy Caption 提示词类型"
				prop="prompt_type"
				popover-content="prompt_type"
			>
				<JoyCaptionPromptTypeSelect v-model="ruleForm.prompt_type" />
			</PopoverFormItem>
			<PopoverFormItem
				label="原样输出到打标文件的文本内容"
				prop="class_token"
				popover-content="class_token"
			>
				<el-input
					v-model="ruleForm.class_token"
					:rows="6"
					type="textarea"
					placeholder="请输入原样输出到打标文件的文本内容"
				/>
				<div v-if="showGetTriggerWordsBtn" class="class-token-footer">
					<el-button class="class-token-btn" type="primary" @click="onGetTriggerWords">
						一键获取触发词
					</el-button>
				</div>
			</PopoverFormItem>
			<el-collapse v-model="ruleForm.advanced_setting" class="ai-tag-advanced-setting">
				<el-collapse-item title="高级设置" name="advanced_setting">
					<PopoverFormItem
						v-show="isJoy2"
						label="提示词"
						prop="global_prompt"
						popover-content="global_prompt"
					>
						<el-input
							v-model="ruleForm.global_prompt"
							:rows="6"
							type="textarea"
							placeholder="请输入打标模型所使用的提示词"
						/>
					</PopoverFormItem>
					<PopoverFormItem label="追加模式" prop="is_append" popover-content="is_append">
						<el-switch v-model="ruleForm.is_append" />
					</PopoverFormItem>
					<PopoverFormItem>
						<el-alert
							title="说明：如果之前已经打过标，则在原文本内容后追加打标结果；否则，则直接替换打标结果。"
							:closable="false"
						></el-alert>
					</PopoverFormItem>
				</el-collapse-item>
			</el-collapse>
		</el-form>
		<template #footer>
			<el-space :size="12">
				<el-button @click="showDrawer = false"> 取消 </el-button>
				<el-button type="primary" :loading="loading" :disabled="disabled" @click="onConfirm">
					{{ submitBtnText }}
				</el-button>
			</el-space>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import JoyCaptionPromptTypeSelect from "@/components/Form/DataSet-v3/JoyCaptionPromptTypeSelect.vue";
import ModelSelect from "@/components/Form/DataSet-v3/ModelSelect.vue";
import { useTag } from "@/hooks/task/useTag";
import { useTrainingStore } from "@/stores";
import { DatasetValidator, LoRAValidator } from "@/utils/lora/validator";
import type { FormInstance, FormRules } from "element-plus";
import type { AiTagRuleForm } from "./types";

export type AiTagProps = {
	/** 是否显示获取触发词按钮 */
	showGetTriggerWordsBtn?: boolean;
	/** 获取触发词回调 */
	getTriggerWords?: () => string;
	/** 打开drawer之前的回调，用于做一个特殊的处理 */
	beforeOpen?: () => void;
};

const trainingStore = useTrainingStore();
const { tagMonitor, tag, isJoyCaption2Model } = useTag();

const props = withDefaults(defineProps<AiTagProps>(), {
	showGetTriggerWordsBtn: false
});

const loading = ref(false);
const disabled = computed(() => trainingStore.useGPU);
const showDrawer = ref(false);
const ruleFormRef = useTemplateRef<FormInstance>("ruleFormRef");
const ruleForm = defineModel<AiTagRuleForm>({ required: true });
const rules = ref<FormRules<AiTagRuleForm>>({
	image_path: [
		{
			required: true,
			validator: (_rule, value, callback) => {
				if (typeof value !== "string" || value.trim() === "") {
					return callback(new Error("请选择打标目录"));
				}

				callback();
			},
			trigger: "change"
		},
		{
			trigger: "change",
			validator: (_rule, value, callback) => {
				DatasetValidator.validateDirectory({ path: value }).then(({ valid }) => {
					if (!valid) {
						callback(new Error("打标目录不存在"));
						return;
					}

					callback();
				});
			}
		}
	],
	model_name: [{ required: true, message: "请选择打标模型", trigger: "change" }],
	prompt_type: [
		{
			validator: (_rule, value, callback) => {
				const { model_name } = ruleForm.value;
				if (!isJoyCaption2Model(model_name)) return callback();

				if (typeof value !== "string" || value.trim() === "") {
					return callback(new Error("请选择提示词类型"));
				}

				return callback();
			},
			trigger: "change"
		}
	]
});
const isJoy2 = computed(() => isJoyCaption2Model(ruleForm.value.model_name));
const hasTag = computed(() => trainingStore.currentTaskInfo.type === "tag");
const submitBtnText = computed(() => {
	const type = trainingStore.currentTaskInfo.type;
	if (type === "tag") return "正在打标";
	if (type === "none") return "确认";

	return "正在训练，无法进行打标";
});

function onToggleDrawer() {
	const value = !showDrawer.value;
	if (value) {
		if (typeof props.beforeOpen === "function") {
			props.beforeOpen();
		}
	}
	showDrawer.value = value;
}

// 获取触发词
function onGetTriggerWords() {
	if (!props.showGetTriggerWordsBtn) return;
	if (typeof props.getTriggerWords !== "function") {
		ElMessage.error("请传入获取触发词回调");
		return;
	}

	ruleForm.value.class_token = props.getTriggerWords();
}

// 确认
async function onConfirm() {
	try {
		if (!ruleFormRef.value) return;
		loading.value = true;
		const validateResult = await LoRAValidator.validateForm(ruleFormRef.value, {
			shouldShowErrorDialog: true
		});
		if (!validateResult.valid) {
			loading.value = false;
			return;
		}

		// api
		const result = await tag({
			...ruleForm.value,
			showTaskStartPrompt: true
		});

		// 触发查询打标任务
		tagMonitor.setTaskId(result.task_id).start();

		showDrawer.value = false;
		loading.value = false;
	} catch (error) {
		loading.value = false;
		tagMonitor.stop();

		console.error("打标任务创建失败", error);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";

.ai-tag-btn {
	width: 100%;
}
.ai-tag-btn-icon {
	margin-right: 6px;
}
.class-token-footer {
	width: 100%;
	margin-top: math.div($zl-padding, 2);
	text-align: right;
}
.ai-tag-advanced-setting {
	margin-bottom: 24px;
}
.ai-tag-advanced-setting :deep(.el-collapse-item__content) {
	padding-left: $zl-padding;
	padding-right: $zl-padding;
}
</style>
<style lang="scss">
.ai-tag-drawer-modal {
	width: 650px;
	inset: 0 0 0 auto !important;
	.el-splitter-panel {
		padding-left: 50px;
		overflow-x: hidden;
	}
	.ai-tag-drawer {
		border-top-left-radius: $zl-border-radius;
		border-bottom-left-radius: $zl-border-radius;
	}
}
</style>
