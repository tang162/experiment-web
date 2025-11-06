import { request } from '@/utils';
import type { Banner } from '@/types';

export const bannerApi = {
  getBanners(limit = 5) {
    return request.get<Banner[]>('/api/banners', { limit });
  },
};
