import { request } from '@/utils';
import type { User, LoginForm, RegisterForm } from '@/types';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CheckUsernameResponse {
  available: boolean;
}

export const authApi = {
  login(data: LoginForm) {
    return request.post<LoginResponse>('/api/auth/login', data);
  },

  register(data: RegisterForm) {
    return request.post<LoginResponse>('/api/auth/register', data);
  },

  logout() {
    return request.post('/api/auth/logout');
  },

  checkUsername(username: string) {
    return request.get<CheckUsernameResponse>('/api/auth/check-username', { username });
  },

  getUserInfo() {
    return request.get<User>('/api/auth/user');
  },
};
