import { request } from "@/utils";
import type { PaginationParam, PaginationData } from "@/api";
export namespace ReservationApi {
  export interface Lab {
    /** 实验室ID */
    id: number;
    /** 实验室名称 */
    name: string;
    /** 实验室地址 */
    location: string;
    /** 实验室容量 */
    capacity: string;
    /** 实验室描述 */
    description: string;
    /** 实验室部门 */
    department: string;
    /** 实验室评分 */
    rating: number;
  }
  export interface User {
    /** 用户ID */
    id: number;
    /** 申请人姓名 */
    username: string;
  }

  /** 查询预约参数 */
  export interface GetAppointmentsParams {
    /** 关键词搜索 */
    keyword?: string;
    /** 实验室ID */
    labId?: number;
    /** 预约状态 */
    status?: number;
    /** 时间段 '时间段:0-上午,1-下午,2-晚上',*/
    /** 时间段 */
    timeSlot?: string;
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
    lab: Lab;
    user: User;
    /** 预约日期 */
    appointmentDate: string;
    /** 预约目的 */
    purpose: string;
    /** 时间段 '时间段:0-上午,1-下午,2-晚上',*/
    timeSlot: number;
    /** 详细说明 */
    description: string;
    /** 参与人数 */
    participantCount: number;
    /**  '预约状态:0-待审核,1-已通过,2-已拒绝,3-已取消,4-已完成', */
    status: number;
    /** 申请时间 */
    createdAt: string;
    /** 拒绝原因 */
    rejectionReason: string;
  }

  /** 创建预约参数 */
  export interface CreateAppointmentParams {
    /** 实验室ID */
    labId: number;
    /** 预约日期 */
    appointmentDate: string;
    /** 时间段 */
    timeSlot: string;
    /** 预约目的 */
    purpose: string;
    /** 详细说明 */
    description: string;
    /** 参与人数 */
    participantCount: number;
  }

  /** 预约详情 */
  export interface AppointmentDetail extends AppointmentListItem {
    /** 详细说明 */
    description: string;
    /** 审核人 */
    reviewer: string;
    /** 审核时间 */
    reviewTime: string;
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取我的预约列表 */
  GET_MY_APPOINTMENTS = "/appointments/my",
  /** 获取预约列表 */
  GET_APPOINTMENTS = "/appointments",
  /** 取消预约 */
  CANCEL_APPOINTMENT = "/appointments/cancel",
}

/** 获取我的预约列表 */
export async function getAppointmentsApi() {
  return request.get<PaginationData<ReservationApi.AppointmentListItem>>(
    Api.GET_MY_APPOINTMENTS
  );
}

/** 获取预约详情 */
export async function getAppointmentDetailApi(id: number) {
  return request.get<ReservationApi.AppointmentDetail>(
    `${Api.GET_APPOINTMENTS}/${id}`
  );
}

/** 创建预约 */
export async function createAppointmentApi(
  params: ReservationApi.CreateAppointmentParams
) {
  return request.post<ReservationApi.AppointmentListItem>(
    Api.GET_APPOINTMENTS,
    params
  );
}

/** 取消预约 */
export async function cancelAppointmentApi(id: number) {
  return request.patch(`${Api.CANCEL_APPOINTMENT}/${id}`);
}
