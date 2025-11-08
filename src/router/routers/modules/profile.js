import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

// 用户个人中心模块路由
const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default profileRoutes;
