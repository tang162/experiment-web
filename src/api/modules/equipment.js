/**
 * 设备管理模块（兼容层）
 * 
 * 注意：此模块为兼容旧代码保留，实际功能已迁移到以下模块：
 * - 仪器管理：请使用 instrument.api.js
 * - 维修管理：请使用 repair.js
 * 
 * 建议新代码直接使用对应的模块，而不是使用此兼容层
 */

import {
  getInstrumentsApi,
  getInstrumentDetailApi,
  getMyInstrumentApplicationsApi,
  getInstrumentApplicationsApi,
  applyInstrumentApi,
  reviewInstrumentApplicationApi,
} from './instrument.api';

import {
  getMyRepairsApi,
  reportInstrumentFaultApi,
} from './repair';

/**
 * @deprecated 请使用 instrument.api.js 中的对应方法
 */
export const equipmentApi = {
  /**
   * 获取仪器设备列表
   * @deprecated 请使用 getInstrumentsApi
   */
  getEquipmentList(params = {}) {
    return getInstrumentsApi(params);
  },

  /**
   * 获取仪器设备详情
   * @deprecated 请使用 getInstrumentDetailApi
   */
  getEquipmentDetail(id) {
    return getInstrumentDetailApi(id);
  },

  /**
   * 创建借用申请
   * @deprecated 请使用 applyInstrumentApi
   */
  createApplication(data) {
    const { instrumentId, ...rest } = data;
    return applyInstrumentApi(instrumentId, rest);
  },

  /**
   * 获取我的借用申请
   * @deprecated 请使用 getMyInstrumentApplicationsApi
   */
  getMyApplications(params = {}) {
    return getMyInstrumentApplicationsApi(params);
  },

  /**
   * 获取所有借用申请（管理员/教师权限）
   * @deprecated 请使用 getInstrumentApplicationsApi
   */
  getApplications(params = {}) {
    return getInstrumentApplicationsApi(params);
  },

  /**
   * 获取待处理的借用申请（教师权限）
   * @deprecated 请使用 getInstrumentApplicationsApi
   */
  getPendingApplications(params = {}) {
    return getInstrumentApplicationsApi({ ...params, status: 'PENDING' });
  },

  /**
   * 审批通过申请（教师权限）
   * @deprecated 请使用 reviewInstrumentApplicationApi
   */
  approveApplication(id) {
    return reviewInstrumentApplicationApi(id, { status: 'APPROVED' });
  },

  /**
   * 拒绝申请（教师权限）
   * @deprecated 请使用 reviewInstrumentApplicationApi
   */
  rejectApplication(id, reason) {
    return reviewInstrumentApplicationApi(id, {
      status: 'REJECTED',
      rejectionReason: reason
    });
  },

  /**
   * 创建报修单
   * @deprecated 请使用 reportInstrumentFaultApi
   */
  createRepairRequest(data) {
    const { instrumentId, ...rest } = data;
    const formData = new FormData();
    Object.keys(rest).forEach(key => {
      if (rest[key] !== undefined && rest[key] !== null) {
        formData.append(key, rest[key]);
      }
    });
    return reportInstrumentFaultApi(instrumentId, formData);
  },

  /**
   * 获取我的报修单
   * @deprecated 请使用 getMyRepairsApi
   */
  getMyRepairRequests(params = {}) {
    return getMyRepairsApi(params);
  },

  /**
   * 上传报修图片
   * @deprecated 文件上传应该在 reportInstrumentFaultApi 中使用 FormData 处理
   */
  uploadRepairImage(file) {
    console.warn('equipmentApi.uploadRepairImage is deprecated. Please use FormData with reportInstrumentFaultApi');
    return Promise.reject(new Error('This method is deprecated'));
  },
};
