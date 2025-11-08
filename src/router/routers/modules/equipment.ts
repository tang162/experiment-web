import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

// 设备管理模块路由
const equipmentRoutes: RouteRecordRaw[] = [
  {
    path: '/equipment',
    component: Layout,
    children: [
      {
        path: 'apply',
        name: 'EquipmentApply',
        component: () => import('@/views/equipment/apply.vue'),
        meta: {
          title: '仪器申请',
          requiresAuth: true,
        },
      },
      {
        path: 'repair',
        name: 'EquipmentRepair',
        component: () => import('@/views/equipment/repair.vue'),
        meta: {
          title: '设备报修',
          requiresAuth: true,
        },
      },
    ],
  },
];

export default equipmentRoutes;
