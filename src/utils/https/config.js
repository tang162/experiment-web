/**
 * HTTP 配置文件
 */


// 默认配置
export const DEFAULT_CONFIG = {
  // 基础URL - 从环境变量或应用设置中获取
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",

  // 请求超时时间（30秒）
  timeout: 30000,

  // 默认请求头
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    // 使用自定义头部代替User-Agent（浏览器不允许设置User-Agent）
    "X-App-Name": "bicycle-app",
    "X-App-Version": "1.0.0",
  },

  // 启用拦截器
  enableInterceptors: true,

  // 启用缓存
  enableCache: true,

  // 默认缓存时间（5分钟）
  defaultCacheTime: 5 * 60 * 1000,

  // 启用重试
  enableRetry: true,

  // 默认重试次数
  defaultRetryCount: 3,

  // 默认重试延迟（1秒）
  defaultRetryDelay: 1000,
};

// 错误状态码映射（保持向后兼容）
export const ERROR_CODE_MAP = {
  400: "请求错误",
  401: "未授权",
  403: "拒绝访问",
  404: "请求资源不存在",
  405: "请求方法未允许",
  408: "请求超时",
  409: "请求冲突",
  422: "验证失败",
  429: "请求超时",
  500: "请求过多",
  502: " 网关错误",
  503: "服务不可用",
  504: "网关超时",
};

// 需要重试的错误状态码
export const RETRY_ERROR_CODES = [408, 429, 500, 502, 503, 504];

// 不需要显示错误提示的状态码
export const SILENT_ERROR_CODES = [401];

// 请求头常量
export const HEADERS = {
  AUTHORIZATION: "Authorization",
  CONTENT_TYPE: "Content-Type",
  ACCEPT: "Accept",
  X_REQUESTED_WITH: "X-Requested-With",
  X_CSRF_TOKEN: "X-CSRF-Token",
  // 自定义应用头部（替代User-Agent）
  X_APP_NAME: "X-App-Name",
  X_APP_VERSION: "X-App-Version",
};

// 内容类型常量
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM: "application/x-www-form-urlencoded",
  MULTIPART: "multipart/form-data",
  TEXT: "text/plain",
  HTML: "text/html",
  XML: "application/xml",
};

// 缓存键前缀
export const CACHE_PREFIX = "http_cache_";

// 最大缓存数量
export const MAX_CACHE_SIZE = 100;

// Token 存储键
export const TOKEN_STORAGE_KEY = "auth_token";

// 刷新Token存储键
export const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

// 环境配置
export const ENV_CONFIG = {
  // 开发环境
  development: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 30000,
    enableCache: true,
    enableRetry: true,
    headers: {},
  },

  // 生产环境
  production: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 15000,
    enableCache: true,
    enableRetry: false,
    headers: {},
  },

  // 测试环境
  test: {
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 20000,
    enableCache: false,
    enableRetry: true,
    headers: {},
  },
};

// 获取当前环境配置
export function getEnvConfig() {
  const env = import.meta.env.MODE || "development";
  return ENV_CONFIG[env] || ENV_CONFIG.development;
}

// 合并配置
export function mergeConfig(
  customConfig = {}
) {
  const envConfig = getEnvConfig();
  return {
    ...DEFAULT_CONFIG,
    ...envConfig,
    ...customConfig,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...envConfig.headers,
      ...customConfig.headers,
    },
  };
}
