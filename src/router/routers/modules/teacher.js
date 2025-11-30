import { Layout } from '@/layouts';

import { UserRole } from '@/types';

// 教师管理模块路由
const teacherRoutes = [
  {
    path: '/teacher',
    component: Layout,
    meta: {
      title: '审核管理',
      authority: [UserRole.TEACHER, UserRole.ADMIN],
    },
    children: [
      {
        path: 'appointments',
        name: 'TeacherAppointments',
        component: () => import('@/views/teacher/appointments.vue'),
        meta: {
          title: '预约审核',
          requiresAuth: true,
          authority: [UserRole.TEACHER, UserRole.ADMIN],
        },
      },
      {
        path: 'applications',
        name: 'TeacherApplications',
        component: () => import('@/views/teacher/applications.vue'),
        meta: {
          title: '仪器申请审核',
          requiresAuth: true,
          authority: [UserRole.TEACHER, UserRole.ADMIN],
        },
      },
      {
        path: 'reservations',
        name: 'TeacherReservations',
        component: () => import('@/views/teacher/reservations.vue'),
        meta: {
          title: '预约管理',
          requiresAuth: true,
          authority: [UserRole.TEACHER, UserRole.ADMIN],
        },
      },
    ],
  },
];

export default teacherRoutes;
