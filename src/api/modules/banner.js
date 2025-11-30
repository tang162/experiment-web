import { request } from "@/utils";

const Api = Object.freeze({
  /** 轮播图类型 */
  BANNER_TYPES: "/banners/types",
  /** 轮播图 */
  BANNERS: "/banners",
});

/**
 * 获取轮播图类型列表
 * @returns {Promise<any>}
 */
export function getBannerTypesApi() {
  return request.get(Api.BANNER_TYPES);
}

/**
 * 获取轮播图类型详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getBannerTypeDetailApi(id) {
  return request.get(`${Api.BANNER_TYPES}/${id}`);
}

/**
 * 获取轮播图列表
 * @param {object} params
 * @param {number} params.typeId 轮播图类型ID
 * @returns {Promise<any>}
 */
export function getBannersApi(params) {
  return request.get(Api.BANNERS, params);
}

/**
 * 获取轮播图详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getBannerDetailApi(id) {
  return request.get(`${Api.BANNERS}/${id}`);
}

// 兼容旧的导出方式
export const bannerApi = {
  getBanners(limit = 5) {
    return getBannersApi({ limit });
  },
};
