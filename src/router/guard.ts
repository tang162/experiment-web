import type { Router, RouteLocationNormalized } from "vue-router";
import {
  DEFAULT_HOME_PATH,
  LOGIN_PATH,
  useAccessStore,
  useAuthStore,
} from "@/stores";
import { coreRouteNames, accessRoutes } from "./routers/index";
import { generateAccess } from "./access";

// 类型定义
interface RouteContext {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  router: Router;
}

interface NavigationResult {
  path?: string;
  query?: Record<string, any>;
  replace?: boolean;
}

interface UserInfo {
  role: string;
  [key: string]: any;
}

// 路由配置常量
const ROUTE_CONFIG = {
  core: {
    ignoreAccess: "ignoreAccess",
    title: "title",
  },
  cache: {
    userInfo: {
      ttl: 5 * 60 * 1000, // 5分钟缓存
      key: "cached_user_info",
    },
    accessCheck: {
      key: "access_check_complete",
      maxRetries: 3,
    },
  },
  debounce: {
    routeGeneration: 300, // 路由生成防抖时间
  },
} as const;

// 请求去重和防抖管理
class RequestManager {
  private pendingRequests = new Map<string, Promise<any>>();
  private debounceTimers = new Map<string, NodeJS.Timeout>();

  async deduplicate<T>(key: string, factory: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = factory().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  debounce(key: string, fn: () => void, delay: number): void {
    const existing = this.debounceTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      fn();
    }, delay);

    this.debounceTimers.set(key, timer);
  }

  cancel(key: string): void {
    const timer = this.debounceTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(key);
    }
  }
}

// 用户信息缓存管理
class UserCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly ttl: number;

  constructor(ttl: number) {
    this.ttl = ttl;
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

function setupCommonGuard(router: Router) {
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

// 全局实例
const requestManager = new RequestManager();
const userCache = new UserCache(ROUTE_CONFIG.cache.userInfo.ttl);

// 路由守卫辅助函数
function isCoreRoute(routeName: string): boolean {
  return coreRouteNames.includes(routeName);
}

function shouldIgnoreAccess(to: RouteLocationNormalized): boolean {
  return to.meta?.[ROUTE_CONFIG.core.ignoreAccess] === true;
}

function isLoginRoute(to: RouteLocationNormalized): boolean {
  return to.path === LOGIN_PATH;
}

function isDefaultHomePath(path: string): boolean {
  return path === DEFAULT_HOME_PATH;
}

function validateRouteContext(context: RouteContext): boolean {
  const { to } = context;
  return !!(to && to.name && to.path);
}

function buildLoginRedirect(to: RouteLocationNormalized): NavigationResult {
  // 只有当目标路径不是默认首页时才需要 redirect 参数
  const query = isDefaultHomePath(to.fullPath)
    ? {}
    : { redirect: encodeURIComponent(to.fullPath) };

  return {
    path: LOGIN_PATH,
    query,
    replace: true,
  };
}

function generateRouteNavigation(
  router: Router,
  targetPath: string
): NavigationResult {
  return {
    ...router.resolve(targetPath),
    replace: true,
  };
}

function createCacheKey(userId: string, role: string): string {
  return `${ROUTE_CONFIG.cache.userInfo.key}_${userId}_${role}`;
}

function shouldUseCachedUserInfo(userId: string, role: string): boolean {
  const cacheKey = createCacheKey(userId, role);
  const cached = userCache.get(cacheKey);
  return !!cached;
}

function setCachedUserInfo(
  userId: string,
  role: string,
  userInfo: UserInfo
): void {
  const cacheKey = createCacheKey(userId, role);
  userCache.set(cacheKey, userInfo);
}

function getCachedUserInfo(userId: string, role: string): UserInfo | null {
  const cacheKey = createCacheKey(userId, role);
  return userCache.get(cacheKey);
}

// 重试机制
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = ROUTE_CONFIG.cache.accessCheck.maxRetries,
  delay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // 指数退避
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }

  throw lastError!;
}

// 路由生成优化版本
async function generateAccessOptimized(
  router: Router,
  userInfo: UserInfo
): Promise<{ accessibleRoutes: any[] }> {
  const requestKey = `access_gen_${userInfo.role}`;

  return requestManager.deduplicate(requestKey, async () => {
    return withRetry(async () => {
      return generateAccess({
        roles: [userInfo.role],
        router,
        routes: accessRoutes,
      });
    });
  });
}

// 用户信息获取优化版本
async function getUserInfoOptimized(authStore: any): Promise<UserInfo | null> {
  const userId = authStore.getUserId;
  const userInfo = authStore.getUserInfo;

  if (!userId) {
    return null;
  }

  // 尝试使用缓存
  if (userInfo && shouldUseCachedUserInfo(userId, userInfo.role)) {
    const cached = getCachedUserInfo(userId, userInfo.role);
    if (cached) {
      return cached;
    }
  }

  // 获取最新用户信息
  const freshUserInfo = userInfo || (await authStore.fetchUserInfo());

  if (freshUserInfo?.role) {
    setCachedUserInfo(userId, freshUserInfo.role, freshUserInfo);
  }

  return freshUserInfo;
}

function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const context: RouteContext = { to, from, router };
    const accessStore = useAccessStore();
    const authStore = useAuthStore();

    // 1. 路由上下文验证
    if (!validateRouteContext(context)) {
      console.warn("无效的路由上下文");
      return true;
    }

    // 2. 基本路由检查 - 最高优先级
    if (isCoreRoute(to.name as string)) {
      // 已登录用户访问登录页时，重定向到默认首页或 redirect 参数
      if (isLoginRoute(to) && authStore.getIsLoggedIn) {
        const defaultPath = authStore.getDefaultHomePath || DEFAULT_HOME_PATH;
        const targetPath = (to.query?.redirect as string) || defaultPath;
        return generateRouteNavigation(router, decodeURIComponent(targetPath));
      }
      return true;
    }

    // 3. 权限忽略检查
    if (shouldIgnoreAccess(to)) {
      return true;
    }

    // 4. 登录状态检查
    if (!authStore.getIsLoggedIn) {
      if (!isLoginRoute(to)) {
        return buildLoginRedirect(to);
      }
      return true;
    }

    // 5. 动态路由已生成 - 直接放行
    if (accessStore.isAccessChecked) {
      return true;
    }

    try {
      // 6. 优化用户信息获取
      const userInfo = await getUserInfoOptimized(authStore);

      if (!userInfo?.role) {
        console.error("用户角色信息缺失");
        userCache.clear(); // 清理缓存
        return { path: LOGIN_PATH, replace: true };
      }

      // 7. 优化路由生成（带缓存和重试）
      const { accessibleRoutes } = await generateAccessOptimized(
        router,
        userInfo
      );

      accessStore.setAccessRoutes(accessibleRoutes);
      accessStore.setIsAccessChecked(true);

      // 8. 计算重定向路径
      const userDefaultHomePath =
        authStore.getDefaultHomePath || DEFAULT_HOME_PATH;
      const redirectPath =
        (from.query.redirect as string) ||
        (isDefaultHomePath(to.path) ? userDefaultHomePath : to.fullPath);

      return generateRouteNavigation(router, decodeURIComponent(redirectPath));
    } catch (error) {
      console.error("路由生成失败:", error);

      // 网络错误时的降级处理
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.warn("网络错误，尝试降级处理");
        return buildLoginRedirect(to);
      }

      // 其他错误重定向到登录页
      return { path: LOGIN_PATH, replace: true };
    }
  });
}

// 清理函数
function clearCache(): void {
  userCache.clear();
  requestManager.cancel("route_generation");
  requestManager.cancel("user_info");
}

function resetState(): void {
  clearCache();
  // 这里可以重置其他状态
}

// 测试辅助函数
function createMockContext(
  to: Partial<RouteLocationNormalized> = {},
  from: Partial<RouteLocationNormalized> = {},
  router: Partial<Router> = {}
): RouteContext {
  return {
    to: to as RouteLocationNormalized,
    from: from as RouteLocationNormalized,
    router: router as Router,
  };
}

// 性能监控
function logPerformance(label: string, fn: () => void | Promise<void>): void {
  const start = performance.now();
  const result = fn();

  if (result instanceof Promise) {
    result.finally(() => {
      const end = performance.now();
      console.log(`${label} 耗时: ${(end - start).toFixed(2)}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`${label} 耗时: ${(end - start).toFixed(2)}ms`);
  }
}

/**
 * 项目守卫配置
 * @param router
 * @param options 配置选项
 */
function createRouterGuard(
  router: Router,
  options?: {
    enablePerformanceLog?: boolean;
    enableCache?: boolean;
    cacheTTL?: number;
  }
) {
  const config = {
    enablePerformanceLog: options?.enablePerformanceLog ?? false,
    enableCache: options?.enableCache ?? true,
    cacheTTL: options?.cacheTTL ?? ROUTE_CONFIG.cache.userInfo.ttl,
  };

  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);

  // 返回清理函数和配置
  return {
    clearCache,
    resetState,
    createMockContext,
    config,
  };
}

export {
  createRouterGuard,
  clearCache,
  resetState,
  createMockContext,
  logPerformance,
  requestManager,
  userCache,
};
