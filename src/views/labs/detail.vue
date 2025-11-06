<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElIcon, ElTag, ElDivider, ElRate } from 'element-plus';
import { labApi } from '@/api';
import type { Lab } from '@/types';

const route = useRoute();
const router = useRouter();

const lab = ref<Lab | null>(null);
const loading = ref(false);

const fetchLabDetail = async () => {
  loading.value = true;
  try {
    lab.value = await labApi.getLabDetail(route.params.id as string);
  } catch (error) {
    console.error('获取实验室详情失败:', error);
  } finally {
    loading.value = false;
  }
};

const goToReserve = () => {
  router.push(`/labs/${route.params.id}/reserve`);
};

const toggleFavorite = async () => {
  if (!lab.value) return;
  try {
    await labApi.toggleFavorite(lab.value.id);
    lab.value.isFavorite = !lab.value.isFavorite;
  } catch (error) {
    console.error('收藏操作失败:', error);
  }
};

onMounted(() => {
  fetchLabDetail();
});
</script>

<template>
  <div v-loading="loading" class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div v-if="lab" class="bg-white rounded-lg shadow-md p-8">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ lab.name }}</h1>
            <p class="text-gray-600">{{ lab.department }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <ElButton @click="toggleFavorite">
              <ElIcon>
                <Star :filled="lab.isFavorite" />
              </ElIcon>
              {{ lab.isFavorite ? '已收藏' : '收藏' }}
            </ElButton>
            <ElButton type="primary" @click="goToReserve">
              预约实验室
            </ElButton>
          </div>
        </div>

        <ElDivider />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-semibold mb-4">基本信息</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <span class="text-gray-600 w-24">容量：</span>
                <span>{{ lab.capacity }}人</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-600 w-24">状态：</span>
                <ElTag :type="lab.status === 'AVAILABLE' ? 'success' : 'info'">
                  {{ lab.status === 'AVAILABLE' ? '可用' : lab.status === 'OCCUPIED' ? '占用' : '维护中' }}
                </ElTag>
              </div>
              <div class="flex items-center">
                <span class="text-gray-600 w-24">位置：</span>
                <span>{{ lab.location || '未设置' }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-600 w-24">评分：</span>
                <ElRate v-model="lab.rating" disabled show-score />
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-4">设备类型</h3>
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="type in lab.equipmentTypes" :key="type" type="info">
                {{ type }}
              </ElTag>
            </div>
          </div>
        </div>

        <div v-if="lab.description" class="mb-6">
          <h3 class="text-lg font-semibold mb-4">实验室介绍</h3>
          <p class="text-gray-700 leading-relaxed">{{ lab.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
