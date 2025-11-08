import type { UserRole } from "@/types";
import { request } from "@/utils";

export namespace UserApi {
  /** 查询用户参数 */
  export interface GetUsersParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 用户角色 */
    role?: UserRole;
    /** 用户状态 */
    status?: number;
    /** 所属院系 */
    department?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  export interface GetUsersResult {
    /** 用户名 */
    username: string;
    /** 用户邮箱 */
    email: string;
  }

  /** 用户列表项 */
  export interface UserListItem extends GetUsersResult {
    /** 用户ID */
    id: number;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatar: string;
    /** 用户角色 */
    role: UserRole;
    /** 用户状态 */
    status: number;
    /** 用户手机号 */
    phone: string;
    /** 所属院系 */
    department: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建用户参数 */
  export interface CreateUserParams extends GetUsersResult {
    /** 用户密码 */
    password: string;
    /** 用户角色 */
    role?: UserRole;
    /** 用户昵称 */
    nickname?: string;
    /** 用户头像 */
    avatar?: string;
    /** 用户手机号 */
    phone?: string;
    /** 所属院系 */
    department?: string;
  }

  /** 更新用户参数 */
  export interface UpdateUserParams extends CreateUserParams {
    /** 用户状态 */
    status?: number;
    /** 教学标签 */
    teachingTags?: string[];
  }

  /** 用户详情 */
  export interface UserDetail extends UserListItem {
    /** 教学标签 */
    teachingTags: string[];
    /** 审核时间段配置 */
    auditTimeSlots: any;
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取用户列表 */
  GET_USERS = "/user",
  /** 获取用户信息 */
  GET_USER_INFO = "/user/info",

  /** 检查用户名是否存在 */
  CHECK_USERNAME_EXISTS = "/user/check-existence",
}

/** 获取用户列表 */
export async function getUsersApi(params: Partial<UserApi.GetUsersParams>) {
  return request.get<UserApi.UserListItem[]>(Api.GET_USERS, params);
}

/** 获取用户信息 */
export async function getUserInfoApi() {
  return request.get<UserApi.UserDetail>(Api.GET_USER_INFO);
}

/** 获取用户详情 */
export async function getUserDetailApi(id: number) {
  return request.get<UserApi.UserDetail>(`${Api.GET_USERS}/${id}`);
}

/** 创建用户 */
export async function createUserApi(params: UserApi.CreateUserParams) {
  return request.post<UserApi.UserListItem>(Api.GET_USERS, params);
}

/** 更新用户 */
export async function updateUserApi(
  id: number,
  params: UserApi.UpdateUserParams
) {
  return request.put<UserApi.UserListItem>(`${Api.GET_USERS}/${id}`, params);
}

/** 删除用户 */
export async function deleteUserApi(id: number) {
  return request.delete(`${Api.GET_USERS}/${id}`);
}

/** 更新用户状态 */
export async function updateUserStatusApi(id: number, status: string) {
  return request.put(`${Api.GET_USERS}/${id}/status`, { status });
}

/** 更新用户教学标签 */
export async function updateUserTagsApi(id: number, teachingTags: string[]) {
  return request.put(`${Api.GET_USERS}/${id}/tags`, { teachingTags });
}

/** 检查用户名是否存在*/
export async function checkUsernameExistsApi(
  params: Partial<UserApi.GetUsersResult>
) {
  return request.post<{
    exists: number;
  }>(Api.CHECK_USERNAME_EXISTS, params);
}
