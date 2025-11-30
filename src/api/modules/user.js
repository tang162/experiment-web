import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取用户列表 */
  GET_USERS: "/user",
  /** 获取用户信息 */
  GET_USER_INFO: "/user/info",
  /** 更新个人信息 */
  UPDATE_PROFILE: "/user/profile",
  /** 修改密码 */
  CHANGE_PASSWORD: "/user/change-password",
  /** 检查用户名是否存在 */
  CHECK_USERNAME_EXISTS: "/user/check-existence",
});

/**
 * 获取用户列表
 * @param {object} [params]
 * @param {string} [params.keyword]
 * @param {string} [params.role]
 * @param {number} [params.status]
 * @param {string} [params.department]
 * @param {number} [params.page]
 * @param {number} [params.size]
 * @returns {Promise<any>}
 */
export function getUsersApi(params = {}) {
  return request.get(Api.GET_USERS, params);
}

/**
 * 获取当前用户信息
 * @returns {Promise<any>}
 */
export function getUserInfoApi() {
  return request.get(Api.GET_USER_INFO);
}

/**
 * 获取指定用户详情
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function getUserDetailApi(id) {
  return request.get(`${Api.GET_USERS}/${id}`);
}

/**
 * 创建用户
 * @returns {Promise<any>}
 */
export function createUserApi(params) {
  return request.post(Api.GET_USERS, params);
}

/**
 * 更新用户
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function updateUserApi(id, params) {
  return request.post(`${Api.GET_USERS}/${id}`, params);
}

/**
 * 更新个人信息
 * @returns {Promise<any>}
 */
export function updateProfileApi(params) {
  return request.upload(Api.UPDATE_PROFILE, params);
}

/**
 * 修改密码
 * @param {object} params
 * @param {string} params.oldPassword 原密码
 * @param {string} params.newPassword 新密码
 * @param {string} params.confirmPassword 确认密码
 * @returns {Promise<any>}
 */
export function changePasswordApi(params) {
  return request.post(Api.CHANGE_PASSWORD, params);
}

/**
 * 检查用户名是否存在
 * @param {object} params
 * @param {string} params.username
 * @param {string} params.email
 * @returns {Promise<any>}
 */
export function checkUsernameExistsApi(params) {
  return request.post(Api.CHECK_USERNAME_EXISTS, params);
}
