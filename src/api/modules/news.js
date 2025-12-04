import { request } from "@/utils";

const Api = Object.freeze({
  /** 新闻 */
  NEWS: "/news",
  /** 点赞新闻 */
  LIKE_NEWS: "/news/like",
  /** 审核新闻 */
  REVIEW_NEWS: "/news/review",
  /** 我的点赞 */
  MY_LIKES: "/news/my/likes",
  /** 我的收藏 */
  MY_FAVORITES: "/news/my/favorites",
});

/**
 * 获取新闻列表
 * @param {object} params
 * @returns {Promise<any>}
 */
export function getNewsListApi(params = {}) {
  return request.get(Api.NEWS, params);
}

/**
 * 获取新闻详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getNewsDetailApi(id) {
  return request.get(`${Api.NEWS}/${id}`);
}

/**
 * 创建新闻（教师权限）
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function createNewsApi(formData) {
  return request.upload(Api.NEWS, formData);
}

/**
 * 更新新闻
 * @param {number|string} id
 * @param {FormData} formData
 * @returns {Promise<any>}
 */
export function updateNewsApi(id, formData) {
  return request.upload(`${Api.NEWS}/${id}`, formData);
}

/**
 * 删除新闻
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteNewsApi(id) {
  return request.delete(`${Api.NEWS}/${id}`);
}

/**
 * 点赞新闻
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function likeNewsApi(id) {
  return request.post(`${Api.LIKE_NEWS}/${id}`);
}

/**
 * 获取我点赞的新闻列表
 * @param {object} params - { page, pageSize }
 * @returns {Promise<any>}
 */
export function getMyNewsLikesApi(params = {}) {
  return request.get(Api.MY_LIKES, params);
}

/**
 * 获取我收藏的新闻列表
 * @param {object} params - { page, pageSize }
 * @returns {Promise<any>}
 */
export function getMyNewsFavoritesApi(params = {}) {
  return request.get(Api.MY_FAVORITES, params);
}

/**
 * 获取我发布的新闻列表
 * @param {object} params - { page, pageSize }
 * @returns {Promise<any>}
 */
export function getMyNewsApi(params = {}) {
  return request.get(`${Api.NEWS}/my`, params);
}


