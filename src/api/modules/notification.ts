import { request } from "@/utils";
import type { PaginationParam, PaginationData } from "@/api";

export namespace NotificationApi {
  /** 查询通知参数 */
  export interface GetNotificationsParams extends PaginationParam {
    /** 通知类型 */
    type?: number;
    /** 是否已读 */
    isRead?: boolean;
  }

  /** 通知列表项 */
  export interface NotificationListItem {
    /** 通知ID */
    id: number;
    /** 通知类型 */
    type: number;
    /** 通知标题 */
    title: string;
    /** 通知内容 */
    content: string;
    /** 是否已读 */
    isRead: boolean;
    /** 关联数据ID */
    relatedId: string;
    /** 创建时间 */
    createdAt: string;
  }

  /** 未读返回参数 */
  export interface UnreadCount {
    count: number;
  }

  /** 创建通知参数 */
  export interface CreateNotificationParams {
    /** 通知类型 */
    type: number;
    /** 通知标题 */
    title: string;
    /** 通知内容 */
    content: string;
    /** 关联数据ID */
    relatedId?: string;
  }

  /** 通知详情 */
  export interface NotificationDetail extends NotificationListItem {
    /** 更新时间 */
    updatedAt: string;
  }
}

enum Api {
  /** 获取通知列表 */
  GET_NOTIFICATIONS = "/notifications",
  /** 获取通知未读数量 */
  GET_UNREAD_COUNT = "/notifications/unread-count",
  /** 标记所有通知为已读 */
  MARK_ALL_AS_READ = "/notifications/read-all",
  /** 标记单个通知为已读 */
  MARK_AS_READ = "/notifications/read",
}

/** 获取通知列表 */
export async function getNotificationsApi(
  params?: Partial<NotificationApi.GetNotificationsParams>
) {
  return request.get<PaginationData<NotificationApi.NotificationListItem>>(
    Api.GET_NOTIFICATIONS,
    params
  );
}

/** 获取通知未读数量 */
export async function getUnreadCountApi() {
  return request.get<NotificationApi.UnreadCount>(Api.GET_UNREAD_COUNT);
}

/** 标记所有通知为已读 */
export async function markAllAsReadApi() {
  return request.patch(Api.MARK_ALL_AS_READ);
}

/** 标记单个通知为已读 */
export async function markAsReadApi(id: number) {
  return request.patch(`${Api.MARK_AS_READ}/${id}`);
}
