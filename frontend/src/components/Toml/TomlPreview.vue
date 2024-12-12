<!--
 * @Author: mulingyuer
 * @Date: 2024-12-10 14:46:06
 * @LastEditTime: 2024-12-12 16:51:42
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
import githubLightTheme from "shiki/themes/github-light.mjs";
import githubDarkTheme from "shiki/themes/github-dark.mjs";
import tomlLang from "shiki/langs/toml.mjs";
import { useAppStore } from "@/stores";

export interface TomlPreviewProps {
	toml: string;
}

const props = defineProps<TomlPreviewProps>();
const appStore = useAppStore();

const isDark = storeToRefs(appStore).isDark;
const highlighter = ref<Highlighter>();
const tomlHtml = ref("");

async function init() {
	highlighter.value = await createHighlighter({
		themes: [githubLightTheme, githubDarkTheme],
		langs: [tomlLang]
	});
}

watch(
	[() => props.toml, isDark],
	async () => {
		if (!highlighter.value) {
			await init();
		}
		tomlHtml.value = highlighter.value!.codeToHtml(props.toml, {
			lang: "toml",
			theme: isDark.value ? "github-dark" : "github-light"
		});
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.toml-preview-content {
	:deep(.shiki) {
		font-size: 14px;
		line-height: 1.5;
		min-height: 4em;
		white-space: pre;
		border-width: 1px;
		border-color: #9ca3af4d;
		border-radius: 0.25rem;
		background-color: var(--zl-toml-preview-bg) !important;
	}
}
</style>
