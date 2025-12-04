import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取仪器列表 */
  GET_INSTRUMENTS: "/instruments",
  /** 获取仪器下拉列表 */
  GET_INSTRUMENTS_OPTIONS: "/instruments/options",
  /** 获取我的申请 */
  GET_MY_INSTRUMENT_APPLICATIONS: "/instrument-applications/my",
  /** 申请列表 */
  GET_INSTRUMENT_APPLICATIONS: "/instrument-applications",
  /** 申请使用仪器 */
  APPLY_INSTRUMENT: "/instrument-applications/apply",
  /** 审核申请 */
  REVIEW_INSTRUMENT_APPLICATION: "/instrument-applications",
});

/**
 * 获取仪器列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getInstrumentsApi(params = {}) {
  return request.get(Api.GET_INSTRUMENTS, params);
}

/**
 * 获取仪器详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getInstrumentDetailApi(id) {
  return request.get(`${Api.GET_INSTRUMENTS}/${id}`);
}

/**
 * 获取仪器下拉列表（仅返回 id 和 name）
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getInstrumentsOptionsApi(params = {}) {
  return request.get(Api.GET_INSTRUMENTS_OPTIONS, params);
}

/**
 * 创建仪器（教师权限）
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function createInstrumentApi(formData) {
  return request.post(Api.GET_INSTRUMENTS, formData);
}

/**
 * 更新仪器（教师权限）
 * @param {number|string} id
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function updateInstrumentApi(id, formData) {
  return request.post(`${Api.GET_INSTRUMENTS}/${id}`, formData);
}

/**
 * 删除仪器（教师权限）
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteInstrumentApi(id) {
  return request.delete(`${Api.GET_INSTRUMENTS}/${id}`);
}

/**
 * 获取仪器申请列表（教师权限）
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getInstrumentApplicationsApi(params = {}) {
  return request.get(Api.GET_INSTRUMENT_APPLICATIONS, params);
}

/**
 * 获取我的仪器申请列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getMyInstrumentApplicationsApi(params = {}) {
  return request.get(Api.GET_MY_INSTRUMENT_APPLICATIONS, params);
}

/**
 * 申请使用仪器
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function applyInstrumentApi(id, params) {
  return request.post(`${Api.APPLY_INSTRUMENT}/${id}`, params);
}

/**
 * 审核仪器申请（教师权限）
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function reviewInstrumentApplicationApi(id, params) {
  return request.post(`${Api.REVIEW_INSTRUMENT_APPLICATION}/${id}`, params);
}

/**
 * 取消仪器申请
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function cancelInstrumentApplicationApi(id) {
  return request.delete(`${Api.GET_INSTRUMENT_APPLICATIONS}/${id}`);
}

/**
 * 归还仪器
 * @param {number|string} id - 申请ID
 * @returns {Promise<any>}
 */
export function returnInstrumentApi(id) {
  return request.post(`${Api.GET_INSTRUMENT_APPLICATIONS}/${id}/return`);
}
