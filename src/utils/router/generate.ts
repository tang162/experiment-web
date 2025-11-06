import { type GenerateMenuAndRoutesOptions, cloneDeep } from "@/types";
import { generateRoutes } from "./generate-routes";

const generateAccessible = async (options: GenerateMenuAndRoutesOptions) => {
  const { router } = options;

  options.routes = cloneDeep(options.routes);
  // 生成路由
  const accessibleRoutes = await generateRoutes(options);

  const root = router.getRoutes().find((item) => item.path === "/");

  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    router.addRoute(route);
  });

  if (root) {
    if (root.name) {
      router.removeRoute(root.name);
    }
    router.addRoute(root);
  }

  return { accessibleRoutes };
};

export { generateAccessible };
