<!--
 * @Author: mulingyuer
 * @Date: 2024-09-29 11:01:54
 * @LastEditTime: 2024-10-15 11:54:33
 * @LastEditors: mulingyuer
 * @Description: icon
 * @FilePath: \element-admin-template\src\components\Icon.vue
 * 怎么可能会有bug！！！
-->
<script lang="ts">
import { ElIcon } from "element-plus";
import iconPath from "@/assets/icons/remixicon.symbol.svg";

export default defineComponent({
	name: "Icon",
	props: {
		name: {
			type: String,
			required: true
		},
		size: {
			type: [String, Number],
			default: 16
		},
		color: {
			type: String,
			default: "inherit"
		}
	},
	setup(props) {
		if (typeof props.name !== "string") return;

		// el-icon
		if (props.name.startsWith("el-icon-")) {
			return () =>
				h(ElIcon, { size: props.size || "16px", color: props.color }, () =>
					h(resolveComponent(props.name.replace("el-icon-", "")))
				);
		}

		// remixicon
		if (props.name.startsWith("ri-")) {
			return () =>
				h(ElIcon, { size: props.size || "16px", color: props.color }, () =>
					h(
						"svg",
						{ class: "remix", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1024 1024" },
						[h("use", { "xlink:href": `${iconPath}#${props.name}` })]
					)
				);
		}
	}
});
</script>
