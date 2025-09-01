import "default-passive-events"; //去除touchstart谷歌警告
import { createApp } from "vue";
import { piniaStore } from "@/stores";
import App from "./App.vue";
import { setupRouter } from "./router";
import VueFinder from "vuefinder/dist/vuefinder";
import { initLoraTrainer } from "./init-lora-trainer";
import { AnimatedFavicon } from "@/utils/animated-favicon";

// style
import "@/styles/index.scss";
import "vuefinder/dist/style.css";

// plugins
import { ElementPlusPlugin } from "@/plugins/element-plus";

// directives
import directives from "@/directives";

async function setupApp() {
	const app = createApp(App);

	app.use(ElementPlusPlugin);
	app.use(piniaStore);
	app.use(directives);
	app.use(VueFinder);
	await setupRouter(app);

	// 初始化
	await initLoraTrainer();
	new AnimatedFavicon().init();

	app.mount("#app");
}

setupApp();
