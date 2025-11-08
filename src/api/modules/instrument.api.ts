import type { PaginationData, PaginationParam } from "@/api";
import { request } from "@/utils";

export namespace InstrumentApi {
  interface LabBase {
    /** 实验室ID */
    id: number;
    /** 实验室名称 */
    name: string;
    /** 所属院系 */
    department: string;
  }

  /** 查询仪器参数 */
  export interface GetInstrumentsParams extends PaginationParam {
    /** 实验室ID */
    labId?: number;
    /** 设备状态:0-正常,1-停用,2-维护中,3-故障,4-借出 */
    status?: number;
  }

  /** 仪器列表项 */
  export interface InstrumentListItem {
    /** 仪器ID */
    id: number;
    /** 仪器名称 */
    name: string;
    /** 仪器型号 */
    model: string;
    /** 仪器序列号 */
    serialNumber: string;
    /** 设备状态:0-正常,1-停用,2-维护中,3-故障,4-借出 */
    status?: number;
    /** 所属实验室ID */
    lab: LabBase;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建仪器参数 */
  export interface CreateInstrumentParams {
    /** 仪器名称 */
    name: string;
    /** 仪器型号 */
    model: string;
    /** 仪器序列号 */
    serialNumber?: string;
    /** 仪器描述 */
    description?: string;
    /** 设备状态:0-正常,1-停用,2-维护中,3-故障,4-借出 */
    status?: number;
    /** 仪器规格 */
    specifications?: string;
    /** 仪器二维码 */
    qrCode?: string;
    /** 所属实验室ID */
    labId?: number;
    /** 仪器图片 */
    images?: string[] | File[];
  }

  /** 申请使用仪器参数 */
  export interface ApplyInstrumentParams {
    /**使用目的 */
    purpose: string;
    /**详细说明 */
    description: string;
    /**开始使用时间 */
    startTime: string;
    /**结束使用时间 */
    endTime: string;
  }

  /** 报告仪器故障参数 */
  export interface ReportInstrumentRepairParams {
    /**  故障类型:0-硬件故障,1-软件故障,2-操作错误,3-其他 */
    faultType: number;
    /** 故障描述 */
    description: string;
    /** 紧急程度:0-低,1-中,2-高,3-紧急 */
    urgency: number;
  }

  /** 仪器维修列表项 */
  export interface InstrumentRepairItem {
    /** 维修单ID */
    id: number;
    /** 维修单号 */
    repairNumber: string;
    /** 仪器ID */
    instrumentId: number;
    /** 仪器名称 */
    instrumentName: string;
    /** 报告人ID */
    reporterId: number;
    /** 报告人姓名 */
    reporterName: string;
    /**  故障类型:0-硬件故障,1-软件故障,2-操作错误,3-其他 */
    faultType: number;
    /** 故障描述 */
    description: string;
    /** 故障图片 */
    images: string[];
    /** 紧急程度:0-低,1-中,2-高,3-紧急 */
    urgency: number;
    /** 维修状态:0-待处理,1-维修中,3-已完成 */
    status: number;
    /** 维修总结 */
    repairSummary: string;
    /** 完成时间 */
    completedAt: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 仪器详情 */
  export interface InstrumentDetail
    extends Omit<InstrumentListItem, "labName"> {
    /** 仪器描述 */
    description: string;
    /** 仪器规格 */
    specifications: string;
    /** 仪器图片 */
    images: string[];
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取仪器列表 */
  GET_INSTRUMENTS = "/instruments",
  /** 获取我的申请 */
  GET_MY_INSTRUMENT_APPLICATIONS = "/instruments/applications/my",
  /** 申请列表*/
  GET_INSTRUMENT_APPLICATIONS = "/instruments/applications",
  /** 报告仪器故障 */
  REPORT_INSTRUMENT_REPAIR = "/instruments/repairs",
  /** 申请使用仪器 */
  APPLY_INSTRUMENT = "/instruments/apply",
  /** 审核申请 */
  AUDIT_INSTRUMENT_REPAIR = "/instruments/applications/review",
}

/** 获取仪器列表 */
export async function getInstrumentsApi(
  params: Partial<InstrumentApi.GetInstrumentsParams>
) {
  return request.get<PaginationData<InstrumentApi.InstrumentListItem>>(
    Api.GET_INSTRUMENTS,
    params
  );
}

/** 获取仪器详情 */
export async function getInstrumentDetailApi(id: number) {
  return request.get<InstrumentApi.InstrumentDetail>(
    `${Api.GET_INSTRUMENTS}/${id}`
  );
}

/** 创建仪器- 老师权限 */
export async function createInstrumentApi(
  params: InstrumentApi.CreateInstrumentParams
) {
  return request.post<InstrumentApi.InstrumentListItem>(
    `${Api.GET_INSTRUMENTS}`,
    params
  );
}

/** 修改仪器- 老师权限 */
export async function updateInstrumentApi(
  id: number,
  params: InstrumentApi.CreateInstrumentParams
) {
  return request.patch<InstrumentApi.InstrumentListItem>(
    `${Api.GET_INSTRUMENTS}/${id}`,
    params
  );
}

/** 获取仪器申请列表 老师权限 */
export async function getInstrumentApplicationsApi(
  params: Partial<InstrumentApi.GetInstrumentsParams>
) {
  return request.get<PaginationData<InstrumentApi.InstrumentListItem>>(
    Api.GET_INSTRUMENT_APPLICATIONS,
    params
  );
}

/** 获取我的仪器申请列表 学生权限 */
export async function getMyInstrumentApplicationsApi(
  params: Partial<InstrumentApi.GetInstrumentsParams>
) {
  return request.get<PaginationData<InstrumentApi.InstrumentListItem>>(
    `${Api.GET_MY_INSTRUMENT_APPLICATIONS}`,
    params
  );
}

/** 创建仪器申请 */
export async function createInstrumentApplicationApi(
  id: number,
  params: InstrumentApi.ApplyInstrumentParams
) {
  return request.post<InstrumentApi.InstrumentListItem>(
    `${Api.APPLY_INSTRUMENT}/${id}`,
    params
  );
}

/** 报告仪器故障 */
export async function reportInstrumentRepairApi(
  id: number,
  params: InstrumentApi.ReportInstrumentRepairParams
) {
  return request.post<InstrumentApi.InstrumentListItem>(
    `${Api.REPORT_INSTRUMENT_REPAIR}/${id}`,
    params
  );
}

/** 审核仪器申请列表 - 老师权限 */
export async function auditInstrumentRepairApi(
  id: number,
  params: InstrumentApi.ReportInstrumentRepairParams
) {
  return request.post<InstrumentApi.InstrumentListItem>(
    `${Api.AUDIT_INSTRUMENT_REPAIR}/${id}`,
    params
  );
}
