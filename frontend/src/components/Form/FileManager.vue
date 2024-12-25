<template>
	<div class="file-manager">
		<el-input v-model="folder" :placeholder="inputPlaceholder" class="file-manager-input">
			<template #append>
				<el-button @click="tooglePopover" :icon="Folder" title="请选择" />
			</template>
		</el-input>
		<el-dialog
			width="700"
			trigger="click"
			v-model="visible"
			placement=""
			:popper-class="['input-tree-selector-popover']"
		>
			<vue-finder :features="features" :request="request" :select-button="handleSelectButton" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { Folder } from "@element-plus/icons-vue";

export interface InputTreeSelectorProps {
	placeholder?: string;
	/** 是否目录选择 */
	isDir: boolean;
	/** 目录图标 */
	dirIcon?: string;
	/** 文件图标 */
	fileIcon?: string;
}

const features = ["select", "preview"];
const typeValue: any = {
	file: false,
	dir: true
};
const visible = ref(false);
const props = withDefaults(defineProps<InputTreeSelectorProps>(), {});
const folder = defineModel({ type: String, required: true });

const inputPlaceholder = computed(() => {
	if (!props.placeholder) {
		return props.isDir ? "请输入或选择目录" : "请输入或选择文件";
	} else {
		return props.placeholder;
	}
});

const request = {
	// ----- CHANGE ME! -----
	// [REQUIRED] Url for development server endpoint
	baseUrl: import.meta.env.VITE_APP_API_BASE_URL + "/file",
	// ----- CHANGE ME! -----

	// Additional headers & params & body
	params: {
		is_dir: String(props.isDir),
		path: "./"
	},
	body: { additionalBody1: ["yes"] },

	// And/or transform request callback
	transformRequest: (req: any) => {
		return req;
	},

	// XSRF Token header name
	xsrfHeaderName: "CSRF-TOKEN"
};

const handleSelectButton = {
	// show select button
	active: true,
	// allow multiple selection
	multiple: false,
	// handle click event
	click: (items: any) => {
		if (typeValue[items[0].type] !== props.isDir) {
			ElNotification({
				type: "error",
				message: props.isDir ? "请选择目录" : "请选择文件"
			});
			return;
		}
		folder.value = items[0].path;
		visible.value = false;
	}
};

const tooglePopover = () => {
	visible.value = !visible.value;
};
</script>

<style lang="scss" scoped>
.file-manager {
	width: 100%;
}
/* Add any custom styles here */
.file-manager-input {
	// width: 100%;
}
</style>
