import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取收藏列表 */
  GET_FAVORITES_APPOINTMENTS: "/favorites/appointments",
});

/**
 * 获取收藏列表
 * @param {object} [params]
 * @returns {Promise<any>}
 */
export async function getFavoritesApi(params = {}) {
  return request.get(Api.GET_FAVORITES_APPOINTMENTS, params);
}

/**
 * 添加 / 取消 收藏
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export async function toggleFavorite(id) {
  return request.post(`${Api.GET_FAVORITES_APPOINTMENTS}/${id}`);
}
