export enum NotificationType {
  RESERVATION_REVIEW = 'RESERVATION_REVIEW',
  LAB_NOTICE = 'LAB_NOTICE',
  RESERVATION_REMINDER = 'RESERVATION_REMINDER',
  APPLICATION_REVIEW = 'APPLICATION_REVIEW',
  REPAIR_UPDATE = 'REPAIR_UPDATE',
}

export interface Notification {
  id: string | number;
  userId: string | number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  relatedId?: string | number;
  relatedType?: string;
  createdAt: string;
}

export interface NotificationFilter {
  type?: NotificationType;
  isRead?: boolean;
}
