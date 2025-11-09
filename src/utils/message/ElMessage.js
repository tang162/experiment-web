/**
 * Element Plus 消息与弹窗统一封装（函数式版）
 */

import {
  ElMessage,
  ElMessageBox,

} from "element-plus";



const defaultMessageConfig = {
  duration: 3000,
  showClose: false,
};

const defaultConfirmConfig = {
  title: "提示",
  confirmButtonText: "确定",
  cancelButtonText: "取消",
  type: "warning",
};

/**
 * 通用消息提示
 */
export function showMessage(
  message,
  type = "info",
  config = {}
) {
  const options = {
    ...defaultMessageConfig,
    ...config,
    message,
    type,
  };
  return ElMessage(options);
}

/** 成功消息 */
export function showSuccess(message, config = {}) {
  return showMessage(message, "success", config);
}

/** 错误消息 */
export function showError(message, config = {}) {
  return showMessage(message, "error", config);
}

/** 警告消息 */
export function showWarning(message, config = {}) {
  return showMessage(message, "warning", config);
}

/** 信息消息 */
export function showInfo(message, config = {}) {
  return showMessage(message, "info", config);
}

/**
 * 确认弹窗
 */
export async function showConfirm(
  message,
  config = {}
) {
  try {
    const options = { ...defaultConfirmConfig, ...config };
    await ElMessageBox.confirm(message, options.title, options);
    return true;
  } catch {
    return false;
  }
}

/**
 * 提示弹窗（仅确定按钮）
 */
export async function showAlert(
  message,
  config = {}
) {
  const options = {
    ...defaultConfirmConfig,
    ...config,
    showCancelButton: false,
  };
  await ElMessageBox.alert(message, options.title, options);
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
