<!--
 * @Author: mulingyuer
 * @Date: 2025-04-01 16:34:57
 * @LastEditTime: 2025-07-31 15:36:39
 * @LastEditors: mulingyuer
 * @Description: 视频预览组件
 * @FilePath: \frontend\src\components\Dialog\VideoPreviewDialog.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-dialog
		v-model="open"
		:title="videoPreviewModalData.title"
		width="600px"
		append-to-body
		destroy-on-close
		align-center
		@open="onHandleOpen"
		@closed="onHandleClosed"
	>
		<div v-if="videoPreviewModalData.src" class="video-container">
			<video
				ref="videoPlayerRef"
				class="video-player"
				:src="videoPreviewModalData.src"
				controls
				autoplay
				@loadedmetadata="onLoadedMetadata"
				@error="onVideoError"
			>
				您的浏览器不支持 HTML5 video 标签。
			</video>
		</div>
		<div v-else>无效的视频地址。</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { VideoPreviewModal } from "@/utils/modal-manager";

const videoPreviewModalData = VideoPreviewModal.state;
const videoPlayerRef = ref<HTMLVideoElement>();
const open = computed({
	get() {
		return videoPreviewModalData.value.open;
	},
	set(val) {
		videoPreviewModalData.value.open = val;
	}
});

/** 弹窗打开 */
function onHandleOpen() {
	nextTick(() => {
		if (videoPlayerRef.value) {
			videoPlayerRef.value.play();
		}
	});
}

/** 弹窗关闭后 */
function onHandleClosed() {
	// 暂停视频
	if (videoPlayerRef.value) {
		videoPlayerRef.value.pause();
		videoPlayerRef.value.removeAttribute("src");
		videoPlayerRef.value.load();
	}

	VideoPreviewModal.close();
}

/** 视频加载完毕 */
function onLoadedMetadata() {
	if (videoPlayerRef.value) {
		videoPlayerRef.value.play();
	}
}

/** 视频加载失败 */
function onVideoError() {
	ElMessage.error("视频加载失败，请检查视频地址是否正确");
}
</script>

<style lang="scss" scoped>
.video-player {
	width: 100%;
	height: auto;
	max-height: 400px;
	display: block;
}
</style>
