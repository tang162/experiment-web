export namespace NotificationApi {
  /** 查询通知参数 */
  export interface GetNotificationsParams {
    /** 通知类型 */
    type?: NotificationType;
    /** 是否已读 */
    isRead?: boolean;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  }

  /** 通知列表项 */
  export interface NotificationListItem {
    /** 通知ID */
    id: number;
    /** 通知类型 */
    type: NotificationType;
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

  /** 创建通知参数 */
  export interface CreateNotificationParams {
    /** 通知类型 */
    type: NotificationType;
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
  GET_NOTIFICATIONS = '/notifications',
  /** 获取通知详情 */
  GET_NOTIFICATION_DETAIL = '/notifications',
  /** 创建通知 */
  CREATE_NOTIFICATION = '/notifications',
  /** 标记通知为已读 */
  MARK_AS_READ = '/notifications',
  /** 标记所有通知为已读 */
  MARK_ALL_AS_READ = '/notifications/mark-all',
  /** 删除通知 */
  DELETE_NOTIFICATION = '/notifications',
  /** 清空所有通知 */
  CLEAR_ALL_NOTIFICATIONS = '/notifications/clear-all',
}

/** 获取通知列表 */
export async function getNotificationsApi(
  params: Partial<NotificationApi.GetNotificationsParams>,
) {
 
}

/** 获取通知详情 */
export async function getNotificationDetailApi(id: number) {
 
}

/** 创建通知 */
export async function createNotificationApi(
  params: NotificationApi.CreateNotificationParams,
) {
  
}

/** 标记通知为已读 */
export async function markAsReadApi(id: number) {
}

/** 标记所有通知为已读 */
  return request.patch<{ message: string }>(Api.MARK_ALL_AS_READ);
}

/** 删除通知 */
export async function deleteNotificationApi(id: number) {
  
}

/** 清空所有通知 */
export async function clearAllNotificationsApi() {
}
