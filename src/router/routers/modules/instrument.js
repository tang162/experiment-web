import { Layout } from '@/layouts';

/**
 * 仪器模块路由
 * 包含：仪器浏览、仪器详情、申请使用仪器
 * 
 * 参考后端接口：
 * - GET /api/instruments - 公开
 * - GET /api/instruments/:id - 公开
 * - POST /api/instruments/apply/:id - 需要登录
 */
const instrumentRoutes = [
  {
    path: '/instruments',
    component: Layout,
    children: [
      // 仪器列表 - 公开访问
      {
        path: '',
        name: 'Instruments',
        component: () => import('@/views/instruments/index.vue'),
        meta: {
          title: '仪器列表',
          requiresAuth: false,
        },
      },
      // 仪器详情 - 公开访问
      {
        path: ':id',
        name: 'InstrumentDetail',
        component: () => import('@/views/instruments/detail.vue'),
        meta: {
          title: '仪器详情',
          requiresAuth: false,
        },
      },
      // 申请使用仪器 - 需要登录
      {
        path: ':id/apply',
        name: 'InstrumentApply',
        component: () => import('@/views/instruments/apply.vue'),
        meta: {
          title: '申请使用仪器',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default instrumentRoutes;
