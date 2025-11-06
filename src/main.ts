import { createApp } from "vue";
import "@/styles/index.scss";
import App from "./App.vue";

import { router } from "@/router";
import { initStores } from "@/stores";

// 导入自定义指令;
import { setupDirectives } from "@/utils";

async function bootstrap() {
  const app = createApp(App);

  // 注册自定义指令
  setupDirectives(app);

  // 批量注册 models 模块（会自动调用各模块的 init 方法）
  await initStores(app, {
    namespace: "tang",
  });

  // 注册路由
  app.use(router);

  // 挂载应用
  app.mount("#app");
}

bootstrap();
