import { Layout } from '@/layouts';

// 收藏模块路由
const favoritesRoutes = [
  {
    path: '/favorites',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Favorites',
        component: () => import('@/views/favorites/index.vue'),
        meta: {
          title: '我的收藏',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default favoritesRoutes;
