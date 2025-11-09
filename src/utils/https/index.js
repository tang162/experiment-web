
import axios from "axios";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
  shouldSilentError,
} from "./interceptors";
import {
  mergeConfig,
  CACHE_PREFIX,
  MAX_CACHE_SIZE,
  RETRY_ERROR_CODES,
  getEnvConfig,
} from "./config";


import { showError } from "@/utils";

// 从环境变量获取调试模式
const isDebugMode =
  import.meta.env.VITE_ENABLE_HTTP_DEBUG === "true" ||
  import.meta.env.MODE === "development";


/**
 * HTTP 客户端类
 */
class HttpClient {
  instance;
  config;
  cache = new Map();
  loadingRequests = new Set();
  requestPromises = new Map();

  constructor(config = {}) {
    // 合并环境配置和用户配置
    const envConfig = getEnvConfig();
    this.config = mergeConfig({ ...envConfig, ...config });
    this.instance = this.createInstance();
    this.setupInterceptors();
  }

  /**
   * 创建 Axios 实例
   */
  createInstance() {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    });
  }

  /**
   * 设置拦截器
   */
  setupInterceptors() {
    if (this.config.enableInterceptors) {
      setupRequestInterceptor(this.instance);
      setupResponseInterceptor(this.instance);
    }
  }

  /**
   * 通用请求方法
   */
  async request(config) {
    const mergedConfig = this.mergeRequestConfig(config);
    const cacheKey = this.getCacheKey(mergedConfig);

    // 防止重复请求 - 如果已有相同请求在进行中，直接返回该 Promise
    if (this.requestPromises.has(cacheKey)) {
      return this.requestPromises.get(cacheKey);
    }

    // 创建请求 Promise
    const requestPromise = this.executeRequestWithHandling(
      mergedConfig,
      cacheKey
    );

    this.requestPromises.set(cacheKey, requestPromise);
    this.loadingRequests.add(cacheKey);

    try {
      return await requestPromise;
    } finally {
      // 清理
      this.requestPromises.delete(cacheKey);
      this.loadingRequests.delete(cacheKey);
    }
  }

  /**
   * 执行请求并处理缓存、重试等逻辑
   */
  async executeRequestWithHandling(
    config,
    cacheKey
  ) {
    try {
      const response = await this.executeRequest(config);

      // 缓存响应数据
      if (config.cache) {
        this.setCache(cacheKey, response, config.cacheTime);
      }

      return response;
    } catch (error) {
      // 处理重试
      if (config.retry && this.shouldRetry(error, config)) {
        return this.retryRequest(config, error);
      }

      // 处理错误 - 标记为最后一次尝试（非重试情况）
      const errorConfig = { ...config, isLastRetry: true };
      this.handleError(error, errorConfig);
      throw error;
    }
  }

  /**
   * 执行请求
   */
  async executeRequest(config) {
    // 提取 Axios 原生配置
    const {
      showLoading: _showLoading,
      showError: _showError,
      retry: _retry,
      retryCount: _retryCount,
      retryDelay: _retryDelay,
      cache: _cache,
      cacheTime: _cacheTime,
      customErrorHandler: _customErrorHandler,
      ...axiosConfig
    } = config;

    return this.instance.request(axiosConfig);
  }

  /**
   * 合并请求配置
   */
  mergeRequestConfig(config) {
    return {
      showLoading: true,
      showError: true,
      retry: this.config.enableRetry,
      retryCount: this.config.defaultRetryCount,
      retryDelay: this.config.defaultRetryDelay,
      cacheTime: this.config.defaultCacheTime,
      ...config,
    };
  }

  /**
   * GET 请求
   */
  get(
    url,
    params,
    config
  ) {
    return this.request({
      ...config,
      method: "GET",
      url,
      params, // GET 请求通常用 params 传 query 参数
    });
  }

  /**
   * POST 请求
   */
  post(
    url,
    data,
    config
  ) {
    return this.request({ ...config, method: "POST", url, data });
  }

  /**
   * PUT 请求
   */
  put(
    url,
    data,
    config
  ) {
    return this.request({ ...config, method: "PUT", url, data });
  }

  /**
   * DELETE 请求
   */
  delete(url, config) {
    return this.request({ ...config, method: "DELETE", url });
  }

  /**
   * PATCH 请求
   */
  patch(
    url,
    data,
    config
  ) {
    return this.request({ ...config, method: "PATCH", url, data });
  }

  /**
   * 分页请求
   */
  async paginate(
    url,
    params = {
      page: 1,
      pageSize: 10,
    },
    config
  ) {
    return this.get(url, { ...config, params });
  }

  // 缓存相关方法
  getCacheKey(config) {
    const { method, url, params, data, retryCount } = config;

    // 为重试请求添加重试次数标识，避免与原请求冲突
    const retryFlag =
      retryCount !== undefined &&
        retryCount < (this.config.defaultRetryCount || 3) ?
        `_retry_${retryCount}`
        : "";
    const key = `${method}_${url}_${JSON.stringify(params)}_${JSON.stringify(
      data
    )}${retryFlag}`;
    // 使用 encodeURIComponent 替代 btoa 以支持 Unicode 字符
    return `${CACHE_PREFIX}${encodeURIComponent(key)}`;
  }

  setCache(key, data, cacheTime) {
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expireTime =
      Date.now() + (cacheTime || this.config.defaultCacheTime);
    this.cache.set(key, { data, timestamp: Date.now(), expireTime });
  }

  /**
   * 清除缓存
   */
  clearCache(pattern) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
    console.log("🗑️ HTTP缓存已清除");
  }

  /**
   * 判断是否应该重试
   */
  shouldRetry(error, config) {
    if (!config.retry || (config.retryCount || 0) <= 0) return false;

    // 如果错误标记为不重连，则不重试
    if (error.noRetry) return false;

    // 网络错误或特定状态码才重试
    if (!error.status) return true;
    return RETRY_ERROR_CODES.includes(error.status);
  }

  /**
   * 重试请求
   */
  async retryRequest(
    config,
    _lastError
  ) {
    const retryCount = (config.retryCount || 0) - 1;
    const retryDelay = config.retryDelay || 1000;

    console.log(
      `🔄 重试请求 (剩余${retryCount}次): ${config.method} ${config.url}`
    );

    await new Promise((resolve) => setTimeout(resolve, retryDelay));

    // 创建重试配置，禁用缓存避免冲突
    const retryConfig = {
      ...config,
      retryCount,
      cache: false, // 重试时不使用缓存
      // 标记是否为最后一次重试，用于控制错误提示
      isLastRetry: retryCount <= 0,
    };

    // 直接执行请求，不通过 request 方法避免重复请求检查
    try {
      const response = await this.executeRequest(retryConfig);
      return response;
    } catch (error) {
      // 如果还有重试次数，继续重试
      if (retryCount > 0 && this.shouldRetry(error, retryConfig)) {
        return this.retryRequest(retryConfig, error);
      }
      // 处理错误 - 只有最后一次重试失败时才显示错误提示
      this.handleError(error, retryConfig);
      throw error;
    }
  }

  /**
   * 处理错误
   */
  handleError(error, config) {
    if (config.customErrorHandler) {
      config.customErrorHandler(error);
      return;
    }

    const shouldShowError =
      config.showError &&
      !shouldSilentError(error.status) &&
      (!config.retry || config.isLastRetry);

    if (shouldShowError) {
      console.error("HTTP请求错误:", error.message || "未知错误");
      showError(error.message || "请求失败");
    } else if (config.retry && !config.isLastRetry) {
      // 重试中的错误只记录日志，不显示给用户
      console.warn("HTTP请求重试中:", error.message || "未知错误");
    }
  }

  /**
   * 文件上传
   * @param url 上传地址
   * @param data 包含文件字段的表单数据
   */
  async upload(
    url,
    data,
    config
  ) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item) {
            formData.append(key, item);
          }
        });
      } else {
        if (value) {
          {
            formData.append(key, value);
          }
        }
      }
    });

    const finalConfig = {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config.headers,
      },
    };

    return this.post(url, formData, finalConfig);
  }
  /**
   * 文件下载
   */
  async download(url, config) {
    const response = await this.request({
      ...config,
      url,
      method: "GET",
      responseType: "blob",
    });

    // 自动下载文件
    if (config.autoDownload !== false) {
      const blob = new Blob([response]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = config.filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }

    return response;
  }

  /**
   * 获取实例（用于特殊需求）
   */
  getInstance() {
    return this.instance;
  }
}

// 创建默认实例
export const request = new HttpClient();



