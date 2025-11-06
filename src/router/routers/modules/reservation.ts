import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

const reservationRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/reservations',
      name: 'Reservations',
      component: () => import('@/views/reservations/index.vue'),
      meta: {
        title: '我的预约',
        requiresAuth: true,
      },
    },
  ],
};

export default reservationRoutes;
