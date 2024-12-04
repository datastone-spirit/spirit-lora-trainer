/*
 * @Author: mulingyuer
 * @Date: 2024-09-27 09:28:34
 * @LastEditTime: 2024-09-27 09:33:42
 * @LastEditors: mulingyuer
 * @Description: 进度条
 * @FilePath: \spirit-app-microservice-admin\src\utils\nprogress.ts
 * 怎么可能会有bug！！！
 */
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "@/styles/nprogress.scss";

//全局进度条的配置
NProgress.configure({
	easing: "ease", // 动画方式
	speed: 500, // 递增进度条的速度
	showSpinner: false, // 是否显示加载ico
	trickleSpeed: 200, // 自动递增间隔
	minimum: 0.3 // 初始化时的最小百分比
});

export { NProgress };
