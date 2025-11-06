import { defineStore } from "pinia";

import { setStorage, getStorage, cleanupStorage } from "@/utils";

import { STORAGE_KEY } from "@/types";

interface AuthState {
  /**是否登录 */
  isLoggedIn: boolean;
  // 是否处于请求中
  isRequesting: boolean;
  // 用户信息
  userInfo: null;
  /** token */
  token: string | undefined;
  // 用户角色
  role: "job_seeker" | "recruiter";
}

/**
 *  登录页面 url 地址
 */
export const LOGIN_PATH = "/login";

/**
 * 根据用户角色获取默认首页路径
 * @param role 用户角色
 * @returns 默认首页路径
 */
export function getDefaultHomePath(
  role: "job_seeker" | "recruiter" = "job_seeker"
): string {
  switch (role) {
    case "recruiter":
      // return "/recruiter/rc-dashboard";
      return "/recruiter/rc-applicants";
    case "job_seeker":
    default:
      return "/job-seeker/js-home";
  }
}

/**
 * 默认首页地址
 */
export const DEFAULT_HOME_PATH = "/home";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isLoggedIn: false,
    isRequesting: false,
    userInfo: null,
    role: "job_seeker",
    token: undefined,
  }),
  getters: {
    /** 是否已登录 */
    getIsLoggedIn(state: AuthState) {
      // 如果 state 未初始化，则从存储中读取
      return (
        state.isLoggedIn || !!getStorage<string>(STORAGE_KEY.USER_TOKEN).data
      );
    },
    /** 获取token */
    getToken(state) {
      const result = getStorage(STORAGE_KEY.USER_TOKEN);
      return state.token ?? result?.data ?? null;
    },
    /** 获取用户信息 */
    getUserInfo(state: AuthState) {
      return state.userInfo;
    },
    /** 获取用户角色 */
    getUserRole(state: AuthState) {
      return state.role;
    },
    /** 获取用户的默认首页路径 */
    getDefaultHomePath(state: AuthState) {
      return getDefaultHomePath(state.role);
    },
  },
  actions: {
    /** 用户登录 */
    async login(params: any) {
      try {
        try {
        } catch (userInfoError) {
          // 获取用户信息失败，清理 token
          console.error("获取用户信息失败:", userInfoError);
          this.clear();
          throw userInfoError;
        }
      } catch (error) {}
    },

    /** 用户注册 */
    async register(params: any) {},

    /** 获取用户信息 */
    async fetchUserInfo() {
      try {
      } catch (error) {}
    },

    /** 修改用户信息*/
    async updateUserInfo(userInfo: any) {},
    /**设置token */
    setToken(token: string) {},

    /** 设置用户信息 */
    setUserInfo(userInfo: null) {
      this.userInfo = userInfo;
      this.setIsLoggedIn(true);
      if (userInfo?.role) {
        this.role = userInfo.role;
      }
      return userInfo;
    },

    /** 退出登录 */
    async logout() {},

    /** 设置登录状态 */
    setIsLoggedIn(isLoggedIn: boolean) {
      this.isLoggedIn = isLoggedIn;
    },

    /** 清除信息 */
    clear() {
      try {
        cleanupStorage();
        this.setIsLoggedIn(false);
        this.userInfo = null;
        this.role = "job_seeker";
      } catch (error) {
        console.error("清除存储认证信息失败:", error);
      }
    },
  },
});
