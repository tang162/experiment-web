import { request } from "@/utils";

const Api = Object.freeze({
  /** 获取用户列表 */
  GET_USERS: "/user",
  /** 获取用户信息 */
  GET_USER_INFO: "/user/info",
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
 * @param {object} params
 * @returns {Promise<any>}
 */
export function createUserApi(params) {
  return request.post(Api.GET_USERS, params);
}

/**
 * 更新用户
 * @param {number|string} id
 * @param {object} params
 * @returns {Promise<any>}
 */
export function updateUserApi(id, params) {
  return request.put(`${Api.GET_USERS}/${id}`, params);
}

/**
 * 删除用户
 * @param {number|string} id
 * @returns {Promise<any>}
 */
export function deleteUserApi(id) {
  return request.delete(`${Api.GET_USERS}/${id}`);
}

/**
 * 更新用户状态
 * @param {number|string} id
 * @param {string|number} status
 * @returns {Promise<any>}
 */
export function updateUserStatusApi(id, status) {
  return request.put(`${Api.GET_USERS}/${id}/status`, { status });
}

/**
 * 更新用户教学标签
 * @param {number|string} id
 * @param {string[]} teachingTags
 * @returns {Promise<any>}
 */
export function updateUserTagsApi(id, teachingTags) {
  return request.put(`${Api.GET_USERS}/${id}/tags`, { teachingTags });
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
