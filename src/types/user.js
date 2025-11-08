export enum UserRole {
  SUPER_ADMIN = "super_admin", // 超级管理员
  ADMIN = "admin", // 管理员
  STUDENT = "student", // 学生
  TEACHER = "teacher", // 老师
}

export interface User {
  id: string | number;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  nickname?: string;
  avatar?: string;
  teachingTags?: string[];
  auditTimeSlots?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  email?: string;
  phone?: string;
}

export interface LoginForm {
  username: string;
  password: string;
  rememberPassword?: boolean;
}

export interface UpdateProfileForm {
  nickname?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  teachingTags?: string[];
  auditTimeSlots?: string[];
}
