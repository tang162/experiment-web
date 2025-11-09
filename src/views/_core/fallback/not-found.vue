<script setup>
import { useRouter } from "vue-router";
import { ElButton } from "element-plus";
import { House, Refresh, Search } from "@element-plus/icons-vue";

defineOptions({ name: "Fallback404Demo" });

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.go(-1);
};

const reload = () => {
  window.location.reload();
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
    <!-- 404 动画图标 -->
    <div class="relative mb-8">
      <div class="text-9xl font-bold text-purple-200 select-none">404</div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-6xl font-bold text-purple-600 select-none animate-pulse">
          404
        </div>
      </div>
    </div>

    <!-- 错误信息 -->
    <div class="text-center mb-8 max-w-md">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">页面未找到</h1>
      <p class="text-gray-600 mb-2">抱歉，您访问的页面不存在或已被移除。</p>
      <p class="text-gray-500 text-sm">
        请检查网址是否正确，或返回首页重新浏览。
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-col sm:flex-row gap-4 mb-8">
      <ElButton type="primary" size="large" @click="goHome" :icon="House"
        class="flex items-center justify-center min-w-[140px] transition-all">
        返回首页
      </ElButton>

      <ElButton size="large" @click="goBack" :icon="Refresh"
        class="flex items-center justify-center min-w-[140px] transition-all">
        返回上页
      </ElButton>
    </div>

    <!-- 帮助信息 -->
    <div class="text-center text-gray-400 text-sm max-w-sm">
      <p class="mb-2">如果问题持续存在，您可以：</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ElButton text type="primary" @click="reload" :icon="Refresh" class="flex items-center gap-1">
          刷新页面
        </ElButton>
        <span class="hidden sm:inline text-gray-300">|</span>
        <router-link to="/my/help"
          class="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors">
          寻求帮助
        </router-link>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
    <div class="absolute top-20 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
    <div class="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 rounded-full opacity-20 animate-pulse delay-2000">
    </div>
    <div class="absolute bottom-10 right-10 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-pulse delay-3000">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}

.delay-3000 {
  animation-delay: 3s;
}

.ElButton {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;

  &.ElButton--primary {
    background: linear-gradient(135deg, #9052fe 0%, #7c3aed 100%);
    border: none;

    &:hover {
      background: linear-gradient(135deg, #9e67fc 0%, #8b5cf6 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(144, 82, 254, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &:not(.ElButton--primary) {
    border-color: #d1d5db;
    color: #6b7280;

    &:hover {
      border-color: #9052fe;
      color: #9052fe;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 640px) {
  .text-9xl {
    font-size: 6rem;
  }

  .text-6xl {
    font-size: 4rem;
  }

  .text-3xl {
    font-size: 1.5rem;
  }
}
</style>
