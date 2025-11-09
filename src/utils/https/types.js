/**
 * HTTP 工具类型定义
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";

// 基础响应接口
export interface BaseResponse {
  code;
  data: T;
  message;
  timestamp?;
  total?;
}

// 分页响应接口
export interface PaginatedResponse extends BaseResponse<T[]> {
  pagination: {
    page;
    pageSize;
    total;
    totalPages;
    hasMore;
  };
}

// 上传进度回调
export interface UploadProgressCallback {
  (progressEvent): void;
}

// 请求配置扩展
export interface HttpRequestConfig extends AxiosRequestConfig {
  /** 是否返回总数 */
  isTotal?;
  // 是否显示加载状态
  showLoading?;
  // 是否显示错误提示
  showError?;
  // 是否自动重试
  retry?;
  // 重试次数
  retryCount?;
  // 重试延迟（毫秒）
  retryDelay?;
  // 是否缓存请求
  cache?;
  // 缓存时间（毫秒）
  cacheTime?;
  // 是否为最后一次重试（内部使用）
  isLastRetry?;
  // 自定义错误处理
  customErrorHandler?: (error) => void;
  // 上传进度回调
  onUploadProgress?: UploadProgressCallback;
  // 下载进度回调
  onDownloadProgress?: (progressEvent) => void;
}

// HTTP 方法类型
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 请求状态
export interface RequestState {
  loading;
  error | null;
data;
}

// 缓存项
export interface CacheItem {
  data;
  timestamp;
  expireTime;
}

// HTTP 错误类型
export interface HttpError {
  code;
  message;
  status?;
  statusText;
  data?;
  noRetry?; // 标记是否不重连
}

// 拦截器配置
export interface InterceptorConfig {
  // 请求拦截器
  request?: {
    onFulfilled?: (config) => any;
    onRejected?: (error) => any;
  };
  // 响应拦截器
  response?: {
    onFulfilled?: (response: AxiosResponse) => any;
    onRejected?: (error) => any;
  };
}

// HTTP 客户端配置
export interface HttpClientConfig {
  // 基础URL
  baseURL;
  // 超时时间
  timeout?;
  // 默认请求头
  headers?: Record<string, string>;
  // 是否启用拦截器
  enableInterceptors?;
  // 拦截器配置
  interceptors?: InterceptorConfig;
  // 是否启用缓存
  enableCache?;
  // 默认缓存时间
  defaultCacheTime?;
  // 是否启用重试
  enableRetry?;
  // 默认重试次数
  defaultRetryCount?;
  // 默认重试延迟
  defaultRetryDelay?;
}

// 文件上传配置
export interface UploadConfig extends HttpRequestConfig {
  // 文件字段名
  fileField;
  // 额外的表单数据
  formData?: Record<string, any>;
  // 支持的文件类型
  acceptTypes;
  // 最大文件大小（字节）
  maxSize?;
}

// 下载配置
export interface DownloadConfig extends HttpRequestConfig {
  // 文件名
  filename;
  // 是否自动下载
  autoDownload?;
}
