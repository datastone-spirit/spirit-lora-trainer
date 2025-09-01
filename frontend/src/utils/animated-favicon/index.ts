/*
 * @Author: mulingyuer
 * @Date: 2025-09-01 15:55:33
 * @LastEditTime: 2025-09-01 16:19:23
 * @LastEditors: mulingyuer
 * @Description: 动态 favicon
 * @FilePath: \frontend\src\utils\animated-favicon\index.ts
 * 怎么可能会有bug！！！
 */
import { useSettingsStore, useTrainingStore } from "@/stores";

export class AnimatedFavicon {
	/** favicon数量 */
	private readonly FAVICON_COUNT = 30;
	/** 动画切换间隔（毫秒） */
	private readonly FAVICON_INTERVAL = 100;

	private readonly iconList: string[];
	private readonly linkEle: HTMLLinkElement;
	/** 初始的favicon路径 */
	private resetIconPath = `${import.meta.env.BASE_URL}/favicon.ico`;

	private readonly settingsStore = useSettingsStore();
	private readonly trainingStore = useTrainingStore();

	// 动画配置
	private currentIndex = 0;
	private lastUpdate = 0; // 用于跟踪动画的时间
	private isAnimating = false; // 控制动画是否继续
	private animationFrameId: number | null = null;

	constructor() {
		this.iconList = this.loadIcons();
		this.linkEle = this.createLink();
		this.preloadIcons();
	}

	public init() {
		const shouldAnimate = computed(() => {
			return this.trainingStore.useGPU && this.settingsStore.trainerSettings.openAnimatedFavicon;
		});

		watch(
			shouldAnimate,
			(value) => {
				if (value) {
					this.startAnimation();
				} else {
					this.stopAnimation();
				}
			},
			{
				immediate: true
			}
		);
	}

	/** 动态加载favicon列表 */
	private loadIcons(): string[] {
		const icons: string[] = [];
		for (let i = 0; i < this.FAVICON_COUNT; i++) {
			icons.push(new URL(`../../assets/images/favicon/${i}.png`, import.meta.url).href);
		}
		return icons;
	}

	/** 创建或获取favicon的link元素 */
	private createLink() {
		let link: HTMLLinkElement;
		const existingLink: HTMLLinkElement | null = document.querySelector("link[rel='icon']");

		if (existingLink) {
			link = existingLink;
			this.resetIconPath = existingLink.href;
		} else {
			link = document.createElement("link");
			link.rel = "icon";
			document.head.appendChild(link);
		}

		return link;
	}

	/** 预加载图标 */
	private preloadIcons(): void {
		if (!this.settingsStore.trainerSettings.openAnimatedFavicon) return;
		for (const icon of this.iconList) {
			const img = new Image();
			img.src = icon;
		}
	}

	/** 启动动画 */
	private startAnimation() {
		if (!this.settingsStore.trainerSettings.openAnimatedFavicon) return;
		if (this.isAnimating) return; // 如果已在播放动画则不执行

		this.isAnimating = true;
		this.currentIndex = 0; // 重置索引
		this.lastUpdate = performance.now(); // 初始化为当前时间

		const animate = (timestamp: number) => {
			if (!this.isAnimating) return; // 如果不再播放动画，则退出
			if (timestamp - this.lastUpdate >= this.FAVICON_INTERVAL) {
				this.updateIcon();
				this.lastUpdate = timestamp;
			}

			this.animationFrameId = requestAnimationFrame(animate);
		};

		this.animationFrameId = requestAnimationFrame(animate);
	}

	/** 停止动画 */
	private stopAnimation() {
		this.isAnimating = false;
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.linkEle.href = this.resetIconPath; // 重置图标
	}

	/** 更新favicon */
	private updateIcon(): void {
		this.linkEle.href = this.iconList[this.currentIndex];
		this.currentIndex = (this.currentIndex + 1) % this.iconList.length;
	}
}
