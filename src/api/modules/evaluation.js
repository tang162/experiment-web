import { request } from "@/utils";

const Api = Object.freeze({
  /** 评价 */
  EVALUATIONS: "/evaluations",
  /** 实验室评价 */
  LAB_EVALUATIONS: "/evaluations/lab",
});

/**
 * 获取评价列表
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getEvaluationsApi(params) {
  return request.get(Api.EVALUATIONS, params);
}

/**
 * 创建评价
 * @param {object} params
 * @returns {Promise<any>}
 */
export function createEvaluationApi(params) {
  return request.post(Api.EVALUATIONS, params);
}

/**
 * 更新评价
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function updateEvaluationApi(id, params) {
  return request.put(`${Api.EVALUATIONS}/${id}`, params);
}

/**
 * 删除评价
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteEvaluationApi(id) {
  return request.delete(`${Api.EVALUATIONS}/${id}`);
}

/**
 * 获取实验室评价
 * @param {number|string} labId
 * @returns {Promise<any>}
 */
export function getLabEvaluationsApi(labId) {
  return request.get(`${Api.LAB_EVALUATIONS}/${labId}`);
}

/**
 * 获取实验室评价统计
 * @param {number|string} labId
 * @returns {Promise<any>}
 */
export function getLabEvaluationStatisticsApi(labId) {
  return request.get(`${Api.LAB_EVALUATIONS}/${labId}/statistics`);
}
