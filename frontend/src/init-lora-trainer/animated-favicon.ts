/*
 * @Author: mulingyuer
 * @Date: 2025-01-08 10:53:00
 * @LastEditTime: 2025-01-09 18:15:38
 * @LastEditors: mulingyuer
 * @Description: 动态favicon
 * @FilePath: \frontend\src\init-lora-trainer\animated-favicon.ts
 * 怎么可能会有bug！！！
 */
import favicon0 from "@/assets/images/favicon/0.png?inline";
import favicon1 from "@/assets/images/favicon/1.png?inline";
import favicon2 from "@/assets/images/favicon/2.png?inline";
import favicon3 from "@/assets/images/favicon/3.png?inline";
import favicon4 from "@/assets/images/favicon/4.png?inline";
import favicon5 from "@/assets/images/favicon/5.png?inline";
import favicon6 from "@/assets/images/favicon/6.png?inline";
import favicon7 from "@/assets/images/favicon/7.png?inline";
import favicon8 from "@/assets/images/favicon/8.png?inline";
import favicon9 from "@/assets/images/favicon/9.png?inline";
import favicon10 from "@/assets/images/favicon/10.png?inline";
import favicon11 from "@/assets/images/favicon/11.png?inline";
import favicon12 from "@/assets/images/favicon/12.png?inline";
import favicon13 from "@/assets/images/favicon/13.png?inline";
import favicon14 from "@/assets/images/favicon/14.png?inline";
import favicon15 from "@/assets/images/favicon/15.png?inline";
import favicon16 from "@/assets/images/favicon/16.png?inline";
import favicon17 from "@/assets/images/favicon/17.png?inline";
import favicon18 from "@/assets/images/favicon/18.png?inline";
import favicon19 from "@/assets/images/favicon/19.png?inline";
import favicon20 from "@/assets/images/favicon/20.png?inline";
import favicon21 from "@/assets/images/favicon/21.png?inline";
import favicon22 from "@/assets/images/favicon/22.png?inline";
import favicon23 from "@/assets/images/favicon/23.png?inline";
import favicon24 from "@/assets/images/favicon/24.png?inline";
import favicon25 from "@/assets/images/favicon/25.png?inline";
import favicon26 from "@/assets/images/favicon/26.png?inline";
import favicon27 from "@/assets/images/favicon/27.png?inline";
import favicon28 from "@/assets/images/favicon/28.png?inline";
import favicon29 from "@/assets/images/favicon/29.png?inline";
import { useSettingsStore, useTrainingStore } from "@/stores";

class AnimatedFavicon {
	private readonly linkEle: HTMLLinkElement;
	private readonly iconList = [
		favicon0,
		favicon1,
		favicon2,
		favicon3,
		favicon4,
		favicon5,
		favicon6,
		favicon7,
		favicon8,
		favicon9,
		favicon10,
		favicon11,
		favicon12,
		favicon13,
		favicon14,
		favicon15,
		favicon16,
		favicon17,
		favicon18,
		favicon19,
		favicon20,
		favicon21,
		favicon22,
		favicon23,
		favicon24,
		favicon25,
		favicon26,
		favicon27,
		favicon28,
		favicon29
	];
	private resetIconPath = `${import.meta.env.BASE_URL}/favicon.ico`;
	private readonly settings = storeToRefs(useSettingsStore()).trainerSettings;
	private readonly trainingStore = useTrainingStore();

	private currentIndex = 0;
	private lastUpdate = 0; // 用于跟踪动画的时间
	private isAnimating = false; // 控制动画是否继续

	constructor() {
		this.linkEle = this.createLink();
		this.preloadIcons();
	}

	/** 创建link */
	private createLink() {
		let link: HTMLLinkElement;
		const oldLink: HTMLLinkElement | null = document.querySelector("link[rel='icon']");
		if (oldLink) {
			link = oldLink;
			this.resetIconPath = oldLink.href;
		} else {
			link = document.createElement("link");
			link.rel = "icon";
			document.head.appendChild(link);
		}
		return link;
	}

	/** 预加载图标 */
	private preloadIcons() {
		if (!this.settings.value.openAnimatedFavicon) return;
		this.iconList.forEach((icon) => {
			const img = new Image();
			img.src = icon; // 预加载图标
		});
	}

	/** 启动动画 */
	public startAnimation() {
		if (!this.settings.value.openAnimatedFavicon) return;
		if (this.isAnimating) return; // 如果已在播放动画则不执行

		this.isAnimating = true;
		this.currentIndex = 0; // 重置索引
		this.lastUpdate = performance.now(); // 初始化为当前时间

		const animate = (timestamp: number) => {
			if (!this.isAnimating) return; // 如果不再播放动画，则退出
			if (timestamp - this.lastUpdate >= 100) {
				this.updateIcon();
				this.lastUpdate = timestamp;
			}
			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);
	}

	/** 停止动画 */
	public stopAnimation() {
		this.isAnimating = false;
		this.linkEle.href = this.resetIconPath; // 重置图标
	}

	/** 更新Icon */
	private updateIcon() {
		const icon = this.iconList[this.currentIndex];
		this.linkEle.href = icon; // 更新图标地址
		this.currentIndex = (this.currentIndex + 1) % this.iconList.length; // 更新索引
	}

	/** 初始化 */
	public init() {
		const show = computed(() => {
			return this.trainingStore.useGPU && this.settings.value.openAnimatedFavicon;
		});
		watch(
			show,
			(val) => {
				val ? this.startAnimation() : this.stopAnimation();
			},
			{ immediate: true }
		);
	}
}

export function initAnimatedFavicon() {
	const animatedFavicon = new AnimatedFavicon();
	animatedFavicon.init();
}
