export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
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
