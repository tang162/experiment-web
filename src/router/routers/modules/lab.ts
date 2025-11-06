import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

const labRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        requiresAuth: true,
      },
    },
    {
      path: '/labs',
      name: 'Labs',
      component: () => import('@/views/labs/index.vue'),
      meta: {
        title: '实验室列表',
        requiresAuth: true,
      },
    },
    {
      path: '/labs/:id',
      name: 'LabDetail',
      component: () => import('@/views/labs/detail.vue'),
      meta: {
        title: '实验室详情',
        requiresAuth: true,
      },
    },
    {
      path: '/labs/:id/reserve',
      name: 'LabReserve',
      component: () => import('@/views/labs/reserve.vue'),
      meta: {
        title: '预约实验室',
        requiresAuth: true,
      },
    },
  ],
};

export default labRoutes;
