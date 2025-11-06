import { defineStore } from "pinia";

import { setStorage, getStorage, cleanupStorage } from "@/utils";

import { STORAGE_KEY, UserRole, type User, type LoginForm, type RegisterForm } from "@/types";
import { authApi } from "@/api";

interface AuthState {
  /**是否登录 */
  isLoggedIn: boolean;
  // 是否处于请求中
  isRequesting: boolean;
  // 用户信息
  userInfo: User | null;
  /** token */
  token: string | undefined;
  // 用户角色
  role: UserRole;
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
  role: UserRole = UserRole.STUDENT
): string {
  switch (role) {
    case UserRole.TEACHER:
      return "/teacher/reservations";
    case UserRole.STUDENT:
    default:
      return "/home";
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
    role: UserRole.STUDENT,
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
    async login(params: LoginForm) {
      try {
        const response = await authApi.login(params);
        
        this.setToken(response.token);
        this.setUserInfo(response.user);
        
        if (params.rememberPassword) {
          await setStorage(STORAGE_KEY.USER_TOKEN, response.token, Date.now() + 7 * 24 * 60 * 60 * 1000);
        } else {
          await setStorage(STORAGE_KEY.USER_TOKEN, response.token);
        }
        
        await setStorage(STORAGE_KEY.USER_INFO, response.user);
        
        return response;
      } catch (error) {
        this.clear();
        throw error;
      }
    },

    /** 用户注册 */
    async register(params: RegisterForm) {
      try {
        const response = await authApi.register(params);
        
        this.setToken(response.token);
        this.setUserInfo(response.user);
        
        await setStorage(STORAGE_KEY.USER_TOKEN, response.token);
        await setStorage(STORAGE_KEY.USER_INFO, response.user);
        
        return response;
      } catch (error) {
        throw error;
      }
    },

    /** 获取用户信息 */
    async fetchUserInfo() {
      try {
        const userInfo = await authApi.getUserInfo();
        this.setUserInfo(userInfo);
        await setStorage(STORAGE_KEY.USER_INFO, userInfo);
        return userInfo;
      } catch (error) {
        this.clear();
        throw error;
      }
    },

    /** 修改用户信息*/
    async updateUserInfo(userInfo: User) {
      this.userInfo = userInfo;
      await setStorage(STORAGE_KEY.USER_INFO, userInfo);
    },
    
    /**设置token */
    setToken(token: string) {
      this.token = token;
    },

    /** 设置用户信息 */
    setUserInfo(userInfo: User | null) {
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
        await authApi.logout();
      } catch (error) {
        console.error('退出登录失败:', error);
      } finally {
        this.clear();
      }
    },

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
        this.role = UserRole.STUDENT;
        this.token = undefined;
      } catch (error) {
        console.error("清除存储认证信息失败:", error);
      }
    },
  },
});
