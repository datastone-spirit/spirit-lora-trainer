import { fileURLToPath, URL } from "node:url";

import { defineConfig, ESBuildOptions, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

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
					enabled: true,
					filepath: "./.eslintrc-auto-import.cjs",
					globalsPropValue: true
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
			})
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
          @use "@/styles/element-plus-theme/index.scss" as *;
          @use '@/styles/variables' as *;
          @use '@/styles/mixins' as *;
          `
					// api: "modern-compiler"
					// TODO: 关闭element-plus中scss语法过旧警告
					// silenceDeprecations: ["legacy-js-api"]
				}
			}
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
		}
		// server: {
		// 	host: true,
		// 	port: 5173
		// }
	};
});
