import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

const profileRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/profile/index.vue'),
      meta: {
        title: '个人中心',
        requiresAuth: true,
      },
    },
  ],
};

export default profileRoutes;
