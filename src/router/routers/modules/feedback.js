import { Layout } from "@/layouts";

/**
 * 问题反馈模块路由
 */
const feedbackRoutes = [
  {
    path: "/",
    component: Layout,
    children: [
      // 反馈列表 - 需要登录
      {
        path: "feedbacks",
        name: "Feedbacks",
        component: () => import("@/views/feedbacks/index.vue"),
        meta: {
          title: "问题反馈",
          requiresAuth: true,
        },
      },
      // 创建反馈 - 需要登录（必须在:id路由之前）
      {
        path: "feedbacks/create",
        name: "FeedbackCreate",
        component: () => import("@/views/feedbacks/create.vue"),
        meta: {
          title: "提交反馈",
          requiresAuth: true,
        },
      },
      // 反馈详情 - 需要登录
      {
        path: "feedbacks/:id",
        name: "FeedbackDetail",
        component: () => import("@/views/feedbacks/detail.vue"),
        meta: {
          title: "反馈详情",
          requiresAuth: true,
        },
      },
    ],
  },
];

export default feedbackRoutes;
