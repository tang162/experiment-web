import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from "@/types";
import { generateAccessible } from "@/utils";

const forbiddenComponent = () => import("@/views/_core/fallback/forbidden.vue");

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob("../views/**/*.vue");

  return await generateAccessible({
    ...options,
    routes: options.routes,
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    pageMap,
  });
}

export { generateAccess };
