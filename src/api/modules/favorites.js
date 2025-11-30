import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取收藏列表 */
  GET_FAVORITES: "/favorites",
  /** 获取我的收藏实验室 */
  GET_MY_FAVORITES_APPOINTMENTS: "/favorites/appointments",
});

/**
 * 获取收藏列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getFavoritesApi(params = {}) {
  return request.get(Api.GET_FAVORITES, params);
}

/**
 * 获取我的收藏实验室
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export function getMyFavoritesApi(params = {}) {
  return request.get(Api.GET_MY_FAVORITES_APPOINTMENTS, params);
}

/**
 * 切换收藏状态（收藏/取消收藏实验室）
 * @param {number|string} labId
 * @returns {Promise<any>}
 */
export function toggleFavoriteApi(labId) {
  return request.post(`${Api.GET_MY_FAVORITES_APPOINTMENTS}/${labId}`);
}

/**
 * 添加收藏
 * @param {object} params
 * @param {number|string} params.labId 实验室ID
 * @returns {Promise<any>}
 */
export function createFavoriteApi(params) {
  return request.post(Api.GET_FAVORITES, params);
}

/**
 * 删除收藏
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteFavoriteApi(id) {
  return request.delete(`${Api.GET_FAVORITES}/${id}`);
}
