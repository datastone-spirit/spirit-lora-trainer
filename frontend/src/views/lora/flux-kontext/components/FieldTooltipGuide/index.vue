<!--
 * @Author: mulingyuer
 * @Date: 2025-08-27 09:50:40
 * @LastEditTime: 2025-08-27 11:08:30
 * @LastEditors: mulingyuer
 * @Description: 功能介绍
 * @FilePath: \frontend\src\views\lora\flux-kontext\components\FieldTooltipGuide\index.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="field-tooltip-guide">
		<el-alert class="field-tooltip-guide-alert" type="info" :closable="false" show-icon>
			<template #icon>
				<Icon name="ri-information-fill" size="18" />
			</template>
			<div class="field-tooltip-guide-alert-desc">
				本训练页支持 <strong>Flux Kontext LoRA</strong> 训练，您可以在这个页面设置参数并训练对应
				LoRA
			</div>
		</el-alert>
		<div class="field-tooltip-guide-content">
			<p>使用支持：</p>
			<ul>
				<li>
					我们训练器采用的是：<el-link
						type="info"
						href="https://github.com/ostris/ai-toolkit"
						target="_blank"
					>
						AI Toolkit
					</el-link>
					脚本
				</li>
				<li>
					如果你不知道如何使用这个训练器，请观看
					<el-link type="info" href="https://www.bilibili.com/video/BV1KatjzCEin" target="_blank"
						>《智灵训练器Kontext LoRA训练，轻松搞定电商产品图！》</el-link
					>
				</li>
				<li>如果还有其他GPU疑问，请访问我们的B站或添加训练器首页的二维码寻求帮助</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.field-tooltip-guide {
	margin-bottom: $zl-collapse-margin;
	background-color: var(--zl-collapse-bg);
	border-radius: $zl-border-radius;
	padding: $zl-padding;
}
.field-tooltip-guide-alert {
	margin-bottom: 22px;
}
.field-tooltip-guide-alert-desc {
	font-size: 14px;
}
.field-tooltip-guide-content {
	font-size: 14px;
	line-height: 20px;
	p {
		margin-bottom: 6px;
	}
	ul {
		list-style: disc;
		padding-inline-start: 40px;
	}
	li + li {
		margin-top: 6px;
	}
}
</style>
