import { Layout } from "@/layouts";
import type { RouteRecordRaw } from "vue-router";

// 实验室管理模块路由
const labRoutes: RouteRecordRaw[] = [
  // 首页（作为实验室模块的一部分）
  {
    path: "/lab",
    component: Layout,
    redirect: "/lab/home",
    children: [
      {
        path: "home",
        name: "LabHome",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          requiresAuth: true,
        },
      },
      {
        path: "labs",
        name: "Labs",
        component: () => import("@/views/labs/index.vue"),
        meta: {
          title: "实验室列表",
          requiresAuth: true,
        },
      },
      {
        path: "labs/:id",
        name: "LabDetail",
        component: () => import("@/views/labs/detail.vue"),
        meta: {
          title: "实验室详情",
          requiresAuth: true,
        },
      },
      {
        path: "labs/:id/reserve",
        name: "LabReserve",
        component: () => import("@/views/labs/reserve.vue"),
        meta: {
          title: "预约实验室",
          requiresAuth: true,
        },
      },
      // 管理员路由
      {
        path: "labs/admin",
        name: "LabAdmin",
        component: () => import("@/views/labs/admin/index.vue"),
        meta: {
          title: "实验室管理",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "labs/admin/create",
        name: "LabCreate",
        component: () => import("@/views/labs/admin/form.vue"),
        meta: {
          title: "新建实验室",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
      {
        path: "labs/admin/edit/:id",
        name: "LabEdit",
        component: () => import("@/views/labs/admin/form.vue"),
        meta: {
          title: "编辑实验室",
          requiresAuth: true,
          roles: ["admin"],
        },
      },
    ],
  },
];

export default labRoutes;
