export namespace InstrumentApi {
  /** 查询仪器参数 */
  export interface GetInstrumentsParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 实验室ID */
    labId?: number;
    /** 仪器状态 */
    status?: InstrumentStatus;
    /** 仪器名称 */
    name?: string;
    /** 仪器型号 */
    model?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
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
    /** 仪器状态 */
    status: InstrumentStatus;
    /** 所属实验室ID */
    labId: number;
    /** 所属实验室名称 */
    labName: string;
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
    /** 仪器状态 */
    status?: InstrumentStatus;
    /** 仪器规格 */
    specifications?: string;
    /** 仪器二维码 */
    qrCode?: string;
    /** 所属实验室ID */
    labId?: number;
  }

  /** 仪器申请列表项 */
  export interface InstrumentApplicationItem {
    /** 申请ID */
    id: number;
    /** 仪器ID */
    instrumentId: number;
    /** 仪器名称 */
    instrumentName: string;
    /** 申请人ID */
    applicantId: number;
    /** 申请人姓名 */
    applicantName: string;
    /** 使用目的 */
    purpose: string;
    /** 详细描述 */
    description: string;
    /** 开始时间 */
    startTime: string;
    /** 结束时间 */
    endTime: string;
    /** 申请状态 */
    status: ApplicationStatus;
    /** 拒绝原因 */
    rejectionReason: string;
    /** 创建时间 */
    createdAt: string;
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
    /** 故障类型 */
    faultType: FaultType;
    /** 故障描述 */
    description: string;
    /** 故障图片 */
    images: string[];
    /** 紧急程度 */
    urgency: UrgencyLevel;
    /** 维修状态 */
    status: RepairStatus;
    /** 维修总结 */
    repairSummary: string;
    /** 完成时间 */
    completedAt: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 仪器详情 */
  export interface InstrumentDetail
    extends Omit<InstrumentListItem, 'labName'> {
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
  GET_INSTRUMENTS = '/instruments',
  /** 获取仪器详情 */
  GET_INSTRUMENT_DETAIL = '/instruments',
  /** 创建仪器 */
  CREATE_INSTRUMENT = '/instruments',
  /** 更新仪器 */
  UPDATE_INSTRUMENT = '/instruments',
  /** 删除仪器 */
  DELETE_INSTRUMENT = '/instruments',
  /** 获取仪器申请列表 */
  GET_INSTRUMENT_APPLICATIONS = '/instruments/applications',
  /** 创建仪器申请 */
  CREATE_INSTRUMENT_APPLICATION = '/instruments/applications',
  /** 审核仪器申请 */
  REVIEW_INSTRUMENT_APPLICATION = '/instruments/applications',
  /** 获取仪器维修列表 */
  GET_INSTRUMENT_REPAIRS = '/instruments/repairs',
  /** 报告仪器故障 */
  REPORT_INSTRUMENT_REPAIR = '/instruments/repairs',
  /** 更新维修状态 */
  UPDATE_REPAIR_STATUS = '/instruments/repairs',
}

/** 获取仪器列表 */
export async function getInstrumentsApi(
  params: Partial<InstrumentApi.GetInstrumentsParams>,
) {}

/** 获取仪器详情 */
export async function getInstrumentDetailApi(id: number) {}

/** 创建仪器 */
export async function createInstrumentApi(
  params: InstrumentApi.CreateInstrumentParams,
) {}

/** 更新仪器 */
export async function updateInstrumentApi(
  id: number,
  params: InstrumentApi.CreateInstrumentParams,
) {}

/** 删除仪器 */
export async function deleteInstrumentApi(id: number) {}

/** 获取仪器申请列表 */
export async function getInstrumentApplicationsApi(params: any) {}

/** 创建仪器申请 */
export async function createInstrumentApplicationApi(
  instrumentId: number,
  params: {
    purpose?: string;
    description: string;
    startTime: Date;
    endTime: Date;
  },
) {}

/** 审核仪器申请 */
export async function reviewInstrumentApplicationApi(id: number) {}

/** 获取仪器维修列表 */
export async function getInstrumentRepairsApi(params: any) {}

/** 报告仪器故障 */
export async function reportInstrumentRepairApi(params: {}) {}

/** 更新维修状态 */
export async function updateRepairStatusApi() {}
