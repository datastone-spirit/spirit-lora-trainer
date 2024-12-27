<!--
 * @Author: mulingyuer
 * @Date: 2024-12-13 11:24:17
 * @LastEditTime: 2024-12-27 10:38:39
 * @LastEditors: mulingyuer
 * @Description: 标签编辑器
 * @FilePath: \frontend\src\components\AiDataset\TagEdit.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="tag-edit" :class="{ focus: isFocus }">
		<el-input
			ref="tagEditInputRef"
			class="tag-edit-input"
			v-model="value"
			type="textarea"
			placeholder="请输入标签，多个标签用英文逗号分隔"
			resize="none"
			:disabled="loading"
			@focus="onFocus"
			@blur="onBlur"
		/>
		<div class="tag-edit-footer">
			<div class="tag-edit-footer-left">
				<span class="tag-edit-tips"> <span>Ctrl</span> + <span>S</span> 可以快捷保存</span>
			</div>
			<div class="tag-edit-footer-right">
				<el-button type="primary" :loading="loading" @click="emits('save')">保存</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { InputInstance } from "element-plus";

export interface TagEditProps {
	loading?: boolean;
}

withDefaults(defineProps<TagEditProps>(), {
	loading: false
});
const emits = defineEmits<{
	save: [];
}>();
const value = defineModel({ type: String, required: true });

const tagEditInputRef = ref<InputInstance>();
const isFocus = ref(false);
function onFocus() {
	isFocus.value = true;
}
function onBlur() {
	isFocus.value = false;
}

// 监听ctrl+s快捷键
useEventListener(window, "keydown", (event) => {
	const isSaveEvent = event.ctrlKey && event.key === "s";
	if (isSaveEvent && isFocus.value) {
		event.preventDefault(); // 阻止默认的保存行为
		emits("save");
	}
});

// 对外暴露的方法
defineExpose({
	/** 获取焦点 */
	focus: () => {
		if (tagEditInputRef.value) tagEditInputRef.value.focus();
	},
	/** 失去焦点 */
	blur: () => {
		if (tagEditInputRef.value) tagEditInputRef.value.blur();
	}
});
</script>

<style lang="scss" scoped>
.tag-edit {
	height: 100%;
	min-height: 100px;
	position: relative;
	box-shadow: 0 0 0 1px var(--el-border-color) inset;
	background-color: var(--el-fill-color-blank);
	border-radius: $zl-border-radius;
	transition: var(--el-transition-box-shadow);
	&.focus {
		box-shadow: 0 0 0 1px var(--el-color-primary) inset;
	}
}
.tag-edit-input {
	height: 100%;
	padding-bottom: 47px;
	:deep(.el-textarea__inner) {
		height: 100%;
		border: none;
		box-shadow: none;
		background-color: transparent;
	}
}
.tag-edit-footer {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	padding: 5px 11px;
}
.tag-edit-footer-left {
	margin-right: $zl-padding;
	white-space: nowrap;
}
.tag-edit-tips {
	font-size: 12px;
	color: var(--el-color-info);
}
.tag-edit-footer-right {
	margin-left: auto;
}
</style>
