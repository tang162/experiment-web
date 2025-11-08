import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

// 预约管理模块路由
const reservationRoutes: RouteRecordRaw[] = [
  {
    path: '/reservation',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'Reservations',
        component: () => import('@/views/reservations/index.vue'),
        meta: {
          title: '我的预约',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default reservationRoutes;
