<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 14:46:06
 * @LastEditTime: 2025-01-08 10:03:43
 * @LastEditors: mulingyuer
 * @Description: toml预览组件
 * @FilePath: \frontend\src\components\Toml\TomlPreview.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="toml-preview">
		<div class="toml-preview-content" v-html="tomlHtml"></div>
	</div>
</template>

<script setup lang="ts">
import { createHighlighter } from "shiki";
import type { Highlighter } from "shiki";
import { useAppStore } from "@/stores";

export interface TomlPreviewProps {
	toml: string;
}
const instance = getCurrentInstance();
const props = defineProps<TomlPreviewProps>();
const appStore = useAppStore();

const isDark = storeToRefs(appStore).isDark;
const highlighter = ref<Highlighter>();
const tomlHtml = ref("");
const isInitializing = ref(false);

/** 初始化 */
async function init() {
	try {
		isInitializing.value = true;
		highlighter.value = await createHighlighter({
			themes: ["github-light", "github-dark"],
			langs: ["toml"]
		});
		isInitializing.value = false;
		if (instance?.isUnmounted) highlighterDispose();

		highlighterToml();
	} catch (error) {
		isInitializing.value = false;
		console.error("初始化Toml预览失败:", error);
	}
}

/** 销毁 */
function highlighterDispose() {
	highlighter.value?.dispose();
	highlighter.value = void 0;
}

/** 生成高亮html */
function highlighterToml() {
	if (!highlighter.value) return;
	tomlHtml.value = highlighter.value.codeToHtml(props.toml, {
		lang: "toml",
		theme: isDark.value ? "github-dark" : "github-light"
	});
}

/** watch防抖 */
const watchFn = useDebounceFn(async () => {
	if (isInitializing.value) return;
	if (!highlighter.value) {
		await init();
		if (!highlighter.value) return; // Still no highlighter available
	}
	highlighterToml();
}, 300);
watch([() => props.toml, isDark], watchFn);

init();
onUnmounted(() => {
	highlighterDispose();
});
</script>

<style lang="scss" scoped>
.toml-preview {
	height: 100%;
	background-color: var(--zl-toml-preview-bg);
	border-radius: $zl-border-radius;
	padding: $zl-padding 0 $zl-padding $zl-padding;
}
.toml-preview-content {
	height: 100%;
	overflow: auto;
}
.toml-preview-content :deep(.shiki) {
	font-size: 14px;
	line-height: 1.5;
	min-height: 4em;
	white-space: pre;
	border-width: 1px;
	border-color: #9ca3af4d;
	border-radius: 0.25rem;
	background-color: var(--zl-toml-preview-code-bg) !important;
}
</style>
