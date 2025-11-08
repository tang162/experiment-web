import { request } from "@/utils";

export const equipmentApi = {
  /**
   * 获取仪器设备列表
   * @param {object} params
   * @returns {Promise<any>}
   */
  getEquipmentList(params = {}) {
    return request.get("/api/equipment", params);
  },

  /**
   * 获取仪器设备详情
   * @param {number|string} id
   * @returns {Promise<any>}
   */
  getEquipmentDetail(id) {
    return request.get(`/api/equipment/${id}`);
  },

  /**
   * 创建借用申请
   * @param {object} data
   * @returns {Promise<any>}
   */
  createApplication(data) {
    return request.post("/api/equipment/applications", data);
  },

  /**
   * 获取我的借用申请
   * @param {object} params
   * @returns {Promise<any>}
   */
  getMyApplications(params = {}) {
    return request.get("/api/equipment/applications/my", params);
  },

  /**
   * 获取待处理的借用申请
   * @param {object} params
   * @returns {Promise<any>}
   */
  getPendingApplications(params = {}) {
    return request.get("/api/equipment/applications/pending", params);
  },

  /**
   * 审批通过申请
   * @param {number|string} id
   * @returns {Promise<any>}
   */
  approveApplication(id) {
    return request.post(`/api/equipment/applications/${id}/approve`);
  },

  /**
   * 拒绝申请
   * @param {number|string} id
   * @param {string} reason
   * @returns {Promise<any>}
   */
  rejectApplication(id, reason) {
    return request.post(`/api/equipment/applications/${id}/reject`, { reason });
  },

  /**
   * 创建报修单
   * @param {object} data
   * @returns {Promise<any>}
   */
  createRepairRequest(data) {
    return request.post("/api/equipment/repairs", data);
  },

  /**
   * 获取我的报修单
   * @param {object} params
   * @returns {Promise<any>}
   */
  getMyRepairRequests(params = {}) {
    return request.get("/api/equipment/repairs/my", params);
  },

  /**
   * 上传报修图片
   * @param {File|Blob} file
   * @returns {Promise<any>}
   */
  uploadRepairImage(file) {
    return request.upload("/api/equipment/repairs/upload", { file });
  },
};
