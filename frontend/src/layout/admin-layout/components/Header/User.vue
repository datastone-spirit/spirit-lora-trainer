<!--
 * @Author: mulingyuer
 * @Date: 2024-09-30 09:24:09
 * @LastEditTime: 2024-09-30 17:36:52
 * @LastEditors: mulingyuer
 * @Description: 用户
 * @FilePath: \spirit-app-microservice-admin\src\layout\admin-layout\components\Header\User.vue
 * 怎么可能会有bug！！！
-->
<template>
	<el-dropdown trigger="click" class="admin-user-dropdown">
		<div class="admin-user">
			<el-avatar class="admin-user-avatar" :src="userAvatar" size="small" />
			<span class="admin-user-name">管理员</span>
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="onLogout">退出登录</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { useAuth } from "@/hooks/useAuth";
import userAvatar from "@/assets/images/user-avatar.jpg";

const { logout } = useAuth();
const router = useRouter();

async function onLogout() {
	await logout();
	router.replace({ name: "Login" });
}
</script>

<style lang="scss" scoped>
.admin-user-dropdown {
	height: 100%;
}
.admin-user {
	height: 100%;
	padding: 12px;
	cursor: pointer;
	display: flex;
	align-items: center;
	@include no-select();
	&:hover {
		background-color: var(--el-fill-color-light);
	}
}
.admin-user-avatar {
	margin-right: 8px;
}
.admin-user-name {
	max-width: 85px;
	@include text-ellipsis();
}
</style>
