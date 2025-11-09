import { Layout } from '@/layouts';


// 消息通知模块路由
const notificationRoutes = [
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
