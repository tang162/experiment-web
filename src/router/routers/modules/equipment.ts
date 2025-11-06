import { Layout } from '@/layouts';
import type { RouteRecordRaw } from 'vue-router';

const equipmentRoutes: RouteRecordRaw = {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/equipment/apply',
      name: 'EquipmentApply',
      component: () => import('@/views/equipment/apply.vue'),
      meta: {
        title: '仪器申请',
        requiresAuth: true,
      },
    },
    {
      path: '/equipment/repair',
      name: 'EquipmentRepair',
      component: () => import('@/views/equipment/repair.vue'),
      meta: {
        title: '设备报修',
        requiresAuth: true,
      },
    },
  ],
};

export default equipmentRoutes;
