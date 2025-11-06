<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElIcon, ElTag, ElDivider, ElRate, ElMessage } from 'element-plus';
import { labApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import type { Lab } from '@/types';

const route = useRoute();
const router = useRouter();

const { data: lab, loading, execute: fetchLabDetail } = useApi<Lab>();

const loadLabDetail = async () => {
  const result = await fetchLabDetail(() => 
    labApi.getLabDetail(route.params.id as string)
  );
  
  if (result) {
    lab.value = result;
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
    ElMessage.success('操作成功');
  } catch (error) {
    ElMessage.error('收藏操作失败');
  }
};

onMounted(() => {
  loadLabDetail();
});
</script>

<template>
  <PageLayout
    :title="lab?.name || '实验室详情'"
    :description="lab?.department"
    :loading="loading"
  >
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
  </PageLayout>
</template>
