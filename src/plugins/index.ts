import type { App } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

// Ant Design Vue 组件将在各个组件中按需导入

// 导入 dayjs 中文语言包
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

/**
 * 从环境变量获取主题配置
 */
function getThemeFromEnv() {
  return {
    token: {
      // 主色 - 从环境变量获取
      colorPrimary: import.meta.env.VITE_ANTD_PRIMARY_COLOR || "#1890ff",
      // 成功色
      colorSuccess: import.meta.env.VITE_ANTD_SUCCESS_COLOR || "#52c41a",
      // 警告色
      colorWarning: import.meta.env.VITE_ANTD_WARNING_COLOR || "#faad14",
      // 错误色
      colorError: import.meta.env.VITE_ANTD_ERROR_COLOR || "#ff4d4f",
      // 信息色
      colorInfo: import.meta.env.VITE_ANTD_PRIMARY_COLOR || "#1890ff",
      // 边框圆角
      borderRadius: parseInt(import.meta.env.VITE_ANTD_BORDER_RADIUS) || 6,
      // 字体大小
      fontSize: parseInt(import.meta.env.VITE_ANTD_FONT_SIZE) || 14,
    },
  };
}

/**
 * 安装 Ant Design Vue
 * @param app Vue 应用实例
 */
export function setupElement(app: App) {
  // 获取主题配置
  const theme = getThemeFromEnv();

  // 设置全局配置
  app.provide(ElementPlus, {
    locale: zhCn,
    theme,
  });

  // 输出配置信息（仅在开发环境）
  if (import.meta.env.MODE === "development") {
    // console.log("🎨 Ant Design Vue 已配置完成", {
    //   locale: "zh-CN",
    //   theme: theme.token,
    // });
  }
}

/**
 * 主题配置
 */
export const themeConfig = {
  // 亮色主题
  light: {
    token: {
      colorPrimary: "#1890ff",
      colorBgBase: "#ffffff",
      colorTextBase: "#000000",
    },
  },

  // 暗色主题
  dark: {
    token: {
      colorPrimary: "#1890ff",
      colorBgBase: "#141414",
      colorTextBase: "#ffffff",
    },
  },
};

/**
 * 国际化配置
 */
export const localeConfig = {
  "zh-CN": zhCn,
  // 可以添加其他语言
  // 'en-US': enUS,
};

export default setupElement;
