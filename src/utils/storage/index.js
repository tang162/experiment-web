/**
 * 自定义本地存储工具类
 * 支持统一主键存储格式：所有数据存储在一个主键下，内部按照不同键组织
 * 存储格式：MAIN_KEY: { 存储键: { value: "存储值", expireTime: "过期时间" }, expireTime: "过期时间" }
 */


import {
  DEFAULT_STORAGE_OPTIONS,
  ERROR_MESSAGES,
  SIZE_LIMITS,
  getCurrentTimestamp,
  isExpired,
  calculateDataSize,
  checkStorageSupport,
  getStorageObject,
  safeJSONParse,
  safeJSONStringify,
  getMainStorageKey,
} from "./config";

/**
 * 自定义存储类
 */
class CustomStorage {
  private option;
  private storage;
  private listeners = new Set();
  private cleanupTimer;
  private readonly MAIN_STORAGE_KEY; // 统一的主存储键

  constructor(option = {}) {
    this.option = { ...DEFAULT_STORAGE_OPTIONS, ...option };

    // 设置统一的主存储键（从环境变量读取）
    this.MAIN_STORAGE_KEY = this.option.prefix + getMainStorageKey();

    // 检查存储支持
    if (!checkStorageSupport(this.option.storageType)) {
      throw new Error(ERROR_MESSAGES.STORAGE_NOT_SUPPORTED);
    }

    this.storage = getStorageObject(this.option.storageType);

    // 启动自动清理
    if (this.option.autoCleanup) {
      this.startAutoCleanup();
    }

    // console.log(
    //   "🗄️ 自定义存储初始化成功，使用统一主键:",
    //   this.MAIN_STORAGE_KEY,
    // );
  }

  /**
   * 设置存储数据
   * @param storageKey 存储键（原来的key参数，现在作为存储键）
   * @param value 存储值
   * @param expireTime 过期时间（毫秒时间戳）
   */
  set(
    storageKey,
    value,
    expireTime,
  ) {
    return new Promise((resolve) => {
      try {
        // 参数验证
        if (!this.validateStorageKey(storageKey)) {
          resolve({
            success: false,
            error: ERROR_MESSAGES.INVALID_STORAGE_KEY,
          });
          return;
        }

        // 计算过期时间
        const finalExpireTime =
          expireTime || getCurrentTimestamp() + this.option.defaultExpireTime;

        // 获取现有的统一存储数据
        const existingData = this.getUnifiedStorageData();

        // 构建新的存储结构
        const storageData = {
          ...existingData,
          [storageKey]: {
            value,
            expireTime: finalExpireTime,
          },
          expireTime: finalExpireTime,
        };

        // 检查存储大小
        const dataSize = calculateDataSize(storageData);
        if (dataSize > SIZE_LIMITS.MAX_VALUE_SIZE) {
          resolve({ success: false, error: ERROR_MESSAGES.STORAGE_FULL });
          return;
        }

        // 使用 setTimeout 模拟异步存储操作，确保存储完成后再 resolve

        try {
          // 存储数据到统一主键
          this.storage.setItem(
            this.MAIN_STORAGE_KEY,
            safeJSONStringify(storageData),
          );

          // 触发事件
          this.emitEvent({
            type: "set",
            key: this.MAIN_STORAGE_KEY,
            storageKey,
            value,
            timestamp: getCurrentTimestamp(),
          });

          console.log(`💾 存储成功: ${storageKey} -> 统一主键`);
          resolve({ success: true, data: value });
        } catch (error) {
          console.error("❌ 存储失败:", error);
          resolve({ success: false, error: error.message });
        }
      } catch (error) {
        console.error("❌ 存储失败:", error);
        resolve({ success: false, error: error.message });
      }
    });
  }

  /**
   * 获取统一存储数据
   */
  private getUnifiedStorageData() {
    const rawData = this.storage.getItem(this.MAIN_STORAGE_KEY);
    if (!rawData) {
      return {
        expireTime: getCurrentTimestamp() + this.option.defaultExpireTime,
      };
    }

    return safeJSONParse(rawData, {
      expireTime: getCurrentTimestamp() + this.option.defaultExpireTime,
    });
  }

  /**
   * 获取存储数据
   * @param storageKey 存储键
   */
  get(storageKey) {
    try {
      // 参数验证
      if (!this.validateStorageKey(storageKey)) {
        return { success: false, error: ERROR_MESSAGES.INVALID_STORAGE_KEY };
      }

      // 获取统一存储数据
      const storageData = this.getUnifiedStorageData();

      // 检查存储键是否存在
      if (!storageData[storageKey]) {
        return { success: false, error: "存储键不存在" };
      }

      const item = storageData[storageKey];

      // 类型检查：确保是StorageItemValue类型
      if (typeof item === "string" || typeof item === "number") {
        return { success: false, error: "存储数据格式错误" };
      }

      const storageItem = item;

      // 检查是否过期
      if (isExpired(storageItem.expireTime)) {
        // 删除过期数据
        this.remove(storageKey);
        return {
          success: false,
          error: ERROR_MESSAGES.EXPIRED_DATA,
          expired: true,
        };
      }

      // 触发事件
      this.emitEvent({
        type: "get",
        key: this.MAIN_STORAGE_KEY,
        storageKey,
        value: storageItem.value,
        timestamp: getCurrentTimestamp(),
      });

      return { success: true, data: storageItem.value };
    } catch (error) {
      console.error("❌ 获取数据失败:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 删除存储数据
   * @param storageKey 存储键（可选，不传则清空所有数据）
   */
  remove(storageKey) {
    try {
      if (!storageKey) {
        // 删除整个统一存储
        this.storage.removeItem(this.MAIN_STORAGE_KEY);
        this.emitEvent({
          type: "remove",
          key: this.MAIN_STORAGE_KEY,
          timestamp: getCurrentTimestamp(),
        });
        console.log(`🗑️ 删除整个统一存储`);
        return { success: true, data: true };
      }

      // 删除特定的存储键
      const storageData = this.getUnifiedStorageData();

      if (storageData[storageKey]) {
        delete storageData[storageKey];

        // 如果没有其他存储键了，删除整个统一存储
        const remainingKeys = Object.keys(storageData).filter(
          (k) => k !== "expireTime",
        );
        if (remainingKeys.length === 0) {
          this.storage.removeItem(this.MAIN_STORAGE_KEY);
        } else {
          this.storage.setItem(
            this.MAIN_STORAGE_KEY,
            safeJSONStringify(storageData),
          );
        }

        this.emitEvent({
          type: "remove",
          key: this.MAIN_STORAGE_KEY,
          storageKey,
          timestamp: getCurrentTimestamp(),
        });

        console.log(`🗑️ 删除存储键: ${storageKey}`);
        return { success: true, data: true };
      }

      return { success: false, error: "存储键不存在" };
    } catch (error) {
      console.error("❌ 删除数据失败:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 验证存储键
   */
  private validateStorageKey(storageKey) {
    return (
      typeof storageKey === "string" &&
      storageKey.length > 0 &&
      storageKey.length <= SIZE_LIMITS.MAX_STORAGE_KEY_LENGTH &&
      storageKey !== "expireTime"
    ); // 保留字段
  }

  /**
   * 触发事件
   */
  private emitEvent(event) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("存储事件监听器错误:", error);
      }
    });
  }

  /**
   * 启动自动清理
   */
  private startAutoCleanup() {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, this.option.cleanupInterval);
  }

  /**
   * 检查存储键是否存在
   */
  has(storageKey) {
    const result = this.get(storageKey);
    return result.success;
  }

  /**
   * 获取所有存储键
   */
  getKeys() {
    try {
      const storageData = this.getUnifiedStorageData();
      return Object.keys(storageData).filter((k) => k !== "expireTime");
    } catch {
      return [];
    }
  }

  /**
   * 获取所有主键（现在只返回统一主键）
   */
  getAllKeys() {
    // 检查统一主键是否存在
    const exists = this.storage.getItem(this.MAIN_STORAGE_KEY);
    return exists ? [this.MAIN_STORAGE_KEY] : [];
  }

  /**
   * 批量设置数据
   */
  async setBatch(
    items: { storageKey; value; expireTime?}[],
  ) {
    try {
      const results[] = [];

      for (const item of items) {
        const result = await this.set(
          item.storageKey,
          item.value,
          item.expireTime,
        );
        results.push(result.success);
      }

      const allSuccess = results.every((r) => r);
      return {
        success: allSuccess,
        data: allSuccess,
        error: allSuccess ? undefined : "部分批量操作失败",
      };
    } catch (error) {
      console.error("❌ 批量存储失败:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 批量获取数据
   */
  getBatch(storageKeys) {
    const results[] = [];

    for (const storageKey of storageKeys) {
      const result = this.get < T > (storageKey);
      if (result.success && result.data !== undefined) {
        results.push(result.data);
      }
    }

    return { success: true, data: results };
  }

  /**
   * 清理过期数据
   */
  cleanup() {
    let cleanedCount = 0;

    try {
      // 获取统一存储数据
      const storageData = this.getUnifiedStorageData();
      let hasChanges = false;

      // 检查整体过期时间
      if (isExpired(storageData.expireTime)) {
        this.storage.removeItem(this.MAIN_STORAGE_KEY);
        cleanedCount++;
        console.log(`🧹 清理完成，删除了整个统一存储（已过期）`);
        return { success: true, data: cleanedCount };
      }

      // 检查各个存储键的过期时间
      for (const [storageKey, item] of Object.entries(storageData)) {
        if (
          storageKey !== "expireTime" &&
          typeof item === "object" &&
          item !== null &&
          "expireTime" in item &&
          isExpired((item).expireTime)
        ) {
          delete storageData[storageKey];
          hasChanges = true;
          cleanedCount++;
        }
      }

      // 如果有变化，更新存储
      if (hasChanges) {
        const remainingKeys = Object.keys(storageData).filter(
          (k) => k !== "expireTime",
        );
        if (remainingKeys.length === 0) {
          this.storage.removeItem(this.MAIN_STORAGE_KEY);
        } else {
          this.storage.setItem(
            this.MAIN_STORAGE_KEY,
            safeJSONStringify(storageData),
          );
        }
      }

      console.log(`🧹 清理完成，删除了 ${cleanedCount} 个过期项`);
      return { success: true, data: cleanedCount };
    } catch (error) {
      console.error("❌ 清理失败:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 清空所有数据
   */
  clear() {
    try {
      // 删除统一存储
      this.storage.removeItem(this.MAIN_STORAGE_KEY);

      this.emitEvent({
        type: "clear",
        timestamp: getCurrentTimestamp(),
      });

      console.log("🗑️ 已清空统一存储数据");
      return { success: true, data: true };
    } catch (error) {
      console.error("❌ 清空失败:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取存储统计信息
   */
  getStats() {
    let totalKeys = 1; // 统一主键
    let totalStorageKeys = 0;
    let totalSize = 0;
    let expiredKeys = 0;
    let validKeys = 0;

    try {
      const rawData = this.storage.getItem(this.MAIN_STORAGE_KEY);

      if (rawData) {
        totalSize = rawData.length;
        const storageData = safeJSONParse(rawData, {
          expireTime: 0,
        });

        // 检查整体是否过期
        if (isExpired(storageData.expireTime)) {
          expiredKeys = 1;
          validKeys = 0;
        } else {
          expiredKeys = 0;
          validKeys = 1;
        }

        // 统计存储键数量
        const storageKeys = Object.keys(storageData).filter(
          (k) => k !== "expireTime",
        );
        totalStorageKeys = storageKeys.length;
      } else {
        totalKeys = 0;
      }
    } catch (error) {
      console.error("获取统计信息失败:", error);
    }

    return {
      totalKeys,
      totalStorageKeys,
      totalSize,
      expiredKeys,
      validKeys,
    };
  }

  /**
   * 添加事件监听器
   */
  addEventListener(listener) {
    this.listeners.add(listener);
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(listener) {
    this.listeners.delete(listener);
  }

  /**
   * 销毁存储实例
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }

    this.listeners.clear();
    console.log("🗄️ 存储实例已销毁");
  }
}

// 创建默认存储实例
const defaultStorage = new CustomStorage();

// 导出便捷方法（更新为新的API）
export const setStorage = defaultStorage.set.bind(defaultStorage);
export const getStorage = defaultStorage.get.bind(defaultStorage);
export const removeStorage = defaultStorage.remove.bind(defaultStorage);
export const hasStorage = defaultStorage.has.bind(defaultStorage);
export const clearStorage = defaultStorage.clear.bind(defaultStorage);
export const getStorageKeys = defaultStorage.getKeys.bind(defaultStorage);
export const getAllStorageKeys = defaultStorage.getAllKeys.bind(defaultStorage);
export const getStorageStats = defaultStorage.getStats.bind(defaultStorage);
export const cleanupStorage = defaultStorage.cleanup.bind(defaultStorage);
export const setBatchStorage = defaultStorage.setBatch.bind(defaultStorage);
export const getBatchStorage = defaultStorage.getBatch.bind(defaultStorage);


// 默认导出
export default defaultStorage;
