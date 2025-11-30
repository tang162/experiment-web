import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取实验室列表 */
  GET_LABS: "/labs",
  /** 获取实验室下拉列表 */
  GET_LABS_OPTIONS: "/labs/options",
  /** 获取热门实验室 */
  GET_POPULAR_LABS: "/labs/popular",
});

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
 * 获取热门实验室
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getPopularLabsApi(params) {
  return request.get(Api.GET_POPULAR_LABS, params);
}

/**
 * 获取实验室下拉列表（仅返回 id 和 name）
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getLabsOptionsApi(params) {
  return request.get(Api.GET_LABS_OPTIONS, params);
}

/**
 * 创建实验室（教师权限）
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function createLabApi(formData) {
  return request.post(Api.GET_LABS, formData);
}

/**
 * 更新实验室（教师权限）
 * @param {number|string} id
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function updateLabApi(id, formData) {
  return request.post(`${Api.GET_LABS}/${id}`, formData);
}

/**
 * 删除实验室（教师权限）
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteLabApi(id) {
  return request.delete(`${Api.GET_LABS}/${id}`);
}
