/**
 * 自定义本地存储配置文件
 */

import type { StorageOptions } from "./types";

// 从环境变量读取配置
const getStoragePrefix = (): string => {
  // 优先使用环境变量，如果没有则使用默认值
  return import.meta.env.VITE_STORAGE_PREFIX || "custom_storage_";
};

const getMainStorageKey = (): string => {
  // 优先使用环境变量，如果没有则使用默认值
  return import.meta.env.VITE_MAIN_STORAGE_KEY || "unified_storage";
};

// 默认配置
export const DEFAULT_STORAGE_OPTIONS: Required<StorageOptions> = {
  // 默认过期时间：7天
  defaultExpireTime: 7 * 24 * 60 * 60 * 1000,

  // 存储类型：localStorage
  storageType: "localStorage",

  // 自动清理过期数据
  autoCleanup: true,

  // 清理间隔：1小时
  cleanupInterval: 60 * 60 * 1000,

  // 存储前缀（从环境变量读取）
  prefix: getStoragePrefix(),

  // 不启用压缩（简化实现）
  compress: false,

  // 最大存储大小：10MB
  maxSize: 10 * 1024 * 1024,
};

// 导出环境变量读取函数
export { getStoragePrefix, getMainStorageKey };

// 存储键常量
export const STORAGE_KEYS = {
  // 元数据键
  METADATA: "__storage_metadata__",
  // 清理时间记录
  LAST_CLEANUP: "__last_cleanup__",
  // 版本信息
  VERSION: "__storage_version__",
} as const;

// 当前存储版本
export const STORAGE_VERSION = "1.0.0";

// 时间格式常量
export const TIME_FORMATS = {
  // ISO字符串格式
  ISO: "iso",
  // 时间戳格式
  TIMESTAMP: "timestamp",
} as const;

// 错误消息常量
export const ERROR_MESSAGES = {
  INVALID_KEY: "无效的存储键",
  INVALID_STORAGE_KEY: "无效的存储子键",
  INVALID_VALUE: "无效的存储值",
  EXPIRED_DATA: "数据已过期",
  STORAGE_FULL: "存储空间已满",
  PARSE_ERROR: "数据解析失败",
  STORAGE_NOT_SUPPORTED: "浏览器不支持本地存储",
  QUOTA_EXCEEDED: "存储配额已超出",
} as const;

// 存储大小限制（字节）
export const SIZE_LIMITS = {
  // 单个值的最大大小：1MB
  MAX_VALUE_SIZE: 1024 * 1024,
  // 单个键的最大长度
  MAX_KEY_LENGTH: 200,
  // 存储键的最大长度
  MAX_STORAGE_KEY_LENGTH: 100,
} as const;

// 清理策略
export const CLEANUP_STRATEGIES = {
  // 立即清理
  IMMEDIATE: "immediate",
  // 延迟清理
  DEFERRED: "deferred",
  // 手动清理
  MANUAL: "manual",
} as const;

// 日志级别
export const LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
} as const;

// 获取当前时间戳
export function getCurrentTimestamp(): number {
  return Date.now();
}

// 获取当前ISO时间字符串
export function getCurrentISOString(): string {
  return new Date().toISOString();
}

// 检查时间是否过期
export function isExpired(expireTime: string | number): boolean {
  const now = getCurrentTimestamp();
  const expire =
    typeof expireTime === "string"
      ? new Date(expireTime).getTime()
      : expireTime;

  return now > expire;
}

// 格式化过期时间
export function formatExpireTime(
  expireTime: number,
  format: "iso" | "timestamp" = "timestamp",
): string | number {
  if (format === "iso") {
    return new Date(expireTime).toISOString();
  }
  return expireTime;
}

// 解析过期时间
export function parseExpireTime(expireTime: string | number): number {
  if (typeof expireTime === "string") {
    return new Date(expireTime).getTime();
  }
  return expireTime;
}

// 计算数据大小（字节）
export function calculateDataSize(data: any): number {
  try {
    return new Blob([JSON.stringify(data)]).size;
  } catch {
    // 降级方案：粗略估算
    return JSON.stringify(data).length * 2;
  }
}

// 生成存储键
export function generateStorageKey(prefix: string, key: string): string {
  return `${prefix}${key}`;
}

// 检查浏览器存储支持
export function checkStorageSupport(
  storageType: "localStorage" | "sessionStorage",
): boolean {
  try {
    const storage = window[storageType];
    const testKey = "__storage_test__";
    storage.setItem(testKey, "test");
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// 获取存储对象
export function getStorageObject(
  storageType: "localStorage" | "sessionStorage",
): Storage {
  return window[storageType];
}

// 安全的JSON解析
export function safeJSONParse<T = any>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

// 安全的JSON字符串化
export function safeJSONStringify(data: any): string {
  try {
    return JSON.stringify(data);
  } catch {
    return "{}";
  }
}
