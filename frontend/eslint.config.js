/*
 * @Author: mulingyuer 1321968423@qq.com
 * @Date: 2024-12-04 09:25:15
 * @LastEditors: mulingyuer
 * @LastEditTime: 2025-07-23 09:23:46
 * @FilePath: \frontend\eslint.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import oxlint from "eslint-plugin-oxlint";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

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
	...compat.extends("./.eslintrc-auto-import.json"),
	skipFormatting,
	{
		name: "app/files-to-lint",
		files: ["**/*.{ts,mts,tsx,vue}"],
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
			"@typescript-eslint/no-unused-expressions": "off"
		}
	},
	{
		name: "app/files-to-ignore",
		ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
	}
	// {
	// 	rules: {
	// 		"vue/multi-word-component-names": "off",
	// 		"no-unused-vars": "off",
	// 		"@typescript-eslint/no-explicit-any": "off",
	// 		"@typescript-eslint/no-unused-vars": [
	// 			"error",
	// 			{
	// 				args: "all",
	// 				argsIgnorePattern: "^_",
	// 				caughtErrors: "all",
	// 				caughtErrorsIgnorePattern: "^_",
	// 				destructuredArrayIgnorePattern: "^_",
	// 				varsIgnorePattern: "^_",
	// 				ignoreRestSiblings: true
	// 			}
	// 		],
	// 		"@typescript-eslint/no-unused-expressions": "off",
	// 		"prefer-const": "off"
	// 	}
	// }
];
