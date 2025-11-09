
import { generateAccessible } from "@/utils";

const forbiddenComponent = () => import("@/views/_core/fallback/forbidden.vue");

async function generateAccess(options) {
  const pageMap = import.meta.glob("../views/**/*.vue");

  return await generateAccessible({
    ...options,
    routes: options.routes,
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    pageMap,
  });
}

export { generateAccess };
