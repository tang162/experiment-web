import { request } from "@/utils";

const Api = Object.freeze({
  /** 维修记录 */
  REPAIRS: "/repairs",
  /** 我的维修记录 */
  MY_REPAIRS: "/repairs/my",
  /** 报告仪器故障 */
  REPORT_REPAIR: "/repairs/instruments",
  /** 更新维修状态 */
  UPDATE_REPAIR_STATUS: "/repairs/update",
});

/**
 * 获取我的维修记录
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getMyRepairsApi(params) {
  return request.get(Api.MY_REPAIRS, params);
}

/**
 * 报告仪器故障
 * @param {number|string} instrumentId
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function reportInstrumentFaultApi(instrumentId, formData) {
  return request.post(`${Api.REPORT_REPAIR}/${instrumentId}`, formData);
}

/**
 * 取消报修
 * @param {number|string} id - 报修ID
 * @returns {Promise<any>}
 */
export function cancelRepairApi(id) {
  return request.delete(`${Api.REPAIRS}/${id}`);
}
