import { request } from "@/utils";

const Api = Object.freeze({
  /** 反馈列表 */
  FEEDBACKS: "/feedbacks",
});

/**
 * 获取反馈列表
 * @param {object} [params] - { labId, status, page, pageSize }
 * @returns {Promise<any>}
 */
export function getFeedbacksApi(params = {}) {
  return request.get(Api.FEEDBACKS, params);
}

/**
 * 获取反馈详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getFeedbackDetailApi(id) {
  return request.get(`${Api.FEEDBACKS}/${id}`);
}

/**
 * 创建反馈
 * @param {object} params - { appointmentId, title, content }
 * @returns {Promise<any>}
 */
export function createFeedbackApi(params) {
  return request.post(Api.FEEDBACKS, params);
}

/**
 * 回复反馈
 * @param {number|string} id
 * @param {object} params - { content }
 * @returns {Promise<any>}
 */
export function replyFeedbackApi(id, params) {
  return request.post(`${Api.FEEDBACKS}/${id}/reply`, params);
}

/**
 * 关闭反馈
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function closeFeedbackApi(id) {
  return request.patch(`${Api.FEEDBACKS}/${id}/close`);
}
