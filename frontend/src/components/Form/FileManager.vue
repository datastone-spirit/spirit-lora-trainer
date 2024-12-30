<template>
	<div class="file-manager" :id="fileId">
		<el-input v-model="folder" :placeholder="inputPlaceholder" class="file-manager-input">
			<template #append>
				<el-button :icon="FolderIcon" title="请选择" @click="tooglePopover" />
			</template>
		</el-input>
		<el-dialog
			width="700"
			trigger="click"
			v-model="visible"
			placement=""
			:popper-class="['input-tree-selector-popover']"
			custom-class="file-manager-dialog"
			destroy-on-close
		>
			<vue-finder
				v-if="visible"
				:features="features"
				:request="request"
				:select-button="handleSelectButton"
				class="file-finder"
			/>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon";

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
const fileId = Math.random().toString(36).substring(2);
const FolderIcon = useIcon({ name: "ri-folder-line" });

const inputPlaceholder = computed(() => {
	if (!props.placeholder) {
		return props.isDir ? "请输入或选择目录" : "请输入或选择文件";
	} else {
		return props.placeholder;
	}
});

const request = ref({
	// ----- CHANGE ME! -----
	// [REQUIRED] Url for development server endpoint
	baseUrl: import.meta.env.VITE_APP_API_BASE_URL + "/file",
	// ----- CHANGE ME! -----

	// Additional headers & params & body
	params: {
		path: computed(() => folder.value)
	},

	body: { additionalBody1: ["yes"] },

	// And/or transform request callback
	// transformRequest: (req: any) => {
	// 	return req;
	// },

	// XSRF Token header name
	xsrfHeaderName: "CSRF-TOKEN"
});

const handleSelectButton = {
	// show select button
	active: true,
	// allow multiple selection
	multiple: false,
	// handle click event
	click: (items: any, event: any) => {
		event.preventDefault();
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
.file-manager-dialog {
	height: 500px;
}
</style>
<style>
.vuefinder__main__container {
	min-height: 460px !important;
}
.vuefinder__main__content {
	min-height: 350px !important;
	max-height: 350px !important;
}
.vuefinder__treeview__header,
.vuefinder__status-bar__storage,
.vuefinder__status-bar__about {
	visibility: hidden;
	display: none;
}
.Toggle.Tree.View {
	display: none;
}
</style>
