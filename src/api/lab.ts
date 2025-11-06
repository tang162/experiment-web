import { request } from '@/utils';
import type { Lab, LabFilter, LabReview } from '@/types';

export interface LabListResponse {
  list: Lab[];
  total: number;
}

export const labApi = {
  getLabList(params: LabFilter & { page?: number; pageSize?: number }) {
    return request.get<LabListResponse>('/api/labs', params);
  },

  getLabDetail(id: string | number) {
    return request.get<Lab>(`/api/labs/${id}`);
  },

  getPopularLabs(limit = 6) {
    return request.get<Lab[]>('/api/labs/popular', { limit });
  },

  toggleFavorite(labId: string | number) {
    return request.post(`/api/labs/${labId}/favorite`);
  },

  getFavoriteLabs(params: { page?: number; pageSize?: number }) {
    return request.get<LabListResponse>('/api/labs/favorites', params);
  },

  getLabReviews(labId: string | number, params: { page?: number; pageSize?: number }) {
    return request.get<{ list: LabReview[]; total: number }>(`/api/labs/${labId}/reviews`, params);
  },

  createReview(labId: string | number, data: Omit<LabReview, 'id' | 'labId' | 'userId' | 'userName' | 'createdAt'>) {
    return request.post<LabReview>(`/api/labs/${labId}/reviews`, data);
  },
};
