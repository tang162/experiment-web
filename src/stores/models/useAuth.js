import { defineStore } from "pinia";

import { setStorage, getStorage, cleanupStorage } from "@/utils";

import {
  STORAGE_KEY,
  UserRole,
} from "@/types";
import { getUserInfoApi, loginApi, logoutApi, registerApi } from "@/api";


/**
 *  登录页面 url 地址
 */
export const LOGIN_PATH = "/login";

/**
 * 根据用户角色获取默认首页路径
 * @param role 用户角色
 * @returns 默认首页路径
 */
export function getDefaultHomePath(role = UserRole.STUDENT) {
  switch (role) {
    case UserRole.TEACHER:
      return "/teacher/reservations";
    case UserRole.STUDENT:
      return "/lab";
    default:
      return "/lab";
  }
}

/**
 * 默认首页地址
 */
export const DEFAULT_HOME_PATH = "/lab";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    isRequesting: false,
    userInfo: null,
    role: UserRole.STUDENT,
    token: undefined,
  }),
  getters: {
    /** 是否已登录 */
    getIsLoggedIn(state) {
      // 如果 state 未初始化，则从存储中读取
      return (
        state.isLoggedIn || !!getStorage(STORAGE_KEY.USER_TOKEN).data
      );
    },
    /** 获取token */
    getToken(state) {
      const result = getStorage(STORAGE_KEY.USER_TOKEN);
      return state.token ?? result?.data ?? null;
    },
    /** 获取用户信息 */
    getUserInfo(state) {
      return state.userInfo;
    },
    /** 获取用户角色 */
    getUserRole(state) {
      return state.role;
    },
    /** 获取用户的默认首页路径 */
    getDefaultHomePath(state) {
      return getDefaultHomePath(state.role);
    },
  },
  actions: {
    /** 用户登录 */
    async login(params) {
      try {
        const { token } = await loginApi(params);
        this.setToken(token);
        if (params.rememberPassword) {
          await setStorage(STORAGE_KEY.USER_LOGIN_INFO, params);
        }
        return token;
      } catch (error) {
        this.clear();
        throw error;
      }
    },

    /** 用户注册 */
    async register(params) {
      try {
        const { token } = await registerApi(params);
        this.setToken(token);
        this.fetchUserInfo();
        return token;
      } catch (error) {
        throw error;
      }
    },

    /** 获取用户信息 */
    async fetchUserInfo() {
      try {
        const userInfo = await getUserInfoApi();
        this.setUserInfo(userInfo);
        return userInfo;
      } catch (error) {
        this.clear();
        throw error;
      }
    },

    /** 修改用户信息*/
    async updateUserInfo(userInfo) {
      this.userInfo = userInfo;
      await setStorage(STORAGE_KEY.USER_INFO, userInfo);
    },

    /**设置token */
    async setToken(token) {
      await setStorage(STORAGE_KEY.USER_TOKEN, token);
      this.token = token;
    },

    /** 设置用户信息 */
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.setIsLoggedIn(true);
      if (userInfo?.role) {
        this.role = userInfo.role;
      }
      return userInfo;
    },

    /** 退出登录 */
    async logout() {
      try {
        await logoutApi();
      } catch (error) {
        console.error("退出登录失败:", error);
      } finally {
        this.clear();
      }
    },

    /** 设置登录状态 */
    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
    },

    /** 清除信息 */
    clear() {
      try {
        cleanupStorage();
        this.setIsLoggedIn(false);
        this.userInfo = null;
        this.role = UserRole.STUDENT;
        this.token = undefined;
      } catch (error) {
        console.error("清除存储认证信息失败:", error);
      }
    },
  },
});
