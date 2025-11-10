import { Layout } from "@/layouts";


// 实验室管理模块路由
const labRoutes = [
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
      // 管理员路由 - 必须在动态路由之前定义
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
      // 动态路由 - 必须在静态路由之后定义
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
        path: "labs/reserve/:id",
        name: "LabReserve",
        component: () => import("@/views/labs/reserve.vue"),
        meta: {
          title: "预约实验室",
          requiresAuth: true,
        },
      },
      // 仪器管理路由
      {
        path: "instruments",
        name: "Instruments",
        component: () => import("@/views/instruments/index.vue"),
        meta: {
          title: "仪器列表",
          requiresAuth: true,
        },
      },
      {
        path: "instruments/:id",
        name: "InstrumentDetail",
        component: () => import("@/views/instruments/detail.vue"),
        meta: {
          title: "仪器详情",
          requiresAuth: true,
        },
      },
      {
        path: "instruments/:id/apply",
        name: "InstrumentApply",
        component: () => import("@/views/instruments/apply.vue"),
        meta: {
          title: "申请使用仪器",
          requiresAuth: true,
        },
      },
    ],
  },
];

export default labRoutes;
