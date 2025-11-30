<script setup>
import { useRouter } from 'vue-router';
import { ElButton, ElCard } from 'element-plus';

const router = useRouter();

const features = [
  {
    emoji: '🏫',
    title: '实验室预约',
    description: '轻松预约您需要的实验室，管理您的预约记录',
  },
  {
    emoji: '🔧',
    title: '仪器申请',
    description: '申请使用各类实验仪器，提高实验效率',
  },
  {
    emoji: '👤',
    title: '用户管理',
    description: '管理个人信息，查看申请和预约记录',
  },
];

const handleLogin = () => {
  router.push('/login');
};

const handleRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
    <!-- 导航栏 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="text-2xl font-bold text-indigo-600">
            实验室预约系统
          </div>
          <div class="flex gap-4">
            <ElButton type="primary" @click="handleLogin">
              登录
            </ElButton>
            <ElButton @click="handleRegister">
              注册
            </ElButton>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-16">
      <!-- 英雄区域 -->
      <section class="text-center mb-20">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          欢迎来到实验室预约系统
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          一个高效、便捷的实验室资源管理平台。学生可以轻松预约实验室和申请仪器，教师可以管理实验室资源和审核申请。
        </p>
        <div class="flex gap-4 justify-center">
          <ElButton type="primary" size="large" @click="handleLogin">
            <ElIcon class="mr-2">
              <Login />
            </ElIcon>
            立即登录
          </ElButton>
          <ElButton size="large" @click="handleRegister">
            创建账户
          </ElButton>
        </div>
      </section>

      <!-- 功能特性 -->
      <section class="mb-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          核心功能
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ElCard
            v-for="(feature, index) in features"
            :key="index"
            shadow="hover"
            class="text-center hover:shadow-lg transition-shadow"
          >
            <div class="mb-4 text-5xl text-indigo-600">
              {{ feature.emoji }}
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600">
              {{ feature.description }}
            </p>
          </ElCard>
        </div>
      </section>

      <!-- 优势说明 -->
      <section class="bg-white rounded-lg shadow-md p-12 mb-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          为什么选择我们
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                ✓
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                实时预约
              </h3>
              <p class="mt-2 text-gray-600">
                实时查看实验室和仪器的可用状态，快速完成预约
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                ✓
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                智能审核
              </h3>
              <p class="mt-2 text-gray-600">
                教师可以快速审核学生的预约和申请，提高工作效率
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                ✓
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                完整记录
              </h3>
              <p class="mt-2 text-gray-600">
                保存所有预约和申请记录，方便查询和统计
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                ✓
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                用户友好
              </h3>
              <p class="mt-2 text-gray-600">
                简洁直观的界面设计，易于上手和使用
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 用户角色说明 -->
      <section class="mb-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          用户角色
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ElCard shadow="hover">
            <template #header>
              <div class="text-xl font-semibold text-indigo-600">
                学生
              </div>
            </template>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                浏览实验室和仪器信息
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                预约实验室
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                申请使用仪器
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                查看预约和申请记录
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                报告设备故障
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                评价实验室
              </li>
            </ul>
          </ElCard>

          <ElCard shadow="hover">
            <template #header>
              <div class="text-xl font-semibold text-indigo-600">
                教师
              </div>
            </template>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                创建和管理实验室
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                创建和管理仪器
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                审核学生预约
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                审核仪器申请
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                发布新闻公告
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-600">•</span>
                查看统计数据
              </li>
            </ul>
          </ElCard>
        </div>
      </section>

      <!-- 底部CTA -->
      <section class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">
          准备好了吗？
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          立即登录或注册账户，开始使用实验室预约系统
        </p>
        <div class="flex gap-4 justify-center">
          <ElButton type="primary" size="large" @click="handleLogin">
            登录
          </ElButton>
          <ElButton size="large" @click="handleRegister">
            注册
          </ElButton>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-8 mt-20">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2024 实验室预约系统. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
