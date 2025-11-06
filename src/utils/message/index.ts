/**
 * Element Plus 消息与弹窗统一封装（函数式版）
 */

import {
  ElMessage,
  ElMessageBox,
  type MessageOptions,
  type MessageParams,
  type ElMessageBoxOptions,
} from "element-plus";

type MessageType = "success" | "warning" | "info" | "error";

interface MessageConfig extends Partial<MessageOptions> {
  duration?: number;
  showClose?: boolean;
}

interface ConfirmConfig extends Partial<ElMessageBoxOptions> {
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: MessageType;
}

const defaultMessageConfig: MessageConfig = {
  duration: 3000,
  showClose: false,
};

const defaultConfirmConfig: ConfirmConfig = {
  title: "提示",
  confirmButtonText: "确定",
  cancelButtonText: "取消",
  type: "warning",
};

/**
 * 通用消息提示
 */
export function showMessage(
  message: string,
  type: MessageType = "info",
  config: MessageConfig = {}
) {
  const options: MessageParams = {
    ...defaultMessageConfig,
    ...config,
    message,
    type,
  };
  return ElMessage(options);
}

/** 成功消息 */
export function showSuccess(message: string, config: MessageConfig = {}) {
  return showMessage(message, "success", config);
}

/** 错误消息 */
export function showError(message: string, config: MessageConfig = {}) {
  return showMessage(message, "error", config);
}

/** 警告消息 */
export function showWarning(message: string, config: MessageConfig = {}) {
  return showMessage(message, "warning", config);
}

/** 信息消息 */
export function showInfo(message: string, config: MessageConfig = {}) {
  return showMessage(message, "info", config);
}

/**
 * 确认弹窗
 */
export async function showConfirm(
  message: string,
  config: ConfirmConfig = {}
): Promise<boolean> {
  try {
    const options = { ...defaultConfirmConfig, ...config };
    await ElMessageBox.confirm(message, options.title!, options);
    return true;
  } catch {
    return false;
  }
}

/**
 * 提示弹窗（仅确定按钮）
 */
export async function showAlert(
  message: string,
  config: Omit<ConfirmConfig, "showCancelButton"> = {}
): Promise<void> {
  const options = {
    ...defaultConfirmConfig,
    ...config,
    showCancelButton: false,
  };
  await ElMessageBox.alert(message, options.title!, options);
}

/**
 * 关闭所有消息提示
 */
export function closeAllMessages() {
  ElMessage.closeAll();
}

/**
 * 默认导出集合对象（支持解构与整体导入两种用法）
 */
export default {
  showMessage,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showConfirm,
  showAlert,
  closeAllMessages,
};
