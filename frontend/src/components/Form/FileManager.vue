<template>
	<div class="file-manager" :id="fileId">
		<div class="file-manager-content" :class="{ 'show-tooltip': showTooltip }">
			<el-input v-model="folder" :placeholder="inputPlaceholder" class="file-manager-input">
				<template #append>
					<el-button :icon="FolderIcon" title="请选择" @click="togglePopover" />
				</template>
			</el-input>
			<el-tooltip v-if="showTooltip" placement="top" :content="tooltipContent">
				<el-button class="file-manager-info-btn" :icon="InfoIcon" link />
			</el-tooltip>
		</div>
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
import { useSettingsStore } from "@/stores";
import { getEnv } from "@/utils/env";

export interface InputTreeSelectorProps {
	placeholder?: string;
	/** 是否目录选择 */
	isDir: boolean;
	/** 目录图标 */
	dirIcon?: string;
	/** 文件图标 */
	fileIcon?: string;
}

// icon
const FolderIcon = useIcon({ name: "ri-folder-line" });
const InfoIcon = useIcon({ name: "ri-information-line" });

const settingsStore = useSettingsStore();

const features = ["select", "preview", "newfolder"];
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
const showTooltip = computed(() => settingsStore.whiteCheck);
const tooltipContent = computed(() => {
	return showTooltip.value
		? `如果挂载了存储请使用挂载存储所使用的句，如：${getEnv().VITE_APP_LORA_OUTPUT_PARENT_PATH} 开头的路径`
		: "";
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
	transformRequest: (req: any) => {
		if (req.method === "post") {
			refresh();
		}
		return req;
	},

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

const refresh = () => {
	// 新增完成后，刷新文件管理器
	setTimeout(() => {
		const refreshSvg = document.querySelector(`#${fileId} span[title='Refresh'] svg`);
		if (refreshSvg) {
			(refreshSvg as HTMLElement).style.pointerEvents = "all";
			refreshSvg?.dispatchEvent(new Event("click", { bubbles: true }));
		}
	}, 500);
};
const generateRandomString = () => {
	const characters = "abcdefghijklmnopqrstuvwxyz"; // 小写字母字符集
	let result = "";
	for (let i = 0; i < 10; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};
const fileId = generateRandomString();

const togglePopover = () => {
	visible.value = !visible.value;
};
</script>

<style lang="scss" scoped>
.file-manager {
	width: 100%;
}
.file-manager-content {
	position: relative;
	&.show-tooltip {
		padding-right: 30px;
	}
}
.file-manager-info-btn {
	position: absolute;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
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
