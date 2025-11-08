export namespace UserApi {
  /** 查询用户参数 */
  export interface GetUsersParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 用户角色 */
    role?: Role;
    /** 用户状态 */
    status?: Status;
    /** 所属院系 */
    department?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 用户列表项 */
  export interface UserListItem {
    /** 用户ID */
    id: number;
    /** 用户名 */
    username: string;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatar: string;
    /** 用户角色 */
    role: Role;
    /** 用户状态 */
    status: Status;
    /** 用户邮箱 */
    email: string;
    /** 用户手机号 */
    phone: string;
    /** 所属院系 */
    department: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建用户参数 */
  export interface CreateUserParams {
    /** 用户名 */
    username: string;
    /** 用户密码 */
    password: string;
    /** 用户角色 */
    role: Role;
    /** 用户昵称 */
    nickname?: string;
    /** 用户头像 */
    avatar?: string;
    /** 用户邮箱 */
    email?: string;
    /** 用户手机号 */
    phone?: string;
    /** 所属院系 */
    department?: string;
  }

  /** 更新用户参数 */
  export interface UpdateUserParams {
    /** 用户昵称 */
    nickname?: string;
    /** 用户头像 */
    avatar?: string;
    /** 用户邮箱 */
    email?: string;
    /** 用户手机号 */
    phone?: string;
    /** 所属院系 */
    department?: string;
    /** 用户状态 */
    status?: Status;
    /** 教学标签 */
    teachingTags?: string[];
    /** 审核时间段 */
    auditTimeSlots?: any;
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
  GET_USERS = '/users',
  /** 获取用户详情 */
  GET_USER_DETAIL = '/users',
  /** 创建用户 */
  CREATE_USER = '/users',
  /** 更新用户 */
  UPDATE_USER = '/users',
  /** 删除用户 */
  DELETE_USER = '/users',
  /** 更新用户状态 */
  UPDATE_USER_STATUS = '/users',
  /** 更新用户教学标签 */
  UPDATE_USER_TAGS = '/users',
}

/** 获取用户列表 */
export async function getUsersApi(params: Partial<UserApi.GetUsersParams>) {}

/** 获取用户详情 */
export async function getUserDetailApi(id: number) {}

/** 创建用户 */
export async function createUserApi(params: UserApi.CreateUserParams) {}

/** 更新用户 */
export async function updateUserApi(
  id: number,
  params: UserApi.UpdateUserParams,
) {}

/** 删除用户 */
export async function deleteUserApi(id: number) {}

/** 更新用户状态 */
export async function updateUserStatusApi(id: number, status: string) {}

/** 更新用户教学标签 */
export async function updateUserTagsApi(id: number, teachingTags: string[]) {}
