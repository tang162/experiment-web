import { request } from '@/utils';
import type { Notification, NotificationFilter } from '@/types';

export interface NotificationListResponse {
  list: Notification[];
  total: number;
  unreadCount: number;
}

export const notificationApi = {
  getNotifications(params: NotificationFilter & { page?: number; pageSize?: number }) {
    return request.get<NotificationListResponse>('/api/notifications', params);
  },

  getUnreadCount() {
    return request.get<{ count: number }>('/api/notifications/unread-count');
  },

  markAsRead(id: string | number) {
    return request.post(`/api/notifications/${id}/read`);
  },

  markAllAsRead() {
    return request.post('/api/notifications/read-all');
  },
};
