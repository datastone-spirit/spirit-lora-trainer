import { fileURLToPath, URL } from "node:url";

import { defineConfig, ESBuildOptions, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { getCommitInfo } from "./vite-plugins/git-commit-info";
import { analyzer } from "vite-bundle-analyzer";

/** esbuild打包配置 */
function getEsbuildConfig(mode: string): ESBuildOptions | undefined {
	if (mode === "development") return undefined;

	return {
		pure: ["console.log"], // 打包移除log
		drop: ["debugger"] // 打包移除debugger
	};
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const viteEnv = loadEnv(mode, process.cwd()) as ImportMetaEnv;
	const commitInfo = getCommitInfo();

	return {
		/** 路由的 baseURL，控制 BASE_URL 环境变量 */
		base: viteEnv.VITE_APP_BASE_URL,
		plugins: [
			vue(),
			vueDevTools(),
			AutoImport({
				imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
				resolvers: [
					ElementPlusResolver({
						importStyle: "sass"
					})
				],
				dts: "types/auto-imports.d.ts",
				eslintrc: {
					enabled: true
				}
			}),
			Components({
				extensions: ["vue", "md"],
				include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
				resolvers: [
					ElementPlusResolver({
						importStyle: "sass"
					})
				],
				dts: "types/components.d.ts"
			}),
			mode === "analyze" ? analyzer() : undefined
		],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url))
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `
          @use '@/styles/element-plus/theme-light' as *;
          @use '@/styles/element-plus/theme-dark' as *;
					@use '@/styles/theme/light' as *;
					@use '@/styles/theme/dark' as *;
          @use '@/styles/variables' as *;
          @use '@/styles/mixins' as *;
          `,
					api: "modern-compiler"
				}
			}
		},
		define: {
			__GIT_COMMIT_TIME__: JSON.stringify(commitInfo.lastTime),
			__GIT_COMMIT_ID__: JSON.stringify(commitInfo.lastId)
		},
		esbuild: getEsbuildConfig(mode),
		build: {
			target: ["es2015"],
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["vue", "vue-router", "pinia", "@vueuse/core"],
						"element-plus": ["element-plus"]
					}
				}
			}
		},
		server: {
			host: true,
			// port: 5173,
			proxy: {
				"/api": {
					target: viteEnv.VITE_APP_API_BASE_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
					ws: true
				}
			}
		}
	};
});
