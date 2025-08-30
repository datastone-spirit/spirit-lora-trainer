/*
 * @Author: mulingyuer
 * @Date: 2025-08-28 11:42:11
 * @LastEditTime: 2025-08-29 09:41:03
 * @LastEditors: mulingyuer
 * @Description: 视频信息map
 * @FilePath: \frontend\src\constants\video-map.ts
 * 怎么可能会有bug！！！
 */

/** 智灵训练器视频信息map */
export const ZL_VIDEO_MAP = {
	/** flux */
	FLUX: {
		show: true,
		title: "这款新出的Flux LoRA训练器也太好用了吧！",
		href: "https://www.bilibili.com/video/BV1VW61YxE5N"
	},
	/** flux kontext */
	FLUX_KONTEXT: {
		show: true,
		title: "智灵训练器Kontext LoRA训练，轻松搞定电商产品图！",
		href: "https://www.bilibili.com/video/BV1KatjzCEin"
	},
	/** 混元视频 */
	HUNYUAN_VIDEO: {
		show: true,
		title: "这款新出的混元Video LoRA训练器也太好用了吧！",
		href: "https://www.bilibili.com/video/BV1qiw5eaE6k"
	},
	/** qwen image */
	QWEN_IMAGE: {
		show: true,
		title: "智灵训练器Qwen-Image-LoRA训练：轻松生成专属模型！",
		href: "https://www.bilibili.com/video/BV1oJhXzME2p"
	},
	/** wan 2.1 */
	WAN_2_1: {
		show: true,
		title: "Wan2.1 LoRA训练器来袭！新手也能上手的AI工具！",
		href: "https://www.bilibili.com/video/BV14z5izYEMh"
	},
	/** wan 2.2 */
	WAN_2_2: {
		show: false,
		title: "Wan2.2：用文字和图片召唤“影视大片”！",
		href: "https://www.bilibili.com/video/BV1hwbGzrEH6"
	}
} as const;
