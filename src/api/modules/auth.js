import { request } from "@/utils";

const Api = Object.freeze({
  /** 用户登录 */
  LOGIN: "/auth/login",
  /** 用户注册 */
  REGISTER: "/auth/register",
  /** 退出登录 */
  LOGOUT: "/auth/logout",
});

/**
 * 用户登录
 * @param {object} params
 * @param {string} params.username 用户名
 * @param {string} params.password 用户密码
 * @param {boolean} [params.remember] 是否记住登录状态
 * @returns {Promise<any>}
 */
export function loginApi(params) {
  return request.post(Api.LOGIN, params);
}

/**
 * 用户注册
 * @param {object} params
 * @param {string} params.username 用户名
 * @param {string} params.password 用户密码
 * @param {string} params.confirmPassword 确认密码
 * @param {string} params.role 用户角色
 * @param {string} [params.email] 用户邮箱
 * @param {string} [params.phone] 用户手机号
 * @returns {Promise<any>}
 */
export function registerApi(params) {
  return request.post(Api.REGISTER, params);
}

/**
 * 退出登录
 */
export function logoutApi() {
  return request.post(Api.LOGOUT);
}
