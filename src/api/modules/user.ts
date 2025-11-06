import { request } from '@/utils';
import type { User, UpdateProfileForm } from '@/types';

export const userApi = {
  updateProfile(data: UpdateProfileForm) {
    return request.put<User>('/api/user/profile', data);
  },

  uploadAvatar(file: File) {
    return request.upload<{ url: string }>('/api/user/avatar', { file });
  },
};
