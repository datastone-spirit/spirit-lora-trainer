<!--
 * @Author: mulingyuer
 * @Date: 2025-02-07 14:45:09
 * @LastEditTime: 2025-02-07 15:56:33
 * @LastEditors: mulingyuer
 * @Description: 数据集高级设置
 * @FilePath: \frontend\src\components\Form\DatasetAdvanced.vue
 * 怎么可能会有bug！！！
-->
<template>
	<div class="dataset-advanced">
		<PopoverFormItem label="打标高级设置" class="dataset-advanced-switch">
			<el-switch v-model="advancedValue" />
		</PopoverFormItem>
		<template v-if="advancedValue">
			<PopoverFormItem
				:label="taggerPromptLabel"
				:prop="taggerPromptProp"
				:popover-content="taggerPromptPopoverContent"
			>
				<el-input
					v-model="taggerPrompt"
					:placeholder="taggerPromptPlaceholder"
					type="textarea"
					:rows="4"
				/>
			</PopoverFormItem>
			<PopoverFormItem
				:label="taggerAppendFileLabel"
				:prop="taggerAppendFileProp"
				:popover-content="taggerAppendFilePopoverContent"
			>
				<el-switch v-model="taggerAppendFile" />
			</PopoverFormItem>
		</template>
	</div>
</template>

<script setup lang="ts">
export interface DatasetAdvancedProps {
	/** 是否开启高级设置 */
	advanced: boolean;
	/** 打标提示词 */
	taggerPromptLabel?: string;
	taggerPromptProp?: string;
	taggerPromptPlaceholder?: string;
	taggerPromptPopoverContent?: string;
	/** 是否追加到已有打标文件中 */
	taggerAppendFileLabel?: string;
	taggerAppendFileProp?: string;
	taggerAppendFilePopoverContent?: string;
}

withDefaults(defineProps<DatasetAdvancedProps>(), {
	taggerPromptLabel: "打标提示词",
	taggerPromptPlaceholder: "请输入打标提示词",
	taggerAppendFileLabel: "是否追加到已有打标文件中"
});

const advancedValue = defineModel("advanced", { type: Boolean, required: true });
const taggerPrompt = defineModel("taggerPrompt", { type: String, required: true });
const taggerAppendFile = defineModel("taggerAppendFile", { type: Boolean, required: true });
</script>

<style lang="scss" scoped>
.dataset-advanced-switch {
	@include no-select();
}
</style>
