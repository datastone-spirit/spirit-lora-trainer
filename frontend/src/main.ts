import { createApp } from "vue";
import { piniaStore } from "@/stores";
import App from "./App.vue";
import { setupRouter } from "./router";

// style
import "@/styles/index.scss";

// plugins
import { ElementPlusPlugin } from "@/plugins/element-plus";

// directives
import directives from "@/directives";

async function setupApp() {
	const app = createApp(App);

	app.use(ElementPlusPlugin);
	app.use(piniaStore);
	app.use(directives);
	await setupRouter(app);

	app.mount("#app");
}

setupApp();
