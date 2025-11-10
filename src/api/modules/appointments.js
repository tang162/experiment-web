import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取我的预约列表 */
  GET_MY_APPOINTMENTS: "/appointments/my",
  /** 获取预约列表 */
  GET_APPOINTMENTS: "/appointments",
  /** 取消预约 */
  CANCEL_APPOINTMENT: "/appointments/cancel",
});

/**
 * 获取我的预约列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getAppointmentsApi(params = {}) {
  return request.get(Api.GET_MY_APPOINTMENTS, params);
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
 * 取消预约
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function cancelAppointmentApi(id) {
  return request.patch(`${Api.CANCEL_APPOINTMENT}/${id}`);
}
