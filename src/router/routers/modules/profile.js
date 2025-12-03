import { Layout } from '@/layouts';

/**
 * 个人中心模块路由
 * 包含：个人信息、我的预约、我的申请、我的维修记录
 * 
 * 参考后端接口：
 * - GET /api/user/info - 需要登录
 * - POST /api/user/profile - 需要登录
 * - POST /api/user/change-password - 需要登录
 * - GET /api/appointments/my - 需要登录
 * - GET /api/instruments/applications/my - 需要登录
 * - GET /api/repairs/my - 需要登录
 */
const profileRoutes = [
  {
    path: '/profile',
    component: Layout,
    children: [
      // 个人中心首页
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },
      // 编辑个人信息
      {
        path: 'edit',
        name: 'ProfileEdit',
        component: () => import('@/views/profile/edit.vue'),
        meta: {
          title: '编辑个人信息',
          requiresAuth: true,
        },
      },
      // 修改密码
      {
        path: 'password',
        name: 'ChangePassword',
        component: () => import('@/views/profile/password.vue'),
        meta: {
          title: '修改密码',
          requiresAuth: true,
        },
      },
      // 我的预约
      {
        path: 'reservations',
        name: 'MyReservations',
        component: () => import('@/views/reservations/index.vue'),
        meta: {
          title: '我的预约',
          requiresAuth: true,
        },
      },
      // 预约详情
      {
        path: 'reservations/:id',
        name: 'ReservationDetail',
        component: () => import('@/views/reservations/detail.vue'),
        meta: {
          title: '预约详情',
          requiresAuth: true,
        },
      },
      // 我的申请
      {
        path: 'applications',
        name: 'MyApplications',
        component: () => import('@/views/applications/index.vue'),
        meta: {
          title: '我的申请',
          requiresAuth: true,
        },
      },
      // 我的维修记录
      {
        path: 'repairs',
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

export default profileRoutes;
