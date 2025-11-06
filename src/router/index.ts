import { createRouter, createWebHistory } from "vue-router";

import { createRouterGuard } from "./guard";
import { routes } from "./routers";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

createRouterGuard(router);

export { router };
