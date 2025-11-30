/**
 * API 响应类型定义
 */

/** 基础响应结构 */
export interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

/** 分页响应结构 */
export interface PaginationResponse<T = any> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  size: number;
}

/** 用户角色 */
export type UserRole = 'STUDENT' | 'TEACHER';

/** 预约状态 */
export type AppointmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

/** 时间段 */
export type TimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING';

/** 仪器状态 */
export type InstrumentStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'DAMAGED';

/** 申请状态 */
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/** 维修状态 */
export type RepairStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/** 故障类型 */
export type FaultType = 'HARDWARE' | 'SOFTWARE' | 'OTHER';

/** 紧急程度 */
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** 新闻状态 */
export type NewsStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';

/** 通知类型 */
export type NotificationType = 'SYSTEM' | 'APPOINTMENT' | 'APPLICATION' | 'REPAIR' | 'NEWS';

/** 用户信息 */
export interface UserInfo {
  id: number;
  username: string;
  realName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

/** 实验室信息 */
export interface LabInfo {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description?: string;
  images?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** 预约信息 */
export interface AppointmentInfo {
  id: number;
  labId: number;
  labName: string;
  userId: number;
  username: string;
  appointmentDate: string;
  timeSlot: TimeSlot;
  purpose: string;
  description?: string;
  participantCount: number;
  status: AppointmentStatus;
  rejectionReason?: string;
  reviewerId?: number;
  reviewTime?: string;
  createdAt: string;
  updatedAt: string;
}

/** 仪器信息 */
export interface InstrumentInfo {
  id: number;
  name: string;
  model: string;
  serialNumber?: string;
  labId: number;
  labName?: string;
  status: InstrumentStatus;
  description?: string;
  specifications?: string;
  images?: string[];
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

/** 仪器申请信息 */
export interface InstrumentApplicationInfo {
  id: number;
  instrumentId: number;
  instrumentName: string;
  applicantId: number;
  applicantName: string;
  purpose: string;
  description: string;
  startTime: string;
  endTime: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  reviewerId?: number;
  reviewTime?: string;
  createdAt: string;
  updatedAt: string;
}

/** 维修记录信息 */
export interface RepairInfo {
  id: number;
  repairNumber: string;
  instrumentId: number;
  instrumentName: string;
  reporterId: number;
  reporterName: string;
  faultType: FaultType;
  description: string;
  images?: string[];
  urgency: UrgencyLevel;
  status: RepairStatus;
  repairSummary?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 新闻信息 */
export interface NewsInfo {
  id: number;
  title: string;
  content: string;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  status: NewsStatus;
  likes: number;
  favorites: number;
  authorId: number;
  authorName: string;
  reviewerId?: number;
  reviewTime?: string;
  createdAt: string;
  updatedAt: string;
}

/** 通知信息 */
export interface NotificationInfo {
  id: number;
  userId: number;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 评价信息 */
export interface EvaluationInfo {
  id: number;
  labId: number;
  labName?: string;
  userId: number;
  username?: string;
  overallRating: number;
  equipmentRating: number;
  environmentRating: number;
  serviceRating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

/** 评价统计 */
export interface EvaluationStatistics {
  total: number;
  averageOverallRating: number;
  averageEquipmentRating: number;
  averageEnvironmentRating: number;
  averageServiceRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/** 轮播图类型 */
export interface BannerType {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** 轮播图信息 */
export interface BannerInfo {
  id: number;
  typeId: number;
  typeName?: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  sort: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/** 收藏信息 */
export interface FavoriteInfo {
  id: number;
  userId: number;
  labId: number;
  labName?: string;
  createdAt: string;
}
