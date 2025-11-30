import { Layout } from '@/layouts';
import { UserRole } from '@/types';

// 新闻公告模块路由
const newsRoutes = [
  {
    path: '/news',
    component: Layout,
    children: [
      {
        path: '',
        name: 'NewsList',
        component: () => import('@/views/news/index.vue'),
        meta: {
          title: '新闻公告',
          requiresAuth: true,
        },
      },
      {
        path: ':id',
        name: 'NewsDetail',
        component: () => import('@/views/news/detail.vue'),
        meta: {
          title: '新闻详情',
          requiresAuth: true,
        },
      },
      {
        path: 'create',
        name: 'NewsCreate',
        component: () => import('@/views/news/form.vue'),
        meta: {
          title: '发布新闻',
          requiresAuth: true,
          authority: [UserRole.TEACHER, UserRole.ADMIN],
        },
      },
      {
        path: 'edit/:id',
        name: 'NewsEdit',
        component: () => import('@/views/news/form.vue'),
        meta: {
          title: '编辑新闻',
          requiresAuth: true,
          authority: [UserRole.TEACHER, UserRole.ADMIN],
        },
      },
    ],
  },
];

export default newsRoutes;
