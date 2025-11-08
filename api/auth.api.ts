export namespace AuthApi {
  /** 登录参数 */
  export interface LoginParams {
    /** 用户名 */
    username: string;
    /** 用户密码 */
    password: string;
    /** 记住登录状态 */
    remember?: boolean;
  }

  /** 注册参数 */
  export interface RegisterParams {
    /** 用户名 */
    username: string;
    /** 用户密码 */
    password: string;
    /** 确认密码 */
    confirmPassword: string;
    /** 用户角色 */
    role: Role;
    /** 用户邮箱 */
    email?: string;
    /** 用户手机号 */
    phone?: string;
  }

  /** 登录响应 */
  export interface LoginResult {
    /** JWT Token */
    token: string;
    /** 用户信息 */
    user: {
      id: number;
      username: string;
      nickname: string;
      avatar: string;
      role: Role;
      email: string;
      phone: string;
      department: string;
      status: string;
    };
  }
}

enum Api {
  /** 用户登录 */
  LOGIN = '/auth/login',
  /** 用户注册 */
  REGISTER = '/auth/register',
  /** 获取当前用户信息 */
  ME = '/auth/me',
  /** 刷新Token */
  REFRESH = '/auth/refresh',
  /** 退出登录 */
  LOGOUT = '/auth/logout',
}

/** 用户登录 */
export async function loginApi(params: AuthApi.LoginParams) {}

/** 用户注册 */
export async function registerApi(params: AuthApi.RegisterParams) {}

/** 获取当前用户信息 */
export async function getCurrentUserApi() {}

/** 刷新Token */
export async function refreshTokenApi() {}

/** 退出登录 */
export async function logoutApi() {}
