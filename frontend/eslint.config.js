/*
 * @Author: mulingyuer 1321968423@qq.com
 * @Date: 2024-12-04 09:25:15
 * @LastEditors: mulingyuer
 * @LastEditTime: 2024-12-18 17:07:26
 * @FilePath: \frontend\eslint.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import oxlint from "eslint-plugin-oxlint";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import AutoImport from "./.eslintrc-auto-import.cjs";

export default [
	{
		name: "app/files-to-lint",
		files: ["**/*.{ts,mts,tsx,vue}"]
	},

	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
	},

	...pluginVue.configs["flat/essential"],
	...vueTsEslintConfig(),
	oxlint.configs["flat/recommended"],
	skipFormatting,
	{
		ignores: [".vscode", "node_modules", "*.md", "*.woff", "*.ttf", ".idea", "dist", ".husky"],
		files: ["**/*.{js,ts,mjs,mts,cjs,cts,jsx,tsx,vue}"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...AutoImport.globals
			}
		}
	},
	{
		rules: {
			"vue/multi-word-component-names": "off",
			"no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true
				}
			],
			"@typescript-eslint/no-unused-expressions": "off",
			"prefer-const": "off"
		}
	}
];
