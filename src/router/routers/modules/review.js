import { Layout } from '@/layouts';

/**
 * 审核相关模块路由（教师功能）
 * 包含：预约审核、仪器申请审核
 * 
 * 参考后端接口：
 * - GET /api/appointments/pending - 需要教师及以上权限
 * - PUT /api/appointments/review/:id - 需要教师及以上权限
 * - GET /api/instruments/applications - 需要教师及以上权限
 * - POST /api/instruments/applications/review/:id - 需要教师及以上权限
 */
const reviewRoutes = [
  {
    path: '/teacher',
    component: Layout,
    meta: {
      title: '审核管理',
      requiresAuth: true,
      roles: ['teacher'],
    },
    children: [
      // 预约审核 - 需要教师权限
      {
        path: 'appointments',
        name: 'TeacherAppointments',
        component: () => import('@/views/teacher/appointments.vue'),
        meta: {
          title: '预约审核',
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
      // 仪器申请审核 - 需要教师权限
      {
        path: 'applications',
        name: 'TeacherApplications',
        component: () => import('@/views/teacher/applications.vue'),
        meta: {
          title: '仪器申请审核',
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
    ],
  },
];

export default reviewRoutes;
