<!--
 * @Author: mulingyuer
 * @Date: 2024-12-12 14:25:37
 * @LastEditTime: 2024-12-16 11:41:02
 * @LastEditors: mulingyuer
 * @Description: 底部配置栏
 * @FilePath: \frontend\src\views\lora\flux\components\Footer\ConfigBtns.vue
 * 怎么可能会有bug！！！
-->
<template>
	<Teleport :to="to" :defer="defer">
		<div class="lora-flux-config-panel">
			<el-space class="lora-flux-config-wrapper" :size="12">
				<el-button text> 配置导入 </el-button>
				<el-button text> 配置导出 </el-button>
				<el-popover placement="bottom" trigger="click" width="200" content="请前往智灵后台查看日志">
					<template #reference>
						<el-button text> 日志 </el-button>
					</template>
				</el-popover>
			</el-space>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import type { TeleportProps } from "vue";

export interface ConfigProps {
	to?: TeleportProps["to"];
	defer?: TeleportProps["defer"];
}

withDefaults(defineProps<ConfigProps>(), {
	to: "#footer-bar-left",
	defer: true
});
</script>

<style lang="scss" scoped>
.lora-flux-config-panel {
	height: 100%;
}
.lora-flux-config-wrapper {
	height: 100%;
}
</style>
