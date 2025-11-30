<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElButton, ElIcon, ElBreadcrumb, ElBreadcrumbItem, ElSkeleton } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  // 页面标题
  title: {
    type: String,
    default: '',
  },
  // 页面描述
  description: {
    type: String,
    default: '',
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true,
  },
  // 返回按钮文本
  backText: {
    type: String,
    default: '返回',
  },
  // 面包屑导航项
  breadcrumbs: {
    type: Array,
    default: () => [],
    // 每个项应包含: label, path
  },
  // 是否显示面包屑导航
  showBreadcrumb: {
    type: Boolean,
    default: true,
  },
  // 页面头部背景色
  headerBg: {
    type: String,
    default: 'bg-white',
  },
  // 页面内容背景色
  contentBg: {
    type: String,
    default: 'bg-gray-50',
  },
});

const emit = defineEmits(['back']);

// 处理返回
const handleBack = () => {
  emit('back');
  router.back();
};

// 处理面包屑导航点击
const handleBreadcrumbClick = (path) => {
  if (path) {
    router.push(path);
  }
};

// 生成面包屑导航
const generateBreadcrumbs = computed(() => {
  if (props.breadcrumbs && props.breadcrumbs.length > 0) {
    return props.breadcrumbs;
  }

  // 从路由生成面包屑
  const breadcrumbs = [];
  const routePath = route.path.split('/').filter((p) => p);

  // 添加首页
  breadcrumbs.push({
    label: '首页',
    path: '/',
  });

  // 添加当前路由的面包屑
  let currentPath = '';
  routePath.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === routePath.length - 1;

    if (!isLast) {
      breadcrumbs.push({
        label: segment,
        path: currentPath,
      });
    }
  });

  return breadcrumbs;
});
</script>

<template>
  <div class="page-layout-wrapper">
    <!-- 页面头部 -->
    <div :class="['page-header', headerBg]">
      <div class="container mx-auto px-4 py-6">
        <!-- 返回按钮和标题 -->
        <div class="flex items-center gap-4 mb-4">
          <ElButton
            v-if="showBack"
            type="primary"
            text
            @click="handleBack"
          >
            <ElIcon class="mr-1">
              <ArrowLeft />
            </ElIcon>
            {{ backText }}
          </ElButton>
          <div v-if="title" class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
            <p v-if="description" class="text-gray-600 mt-1">{{ description }}</p>
          </div>
        </div>

        <!-- 面包屑导航 -->
        <ElBreadcrumb v-if="showBreadcrumb && generateBreadcrumbs.length > 0" separator="/">
          <ElBreadcrumbItem
            v-for="(breadcrumb, index) in generateBreadcrumbs"
            :key="index"
            :to="breadcrumb.path"
          >
            {{ breadcrumb.label }}
          </ElBreadcrumbItem>
        </ElBreadcrumb>
      </div>
    </div>

    <!-- 页面内容 -->
    <div :class="['page-content', contentBg]">
      <div class="container mx-auto px-4 py-8">
        <!-- 加载状态 -->
        <ElSkeleton v-if="loading" :rows="5" animated />

        <!-- 页面内容插槽 -->
        <slot v-else />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .page-header {
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .page-content {
    flex: 1;
    min-height: calc(100vh - 200px);
  }
}
</style>
