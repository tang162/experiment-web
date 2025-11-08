import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取实验室列表 */
  GET_LABS: "/labs",
  /** 获取实验室下拉列表 */
  GET_LABS_DROPDOWN: "/labs/dropdown",
});

/**
 * 获取实验室下拉列表
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getLabsDropdownApi(params) {
  return request.get(Api.GET_LABS_DROPDOWN, params);
}

/**
 * 获取实验室列表
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getLabsApi(params) {
  return request.get(Api.GET_LABS, params);
}

/**
 * 获取实验室详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getLabDetailApi(id) {
  return request.get(`${Api.GET_LABS}/${id}`);
}

/**
 * 创建实验室
 * @param {object} params
 * @returns {Promise<any>}
 */
export function createLabApi(params) {
  return request.post(Api.GET_LABS, params);
}

/**
 * 更新实验室
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function updateLabApi(id, params) {
  return request.put(`${Api.GET_LABS}/${id}`, params);
}

/**
 * 删除实验室
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteLabApi(id) {
  return request.delete(`${Api.GET_LABS}/${id}`);
}
