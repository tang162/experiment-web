/**
 * 自定义本地存储类型定义
 */

// 存储项的值结构
export interface StorageItemValue<T = any> {
  value: T;
  expireTime: string | number; // 过期时间，支持时间戳或ISO字符串
}

// 完整的存储结构 - 使用Record类型更明确
export interface StorageData
  extends Record<string, StorageItemValue | string | number> {
  expireTime: string | number; // 整个存储的过期时间
}

// 存储配置选项
export interface StorageOptions {
  // 默认过期时间（毫秒）
  defaultExpireTime?: number;
  // 存储类型
  storageType?: "localStorage" | "sessionStorage";
  // 是否自动清理过期数据
  autoCleanup?: boolean;
  // 清理间隔（毫秒）
  cleanupInterval?: number;
  // 存储前缀
  prefix?: string;
  // 是否启用压缩
  compress?: boolean;
  // 最大存储大小（字节）
  maxSize?: number;
}

// 存储操作结果
export interface StorageResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  expired?: boolean;
}

// 批量操作的项
export interface BatchStorageItem<T = any> {
  key: string;
  storageKey: string;
  value: T;
  expireTime?: number;
}

// 存储统计信息
export interface StorageStats {
  totalKeys: number;
  totalStorageKeys: number;
  totalSize: number;
  expiredKeys: number;
  validKeys: number;
}

// 存储事件类型
export type StorageEventType = "set" | "get" | "remove" | "clear" | "expire";

// 存储事件数据
export interface StorageEvent<T = any> {
  type: StorageEventType;
  key?: string;
  storageKey?: string;
  value?: T;
  timestamp: number;
}

// 存储监听器
export interface StorageListener<T = any> {
  (event: StorageEvent<T>): void;
}

// 存储查询条件
export interface StorageQuery {
  // 按键名模糊匹配
  keyPattern?: string;
  // 按存储键模糊匹配
  storageKeyPattern?: string;
  // 只返回未过期的数据
  onlyValid?: boolean;
  // 限制返回数量
  limit?: number;
  // 排序方式
  sortBy?: "key" | "storageKey" | "expireTime" | "createTime";
  // 排序方向
  sortOrder?: "asc" | "desc";
}

// 存储导出/导入格式
export interface StorageExportData {
  version: string;
  timestamp: number;
  data: Record<string, StorageData>;
}

// 存储迁移配置
export interface StorageMigration {
  version: string;
  migrate: (data: any) => StorageData;
}
