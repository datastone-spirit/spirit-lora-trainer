/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** 本地环境 */
	NODE_ENV: string;
	/** 标题 */
	VITE_APP_TITLE: string;
	/** baseURL */
	VITE_APP_BASE_URL: string;
	/** 本地持久化key前缀 */
	VITE_APP_LOCAL_KEY_PREFIX: string;
	/** api请求地址 */
	VITE_APP_API_BASE_URL: string;
	/** 开发时图片预览前缀链接 */
	VITE_APP_IMAGE_PREVIEW_PREFIX: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
