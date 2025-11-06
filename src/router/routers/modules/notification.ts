import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

const notificationRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/notifications',
      name: 'Notifications',
      component: () => import('@/views/notifications/index.vue'),
      meta: {
        title: '消息通知',
        requiresAuth: true,
      },
    },
  ],
};

export default notificationRoutes;
