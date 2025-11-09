import { lazyImage } from "./lazy-image";

// 导入样式
import "./lazy-image.css";

// 所有指令的集合
const directives = {
  lazyImage,
};

// 安装所有指令的函数
export function setupDirectives(app) {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key]);
  });
}

// 单独导出指令
export { lazyImage };

// 导出类型
export { ImageStatus } from "./lazy-image";

// 默认导出
export default {
  install: setupDirectives,
};
