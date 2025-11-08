import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取通知列表 */
  GET_NOTIFICATIONS: "/notifications",
  /** 获取通知未读数量 */
  GET_UNREAD_COUNT: "/notifications/unread-count",
  /** 标记所有通知为已读 */
  MARK_ALL_AS_READ: "/notifications/read-all",
  /** 标记单个通知为已读 */
  MARK_AS_READ: "/notifications/read",
});

/**
 * 获取通知列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getNotificationsApi(params = {}) {
  return request.get(Api.GET_NOTIFICATIONS, params);
}

/**
 * 获取未读通知数量
 * @returns {Promise<any>}
 */
export function getUnreadCountApi() {
  return request.get(Api.GET_UNREAD_COUNT);
}

/**
 * 标记所有通知为已读
 * @returns {Promise<any>}
 */
export function markAllAsReadApi() {
  return request.patch(Api.MARK_ALL_AS_READ);
}

/**
 * 标记单个通知为已读
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function markAsReadApi(id) {
  return request.patch(`${Api.MARK_AS_READ}/${id}`);
}
