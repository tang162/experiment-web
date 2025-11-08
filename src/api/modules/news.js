import { request } from "@/utils";

export const newsApi = {
  /**
   * 获取资讯列表
   * @param {object} params
   * @returns {Promise<any>}
   */
  getNewsList(params = {}) {
    return request.get("/api/news", params);
  },

  /**
   * 获取资讯详情
   * @param {number|string} id
   * @returns {Promise<any>}
   */
  getNewsDetail(id) {
    return request.get(`/api/news/${id}`);
  },

  /**
   * 切换资讯点赞
   * @param {number|string} id
   * @returns {Promise<any>}
   */
  toggleLike(id) {
    return request.post(`/api/news/${id}/like`);
  },

  /**
   * 切换资讯收藏
   * @param {number|string} id
   * @returns {Promise<any>}
   */
  toggleFavorite(id) {
    return request.post(`/api/news/${id}/favorite`);
  },
};
