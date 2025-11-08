import { request } from "@/utils";
import type { PaginationParam, SearchFilter, BaseEntity } from "@/api";

// 实验室基础信息
interface LabBase {
  /** 实验室名称 */
  name: string;
  /** 实验室位置 */
  location: string;
  /** 实验室容量 */
  capacity: number;
  /** 实验室状态：0-正常，1-维护中，2-停用*/
  status: number;
  /** 所属院系 */
  department: string;
  /** 实验室标签 */
  tags: string[];
}

// 实验室可选信息
interface LabOptionalInfo {
  /** 实验室描述 */
  description?: string;
  /** 实验室图片 */
  images?: string[];
  /** 设备列表 */
  equipmentList?: string[];
}

// 实验室评分信息
interface LabRating {
  /** 实验室评分 */
  rating: number;
}

export namespace LabApi {
  /** 查询实验室参数 - 继承分页和搜索过滤 */
  export interface GetLabsParams extends PaginationParam, SearchFilter {
    /** 所属院系 */
    department?: string;
    /** 实验室状态：0-正常，1-维护中，2-停用*/
    status?: number;
    /** 实验室标签 */
    tags?: string[];
  }

  /** 实验室列表项 - 继承多个基础接口 */
  export interface LabListItem extends BaseEntity, LabBase, LabRating {}

  /** 创建实验室参数 - 继承实验室基础和可选信息 */
  export interface CreateLabParams extends LabBase, LabOptionalInfo {}

  /** 更新实验室参数 - 继承实验室基础和可选信息（全部可选） */
  export interface UpdateLabParams
    extends Partial<LabBase>,
      Partial<LabOptionalInfo> {}

  /** 实验室详情 - 继承实验室基础和可选信息，以及评分和时间 */
  export interface LabDetail extends LabBase, LabOptionalInfo, LabRating {
    /** 实验室ID */
    id: number;
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取实验室列表 */
  GET_LABS = "/labs",
}

/** 获取实验室列表 */
export async function getLabsApi(params: Partial<LabApi.GetLabsParams>) {
  return request.get<LabApi.LabListItem[]>(Api.GET_LABS, params);
}

/** 获取实验室详情 */
export async function getLabDetailApi(id: number) {
  return request.get<LabApi.LabDetail>(`${Api.GET_LABS}/${id}`);
}

/** 创建实验室 */
export async function createLabApi(params: LabApi.CreateLabParams) {
  return request.post<LabApi.LabListItem>(Api.GET_LABS, params);
}

/** 更新实验室 */
export async function updateLabApi(id: number, params: LabApi.UpdateLabParams) {
  return request.put<LabApi.LabListItem>(`${Api.GET_LABS}/${id}`, params);
}

/** 删除实验室 */
export async function deleteLabApi(id: number) {
  return request.delete(`${Api.GET_LABS}/${id}`);
}
