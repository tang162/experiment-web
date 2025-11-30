import { Layout } from '@/layouts';

// 维修记录模块路由
const repairsRoutes = [
  {
    path: '/repairs',
    component: Layout,
    children: [
      {
        path: 'my',
        name: 'MyRepairs',
        component: () => import('@/views/repairs/index.vue'),
        meta: {
          title: '我的维修记录',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default repairsRoutes;
