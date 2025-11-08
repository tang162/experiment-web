import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';
import { UserRole } from '@/types';

// 教师管理模块路由
const teacherRoutes: RouteRecordRaw[] = [
  {
    path: '/teacher',
    component: Layout,
    children: [
      {
        path: 'reservations',
        name: 'TeacherReservations',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '审核管理',
          requiresAuth: true,
          roles: [UserRole.TEACHER],
        },
      },
    ],
  },
];

export default teacherRoutes;
