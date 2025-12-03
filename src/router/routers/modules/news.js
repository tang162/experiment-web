import { Layout } from '@/layouts';

/**
 * 新闻公告模块路由
 * 参考后端接口：
 * - GET /api/news - 公开
 * - GET /api/news/:id - 公开
 * - POST /api/news - 需要教师权限
 * - POST /api/news/:id - 需要登录
 * - POST /api/news/like/:id - 需要登录
 * - DELETE /api/news/:id - 需要登录
 */
const newsRoutes = [
  {
    path: '/news',
    component: Layout,
    children: [
      // 新闻列表 - 公开访问
      {
        path: '',
        name: 'NewsList',
        component: () => import('@/views/news/index.vue'),
        meta: {
          title: '新闻公告',
          requiresAuth: false,
        },
      },
      // 新闻详情 - 公开访问
      {
        path: ':id',
        name: 'NewsDetail',
        component: () => import('@/views/news/detail.vue'),
        meta: {
          title: '新闻详情',
          requiresAuth: false,
        },
      },
      // 发布新闻 - 需要教师权限
      {
        path: 'create',
        name: 'NewsCreate',
        component: () => import('@/views/news/form.vue'),
        meta: {
          title: '发布新闻',
          requiresAuth: true,
          roles: ['teacher'],
        },
      },
      // 编辑新闻 - 需要登录（自己的新闻）
      {
        path: 'edit/:id',
        name: 'NewsEdit',
        component: () => import('@/views/news/form.vue'),
        meta: {
          title: '编辑新闻',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default newsRoutes;
