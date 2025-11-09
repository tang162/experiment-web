import { Layout } from "@/layouts";
import { useAuthStore } from "@/stores";

/** 基本路由，这些路由是必须存在的 */

/** 全局404页面 */
const fallbackNotFoundRoute = {
  component: () => import("@/views/_core/fallback/not-found.vue"),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: "404",
  },
  name: "FallbackNotFound",
  path: "/:path(.*)*",
};

const coreRoutes = [
  {
    component: Layout,
    meta: {
      hideInBreadcrumb: true,
      title: "Root",
    },
    name: "Root",
    path: "/",
    redirect: () => {
      // 动态获取用户角色对应的默认首页
      const authStore = useAuthStore();
      return authStore.getDefaultHomePath;
    },
    children: [],
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      requiresAuth: false,
    },
    component: () => import("@/views/_core/login/index.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      title: "注册",
      requiresAuth: false,
    },
    component: () => import("@/views/_core/register/index.vue"),
  },
];

export { coreRoutes, fallbackNotFoundRoute };
