import {
  DEFAULT_HOME_PATH,
  LOGIN_PATH,
  useAccessStore,
  useAuthStore,
} from "@/stores";
import { coreRouteNames, accessRoutes } from "./routers/index";
import { generateAccess } from "./access";

function setupCommonGuard(router) {
  router.beforeEach((to, _from, next) => {
    try {
      window.scrollTo(0, 0);

      if (to.meta.title) {
        document.title =
          import.meta.env.VITE_APP_TITLE + "-" + String(to.meta.title);
      }
    } catch (error) {
      console.error("路由守卫执行失败:", error);
    }
    next();
  });
}

function setupAccessGuard(router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const authStore = useAuthStore();

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name)) {
      if (to.path === LOGIN_PATH && accessStore.accessToken) {
        // 根据用户角色获取默认首页
        const defaultPath = authStore.getDefaultHomePath || DEFAULT_HOME_PATH;
        return decodeURIComponent(
          (to.query?.redirect) || defaultPath
        );
      }
      return true;
    }

    // 登录检查
    if (!authStore.getIsLoggedIn) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        // 获取用户默认首页来判断是否需要携带 redirect 参数
        const userDefaultHomePath = authStore.getDefaultHomePath;
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query:
            to.fullPath === userDefaultHomePath
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    // 是否已经生成过动态路由
    if (accessStore.isAccessChecked) {
      return true;
    }

    const userInfo = authStore.getUserInfo || (await authStore.fetchUserInfo());

    const userRoles = userInfo.role;

    // 生成菜单和路由
    const { accessibleRoutes } = await generateAccess({
      roles: [userRoles],
      router,
      // 则会在菜单中显示，但是访问会被重定向到403
      routes: accessRoutes,
    });



    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);

    // 获取用户默认首页
    const userDefaultHomePath = authStore.getDefaultHomePath;
    const redirectPath = (from.query.redirect ??
      (to.path === userDefaultHomePath
        ? userDefaultHomePath
        : to.fullPath));

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
