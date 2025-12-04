<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores';
import { UserRole } from '@/types';
import StudentProfile from './components/StudentProfile.vue';
import TeacherProfile from './components/TeacherProfile.vue';

const route = useRoute();
const authStore = useAuthStore();

const isStudent = computed(() => authStore.getUserRole === UserRole.STUDENT);
const isTeacher = computed(() => authStore.getUserRole === UserRole.TEACHER);

// 从 query 参数获取初始标签页
const initialTab = ref(route.query.tab || 'info');
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">个人中心</h1>
        <p class="text-gray-600">管理您的个人信息和记录</p>
      </div>

      <StudentProfile v-if="isStudent" :initial-tab="initialTab" />
      <TeacherProfile v-if="isTeacher" :initial-tab="initialTab" />
    </div>
  </div>
</template>
