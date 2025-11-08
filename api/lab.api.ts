export namespace LabApi {
  /** 查询实验室参数 */
  export interface GetLabsParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 所属院系 */
    department?: string;
    /** 实验室状态 */
    status?: LabStatus;
    /** 实验室标签 */
    tags?: string[];
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 实验室列表项 */
  export interface LabListItem {
    /** 实验室ID */
    id: number;
    /** 实验室名称 */
    name: string;
    /** 实验室位置 */
    location: string;
    /** 实验室容量 */
    capacity: number;
    /** 实验室状态 */
    status: LabStatus;
    /** 所属院系 */
    department: string;
    /** 实验室标签 */
    tags: string[];
    /** 实验室评分 */
    rating: number;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建实验室参数 */
  export interface CreateLabParams {
    /** 实验室名称 */
    name: string;
    /** 实验室位置 */
    location: string;
    /** 实验室容量 */
    capacity: number;
    /** 实验室描述 */
    description?: string;
    /** 实验室图片 */
    images?: string[];
    /** 实验室状态 */
    status?: LabStatus;
    /** 所属院系 */
    department: string;
    /** 设备列表 */
    equipmentList?: string[];
    /** 实验室标签 */
    tags?: string[];
  }

  /** 更新实验室参数 */
  export interface UpdateLabParams {
    /** 实验室名称 */
    name?: string;
    /** 实验室位置 */
    location?: string;
    /** 实验室容量 */
    capacity?: number;
    /** 实验室描述 */
    description?: string;
    /** 实验室图片 */
    images?: string[];
    /** 实验室状态 */
    status?: LabStatus;
    /** 所属院系 */
    department?: string;
    /** 设备列表 */
    equipmentList?: string[];
    /** 实验室标签 */
    tags?: string[];
  }

  /** 实验室详情 */
  export interface LabDetail
    extends Omit<LabListItem, 'rating' | 'createdAt' | 'updatedAt'> {
    /** 实验室描述 */
    description: string;
    /** 实验室图片 */
    images: string[];
    /** 设备列表 */
    equipmentList: string[];
    /** 实验室评分 */
    rating: number;
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取实验室列表 */
  GET_LABS = '/labs',
  /** 获取实验室详情 */
  GET_LAB_DETAIL = '/labs',
  /** 创建实验室 */
  CREATE_LAB = '/labs',
  /** 更新实验室 */
  UPDATE_LAB = '/labs',
  /** 删除实验室 */
  DELETE_LAB = '/labs',
}

/** 获取实验室列表 */
export async function getLabsApi(params: Partial<LabApi.GetLabsParams>) {}

/** 获取实验室详情 */
export async function getLabDetailApi(id: number) {}

/** 创建实验室 */
export async function createLabApi(params: LabApi.CreateLabParams) {}

/** 更新实验室 */
export async function updateLabApi(
  id: number,
  params: LabApi.UpdateLabParams,
) {}

/** 删除实验室 */
export async function deleteLabApi(id: number) {}
