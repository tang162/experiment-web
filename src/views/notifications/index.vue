<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">消息通知</h1>
      <div class="bg-white rounded-lg shadow-md p-6">
        <ElEmpty description="暂无消息" />
      </div>
    </div>
  </div>
</template>
