import { Layout } from '@/layouts';

// 用户个人中心模块路由
const profileRoutes = [
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },
      {
        path: 'edit',
        name: 'ProfileEdit',
        component: () => import('@/views/profile/edit.vue'),
        meta: {
          title: '编辑个人信息',
          requiresAuth: true,
        },
      },
      {
        path: 'password',
        name: 'ChangePassword',
        component: () => import('@/views/profile/password.vue'),
        meta: {
          title: '修改密码',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default profileRoutes;
