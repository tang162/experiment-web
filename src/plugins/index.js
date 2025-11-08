// 导入 dayjs 中文语言包
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

/**
 * Element Plus 组件库已在各个组件中按需手动导入
 * 无需全局注册，避免打包时包含所有组件
 */

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
