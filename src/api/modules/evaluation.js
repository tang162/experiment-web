import { request } from "@/utils";

const Api = Object.freeze({
  /** 评价列表 */
  EVALUATIONS: "/evaluations",
  /** 实验室评论 */
  LAB_EVALUATIONS: "/evaluations/lab",
  /** 仪器评价 */
  INSTRUMENT_EVALUATIONS: "/evaluations/instrument",
  /** 预约评论 */
  APPOINTMENT_EVALUATION: "/evaluations/appointment",
  /** 仪器申请评价 */
  INSTRUMENT_APPLICATION_EVALUATION: "/evaluations/instrument-application",
});

// ==================== 通用 ====================

/**
 * 获取评价列表
 * @param {object} params - { type?: 0|1 } 0-实验室评论 1-仪器评价
 * @returns {Promise<any>}
 */
export function getEvaluationsApi(params) {
  return request.get(Api.EVALUATIONS, params);
}

/**
 * 删除评价（只能删除自己的）
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteEvaluationApi(id) {
  return request.delete(`${Api.EVALUATIONS}/${id}`);
}

// ==================== 实验室评论 ====================

/**
 * 创建实验室评论（需要预约审核通过）
 * @param {FormData} formData - appointmentId, overallRating, equipmentRating?, environmentRating?, serviceRating?, comment?, images[]
 * @returns {Promise<any>}
 */
export function createLabEvaluationApi(formData) {
  return request.upload(Api.LAB_EVALUATIONS, formData);
}

/**
 * 获取实验室评论列表
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

/**
 * 根据预约ID获取评论
 * @param {number|string} appointmentId
 * @returns {Promise<any>}
 */
export function getEvaluationByAppointmentApi(appointmentId) {
  return request.get(`${Api.APPOINTMENT_EVALUATION}/${appointmentId}`);
}

// ==================== 仪器评价 ====================

/**
 * 创建仪器评价（需要申请审核通过）
 * @param {FormData} formData - instrumentApplicationId, overallRating, serviceRating?, comment?, images[]
 * @returns {Promise<any>}
 */
export function createInstrumentEvaluationApi(formData) {
  return request.upload(Api.INSTRUMENT_EVALUATIONS, formData);
}

/**
 * 获取仪器评价列表
 * @param {number|string} instrumentId
 * @returns {Promise<any>}
 */
export function getInstrumentEvaluationsApi(instrumentId) {
  return request.get(`${Api.INSTRUMENT_EVALUATIONS}/${instrumentId}`);
}

/**
 * 获取仪器评价统计
 * @param {number|string} instrumentId
 * @returns {Promise<any>}
 */
export function getInstrumentEvaluationStatisticsApi(instrumentId) {
  return request.get(`${Api.INSTRUMENT_EVALUATIONS}/${instrumentId}/statistics`);
}

/**
 * 根据仪器申请ID获取评价
 * @param {number|string} applicationId
 * @returns {Promise<any>}
 */
export function getEvaluationByInstrumentApplicationApi(applicationId) {
  return request.get(`${Api.INSTRUMENT_APPLICATION_EVALUATION}/${applicationId}`);
}

/**
 * 创建评价（通用别名，指向实验室评论）
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export const createEvaluationApi = createLabEvaluationApi;
