import { Layout } from "@/layouts";

/**
 * 实验室相关模块路由
 * 包含：首页、实验室浏览、实验室管理、实验室预约
 * 
 * 参考后端接口：
 * - GET /api/labs - 公开（支持可选认证）
 * - GET /api/labs/popular - 公开（支持可选认证）
 * - GET /api/labs/:id - 公开（支持可选认证）
 * - POST /api/labs - 需要教师及以上权限
 * - POST /api/labs/:id - 需要教师及以上权限
 * - DELETE /api/labs/:id - 需要管理员权限
 * - POST /api/appointments - 需要登录
 * - GET /api/appointments/my - 需要登录
 */
const labRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      // 首页 - 公开访问
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          requiresAuth: false,
        },
      },
      // 实验室列表 - 公开访问
      {
        path: "labs",
        name: "Labs",
        component: () => import("@/views/labs/index.vue"),
        meta: {
          title: "实验室列表",
          requiresAuth: false,
        },
      },
      // 实验室管理（教师功能）- 需要教师权限
      {
        path: "labs/admin",
        name: "LabAdmin",
        component: () => import("@/views/labs/admin/index.vue"),
        meta: {
          title: "实验室管理",
          requiresAuth: true,
          roles: ["teacher"],
        },
      },
      // 创建实验室 - 需要教师权限
      {
        path: "labs/admin/create",
        name: "LabCreate",
        component: () => import("@/views/labs/admin/form.vue"),
        meta: {
          title: "新建实验室",
          requiresAuth: true,
          roles: ["teacher"],
        },
      },
      // 编辑实验室 - 需要教师权限
      {
        path: "labs/admin/edit/:id",
        name: "LabEdit",
        component: () => import("@/views/labs/admin/form.vue"),
        meta: {
          title: "编辑实验室",
          requiresAuth: true,
          roles: ["teacher"],
        },
      },
      // 创建实验室（简化路径）- 需要教师权限
      {
        path: "labs/create",
        name: "LabCreateSimple",
        component: () => import("@/views/labs/admin/form.vue"),
        meta: {
          title: "新建实验室",
          requiresAuth: true,
          roles: ["teacher"],
        },
      },
      // 编辑实验室（简化路径）- 需要教师权限
      {
        path: "labs/:id/edit",
        name: "LabEditSimple",
        component: () => import("@/views/labs/admin/form.vue"),
        meta: {
          title: "编辑实验室",
          requiresAuth: true,
          roles: ["teacher"],
        },
      },
      // 实验室详情 - 公开访问
      {
        path: "labs/:id",
        name: "LabDetail",
        component: () => import("@/views/labs/detail.vue"),
        meta: {
          title: "实验室详情",
          requiresAuth: false,
        },
      },
      // 预约实验室 - 需要登录
      {
        path: "labs/reserve/:id",
        name: "LabReserve",
        component: () => import("@/views/labs/reserve.vue"),
        meta: {
          title: "预约实验室",
          requiresAuth: true,
        },
      },
    ],
  },
];

export default labRoutes;
