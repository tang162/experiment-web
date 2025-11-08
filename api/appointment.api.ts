export namespace AppointmentApi {
  /** 查询预约参数 */
  export interface GetAppointmentsParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 实验室ID */
    labId?: number;
    /** 预约状态 */
    status?: AppointmentStatus;
    /** 时间段 */
    timeSlot?: TimeSlot;
    /** 预约日期 */
    appointmentDate?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 预约列表项 */
  export interface AppointmentListItem {
    /** 预约ID */
    id: number;
    /** 实验室ID */
    labId: number;
    /** 实验室名称 */
    labName: string;
    /** 用户ID */
    userId: number;
    /** 申请人姓名 */
    username: string;
    /** 预约日期 */
    appointmentDate: string;
    /** 时间段 */
    timeSlot: TimeSlot;
    /** 预约目的 */
    purpose: string;
    /** 参与人数 */
    participantCount: number;
    /** 预约状态 */
    status: AppointmentStatus;
    /** 拒绝原因 */
    rejectionReason: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 创建预约参数 */
  export interface CreateAppointmentParams {
    /** 实验室ID */
    labId: number;
    /** 预约日期 */
    appointmentDate: string;
    /** 时间段 */
    timeSlot: TimeSlot;
    /** 预约目的 */
    purpose: string;
    /** 详细说明 */
    description: string;
    /** 参与人数 */
    participantCount: number;
  }

  /** 审核预约参数 */
  export interface ReviewAppointmentParams {
    /** 审核状态 */
    status: AppointmentStatus;
    /** 拒绝原因 */
    rejectionReason?: string;
  }

  /** 预约详情 */
  export interface AppointmentDetail
    extends Omit<AppointmentListItem, 'labName' | 'username'> {
    /** 详细说明 */
    description: string;
    /** 审核人ID */
    reviewerId: number;
    /** 审核时间 */
    reviewTime: string;
    /** 实际开始时间 */
    startTime: string;
    /** 实际结束时间 */
    endTime: string;
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取预约列表 */
  GET_APPOINTMENTS = '/appointments',
  /** 获取预约详情 */
  GET_APPOINTMENT_DETAIL = '/appointments',
  /** 创建预约 */
  CREATE_APPOINTMENT = '/appointments',
  /** 审核预约 */
  REVIEW_APPOINTMENT = '/appointments',
  /** 取消预约 */
  CANCEL_APPOINTMENT = '/appointments',
  /** 完成预约 */
  COMPLETE_APPOINTMENT = '/appointments',
}

/** 获取预约列表 */
export async function getAppointmentsApi(
  params: Partial<AppointmentApi.GetAppointmentsParams>,
) {
  return request.get<{
    data: AppointmentApi.AppointmentListItem[];
    total: number;
    page: number;
    size: number;
  }>(Api.GET_APPOINTMENTS, params);
}

/** 获取预约详情 */
export async function getAppointmentDetailApi(id: number) {}

/** 创建预约 */
export async function createAppointmentApi(
  params: AppointmentApi.CreateAppointmentParams,
) {}

/** 审核预约 */
export async function reviewAppointmentApi(
  id: number,
  params: AppointmentApi.ReviewAppointmentParams,
) {}

/** 取消预约 */
export async function cancelAppointmentApi(id: number) {}

/** 完成预约 */
export async function completeAppointmentApi(id: number) {}
