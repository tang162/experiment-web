import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';
import { UserRole } from '@/types';

const teacherRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/teacher/reservations',
      name: 'TeacherReservations',
      component: () => import('@/views/profile/index.vue'),
      meta: {
        title: '审核管理',
        requiresAuth: true,
        roles: [UserRole.TEACHER],
      },
    },
  ],
};

export default teacherRoutes;
