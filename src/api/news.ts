import { request } from '@/utils';
import type { LabNews, NewsFilter } from '@/types';

export interface NewsListResponse {
  list: LabNews[];
  total: number;
}

export const newsApi = {
  getNewsList(params: NewsFilter & { page?: number; pageSize?: number }) {
    return request.get<NewsListResponse>('/api/news', params);
  },

  getNewsDetail(id: string | number) {
    return request.get<LabNews>(`/api/news/${id}`);
  },

  toggleLike(id: string | number) {
    return request.post(`/api/news/${id}/like`);
  },

  toggleFavorite(id: string | number) {
    return request.post(`/api/news/${id}/favorite`);
  },
};
