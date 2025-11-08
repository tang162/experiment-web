/**
 * HTTP 工具类型定义
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";

// 基础响应接口
export interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp?: number;
  total?: number;
}

// 分页响应接口
export interface PaginatedResponse<T = any> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// 上传进度回调
export interface UploadProgressCallback {
  (progressEvent: any): void;
}

// 请求配置扩展
export interface HttpRequestConfig extends AxiosRequestConfig {
  /** 是否返回总数 */
  isTotal?: boolean;
  // 是否显示加载状态
  showLoading?: boolean;
  // 是否显示错误提示
  showError?: boolean;
  // 是否自动重试
  retry?: boolean;
  // 重试次数
  retryCount?: number;
  // 重试延迟（毫秒）
  retryDelay?: number;
  // 是否缓存请求
  cache?: boolean;
  // 缓存时间（毫秒）
  cacheTime?: number;
  // 是否为最后一次重试（内部使用）
  isLastRetry?: boolean;
  // 自定义错误处理
  customErrorHandler?: (error: any) => void;
  // 上传进度回调
  onUploadProgress?: UploadProgressCallback;
  // 下载进度回调
  onDownloadProgress?: (progressEvent: any) => void;
}

// HTTP 方法类型
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 请求状态
export interface RequestState {
  loading: boolean;
  error: string | null;
  data: any;
}

// 缓存项
export interface CacheItem {
  data: any;
  timestamp: number;
  expireTime: number;
}

// HTTP 错误类型
export interface HttpError {
  code: number;
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  noRetry?: boolean; // 标记是否不重连
}

// 拦截器配置
export interface InterceptorConfig {
  // 请求拦截器
  request?: {
    onFulfilled?: (config: any) => any;
    onRejected?: (error: any) => any;
  };
  // 响应拦截器
  response?: {
    onFulfilled?: (response: AxiosResponse) => any;
    onRejected?: (error: any) => any;
  };
}

// HTTP 客户端配置
export interface HttpClientConfig {
  // 基础URL
  baseURL?: string;
  // 超时时间
  timeout?: number;
  // 默认请求头
  headers?: Record<string, string>;
  // 是否启用拦截器
  enableInterceptors?: boolean;
  // 拦截器配置
  interceptors?: InterceptorConfig;
  // 是否启用缓存
  enableCache?: boolean;
  // 默认缓存时间
  defaultCacheTime?: number;
  // 是否启用重试
  enableRetry?: boolean;
  // 默认重试次数
  defaultRetryCount?: number;
  // 默认重试延迟
  defaultRetryDelay?: number;
}

// 文件上传配置
export interface UploadConfig extends HttpRequestConfig {
  // 文件字段名
  fileField?: string;
  // 额外的表单数据
  formData?: Record<string, any>;
  // 支持的文件类型
  acceptTypes?: string[];
  // 最大文件大小（字节）
  maxSize?: number;
}

// 下载配置
export interface DownloadConfig extends HttpRequestConfig {
  // 文件名
  filename?: string;
  // 是否自动下载
  autoDownload?: boolean;
}
