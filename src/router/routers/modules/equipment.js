import { Layout } from '@/layouts';

/**
 * 设备保修模块路由
 * 包含：报告故障
 * 
 * 参考后端接口：
 * - POST /api/repairs/instruments/:instrumentId - 需要登录
 */
const equipmentRoutes = [
  {
    path: '/equipment',
    component: Layout,
    children: [
      // 报告设备故障 - 需要登录
      {
        path: 'repair',
        name: 'EquipmentRepair',
        component: () => import('@/views/equipment/repair.vue'),
        meta: {
          title: '报告设备故障',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default equipmentRoutes;
