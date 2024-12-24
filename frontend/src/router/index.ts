import { createRouter, createWebHashHistory } from "vue-router";
import { rootRoute, notFoundRoute } from "./routes";
import { createRouterGuard } from "./guard";
import type { App } from "vue";

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [rootRoute, notFoundRoute],
	scrollBehavior: () => ({ left: 0, top: 0 })
});

export async function setupRouter(app: App) {
	app.use(router);
	await createRouterGuard(router);
	await router.isReady();
}

export default router;
