import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取仪器列表 */
  GET_INSTRUMENTS: "/instruments",
  /** 获取我的申请 */
  GET_MY_INSTRUMENT_APPLICATIONS: "/instruments/applications/my",
  /** 申请列表 */
  GET_INSTRUMENT_APPLICATIONS: "/instruments/applications",
  /** 报告仪器故障 */
  REPORT_INSTRUMENT_REPAIR: "/instruments/repairs",
  /** 申请使用仪器 */
  APPLY_INSTRUMENT: "/instruments/apply",
  /** 审核申请 */
  AUDIT_INSTRUMENT_REPAIR: "/instruments/applications/review",
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
 * 创建仪器（老师权限）
 * @param {object} params
 * @returns {Promise<any>}
 */
export function createInstrumentApi(params) {
  return request.post(Api.GET_INSTRUMENTS, params);
}

/**
 * 修改仪器（老师权限）
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function updateInstrumentApi(id, params) {
  return request.patch(`${Api.GET_INSTRUMENTS}/${id}`, params);
}

/**
 * 获取仪器申请列表（老师权限）
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getInstrumentApplicationsApi(params = {}) {
  return request.get(Api.GET_INSTRUMENT_APPLICATIONS, params);
}

/**
 * 获取我的仪器申请列表（学生权限）
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getMyInstrumentApplicationsApi(params = {}) {
  return request.get(Api.GET_MY_INSTRUMENT_APPLICATIONS, params);
}

/**
 * 创建仪器申请
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function createInstrumentApplicationApi(id, params) {
  return request.post(`${Api.APPLY_INSTRUMENT}/${id}`, params);
}

/**
 * 报告仪器故障
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function reportInstrumentRepairApi(id, params) {
  return request.post(`${Api.REPORT_INSTRUMENT_REPAIR}/${id}`, params);
}

/**
 * 审核仪器申请（老师权限）
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function auditInstrumentRepairApi(id, params) {
  return request.post(`${Api.AUDIT_INSTRUMENT_REPAIR}/${id}`, params);
}
