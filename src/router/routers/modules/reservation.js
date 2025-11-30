import { Layout } from '@/layouts';


// 预约管理模块路由
const reservationRoutes = [
  {
    path: '/reservations',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Reservations',
        component: () => import('@/views/reservations/index.vue'),
        meta: {
          title: '我的预约',
          requiresAuth: true,
        },
      },
      {
        path: ':id',
        name: 'ReservationDetail',
        component: () => import('@/views/reservations/detail.vue'),
        meta: {
          title: '预约详情',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default reservationRoutes;
