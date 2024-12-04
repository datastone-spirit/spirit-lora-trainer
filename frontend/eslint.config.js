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
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_"
				}
			]
		}
	}
];
