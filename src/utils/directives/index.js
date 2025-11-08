import type { App } from "vue";
import { lazyImage } from "./lazy-image";

// 导入样式
import "./lazy-image.css";

// 所有指令的集合
const directives = {
  lazyImage,
};

// 安装所有指令的函数
export function setupDirectives(app: App) {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key as keyof typeof directives]);
  });
}

// 单独导出指令
export { lazyImage };

// 导出类型
export type { LazyImageOptions } from "./lazy-image";
export { ImageStatus } from "./lazy-image";

// 默认导出
export default {
  install: setupDirectives,
};
