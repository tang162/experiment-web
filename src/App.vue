<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Tailwind v4 基础样式测试 -->
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-3xl font-bold text-primary mb-6">
        Tailwind CSS v4 演示
      </h1>

      <!-- 使用自定义颜色 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-success mb-4">
          v4 新语法特性
        </h2>

        <!-- 任意值语法 -->
        <div class="grid grid-cols-[1fr_2fr] gap-4">
          <div class="p-4 bg-[#f0f9ff] rounded border border-[#0284c7]/20">
            <p class="text-[#0284c7] font-medium">任意值颜色</p>
          </div>
          <div class="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white">
            <p class="font-medium">渐变背景</p>
          </div>
        </div>
      </div>

      <!-- 现代化 Grid 布局 -->
      <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold mb-2">响应式卡片</h3>
          <p class="text-gray-600">自适应布局</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold mb-2">现代语法</h3>
          <p class="text-gray-600">支持 CSS Grid 2.0</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold mb-2">更好性能</h3>
          <p class="text-gray-600">按需生成样式</p>
        </div>
      </div>

      <!-- 交互式按钮 -->
      <div class="flex gap-4 flex-wrap">
        <button
          @click="count++"
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          点击次数: {{ count }}
        </button>

        <button class="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/80 transition-colors">
          成功按钮
        </button>

        <button class="px-6 py-2 bg-warning text-white rounded-lg hover:bg-warning/80 transition-colors">
          警告按钮
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>