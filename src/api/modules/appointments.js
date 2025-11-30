import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取我的预约列表 */
  GET_MY_APPOINTMENTS: "/appointments/my",
  /** 获取预约列表 */
  GET_APPOINTMENTS: "/appointments",
  /** 获取待审核预约 */
  GET_PENDING_APPOINTMENTS: "/appointments/pending",
  /** 取消预约 */
  CANCEL_APPOINTMENT: "/appointments/cancel",
  /** 审核预约 */
  REVIEW_APPOINTMENT: "/appointments/review",
});

/**
 * 获取我的预约列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getMyAppointmentsApi(params = {}) {
  return request.get(Api.GET_MY_APPOINTMENTS, params);
}

/**
 * 获取预约列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getAppointmentsApi(params = {}) {
  return request.get(Api.GET_APPOINTMENTS, params);
}

/**
 * 获取待审核预约（教师权限）
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getPendingAppointmentsApi(params = {}) {
  return request.get(Api.GET_PENDING_APPOINTMENTS, params);
}

/**
 * 获取预约详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getAppointmentDetailApi(id) {
  return request.get(`${Api.GET_APPOINTMENTS}/${id}`);
}

/**
 * 创建预约
 * @param {object} params
 * @returns {Promise<any>}
 */
export function createAppointmentApi(params) {
  return request.post(Api.GET_APPOINTMENTS, params);
}

/**
 * 更新预约
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function updateAppointmentApi(id, params) {
  return request.put(`${Api.GET_APPOINTMENTS}/${id}`, params);
}

/**
 * 审核预约（教师权限）
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function reviewAppointmentApi(id, params) {
  return request.put(`${Api.REVIEW_APPOINTMENT}/${id}`, params);
}

/**
 * 取消预约
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function cancelAppointmentApi(id) {
  return request.patch(`${Api.CANCEL_APPOINTMENT}/${id}`);
}

/**
 * 删除预约
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteAppointmentApi(id) {
  return request.delete(`${Api.GET_APPOINTMENTS}/${id}`);
}
