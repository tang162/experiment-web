/**
 * HTTP 拦截器
 */

import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ERROR_CODE_MAP, SILENT_ERROR_CODES, HEADERS } from "./config";
import type { BaseResponse, HttpError, HttpRequestConfig } from "./types";

import { showMessage, showError } from "@/utils";
import { useAuthStore } from "@/stores";

/**
 * 设置请求拦截器
 */
export function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    async (config) => {
      // 添加时间戳防止缓存
      if (config.method?.toLowerCase() === "get") {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      // 自动添加认证信息 - 从 Pinia store 获取
      try {
        let token = null;

        // 优先从 Pinia store 获取认证信息
        try {
          const userStore = useAuthStore();
          token = userStore.getToken;
        } catch (storeError) {
          console.warn("从用户状态获取认证信息失败，尝试备用方案:", storeError);
        }

        // 添加认证头
        if (token && !config.headers[HEADERS.AUTHORIZATION]) {
          config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("获取认证信息失败:", error);
      }
      // 添加设备信息
      config.headers["X-Device-Type"] = "mobile";
      config.headers["X-Platform"] = "ionic-vue";
      config.headers["X-App-Version"] = "1.0.0";
      // 网络状态检查
      if (!navigator.onLine) {
        return Promise.reject(new Error("网络连接不可用，请检查网络设置"));
      }
      // console.log(
      //   `🚀 发起请求: ${config.method?.toUpperCase()} ${config.url}`,
      //   {
      //     params: config.params,
      //     data: config.data,
      //   },
      // );
      return config;
    },
    (error) => {
      console.error("❌ 请求拦截器错误:", error);
      return Promise.reject(error);
    }
  );
}

/**
 * 设置响应拦截器
 */
export function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    async (response: AxiosResponse<BaseResponse>) => {
      const { data, config } = response;
      // console.log(
      //   `✅ 请求成功: ${config.method?.toUpperCase()} ${config.url}`,
      //   {
      //     status: response.status,
      //     data: data,
      //   }
      // );

      // 统一响应格式处理
      if (data && typeof data === "object") {
        // 如果响应包含标准格式
        if ("code" in data && "message" in data) {
          if (data.code !== 200 && data.code !== 0) {
            if (data.code === 2) {
              // code === 2 时执行 logout 并 throw，但不重连
              const userStore = useAuthStore();
              // 显示错误消息
              if (data.message) {
                showError(data.message);
              }
              // 执行 logout
              await userStore.logout();

              // 创建错误对象并标记为不重连
              const error: HttpError = {
                code: data.code,
                message: data.message,
                data: data.data,
                noRetry: true, // 标记不重连
              };

              // throw 出错误
              throw error;
            } else {
              const error: HttpError = {
                code: data.code,
                message: data.message,
                data: data.data,
              };
              throw error;
            }
          }

          if ((config as HttpRequestConfig).isTotal) {
            return data.data !== undefined
              ? {
                  data: Array.isArray(data) ? [] : data.data,
                  total: data.total,
                }
              : data;
          }
          // 返回业务数据
          return data.data !== undefined ? data.data : data;
        }
      }

      return data;
    },
    async (error: AxiosError<BaseResponse>) => {
      const { response, config } = error;

      console.error(
        `❌ 请求失败: ${config?.method?.toUpperCase()} ${config?.url}`,
        {
          status: response?.status,
          statusText: response?.statusText,
          showMessage,
          data: response?.data,
        }
      );

      // 处理网络错误
      if (!response) {
        const networkError: HttpError = {
          code: -1,
          message: "网络连接不可用，请检查网络设置",
        };
        return Promise.reject(networkError);
      }

      const { status, data } = response;

      // 处理认证错误
      if (status === 401) {
        await handleAuthError();
        const authError: HttpError = {
          code: 401,
          message: data?.message || "认证失效，请重新登录",
          status,
        };
        return Promise.reject(authError);
      }

      // 构造错误对象
      const httpError: HttpError = {
        code: status,
        message: getErrorMessage(status, data),
        status,
        statusText: response.statusText,
        data,
      };

      return Promise.reject(httpError);
    }
  );
}

/**
 * 处理认证错误
 */
async function handleAuthError() {
  try {
    // 清除用户状态管理中的状态（会自动清理相关存储）
    try {
      const userStore = useAuthStore();
      await userStore.logout();
    } catch (storeError) {
      console.warn("清除用户状态失败:", storeError);
    }

    console.log("🔐 认证失效，已清除所有认证信息");

    // 发送自定义事件
    window.dispatchEvent(new CustomEvent("auth:expired"));
  } catch (error) {
    console.error("处理认证错误失败:", error);
  }
}

/**
 * 获取错误消息
 */
function getErrorMessage(status: number, data: any): string {
  // 优先使用服务器返回的错误消息
  if (data && typeof data === "object") {
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (data.msg) return data.msg;
  }

  return ERROR_CODE_MAP[status] || "未知错误";
}

/**
 * 是否应该静默处理错误
 */
export function shouldSilentError(status: number): boolean {
  return SILENT_ERROR_CODES.includes(status);
}
