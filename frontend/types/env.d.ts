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
	/** 开启小白校验 */
	VITE_APP_WHITE_CHECK: string;
	/** lora输出路径前缀要求 */
	VITE_APP_LORA_OUTPUT_PARENT_PATH: string;
	/** wan视频训练max_frames */
	VITE_APP_WAN_VIDEO_MAX_FRAMES: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

/** git最后一次提交时间 */
declare const __GIT_COMMIT_TIME__: string;
/** git最后一次commit id */
declare const __GIT_COMMIT_ID__: string;
