import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

// 消息通知模块路由
const notificationRoutes: RouteRecordRaw[] = [
  {
    path: '/notification',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'Notifications',
        component: () => import('@/views/notifications/index.vue'),
        meta: {
          title: '消息通知',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default notificationRoutes;
