import { request } from "@/utils";

export const bannerApi = {
  /**
   * 获取轮播图列表
   * @param {number} limit
   * @returns {Promise<any>}
   */
  getBanners(limit = 5) {
    return request.get("/api/banners", { limit });
  },
};
