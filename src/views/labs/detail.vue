<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElIcon, ElTag, ElDivider, ElRate, ElMessage } from 'element-plus';
import { getLabDetailApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import type { Lab } from '@/types';

const route = useRoute();
const router = useRouter();

const { data: lab, loading, execute: fetchLabDetail } = useApi<Lab>();

const loadLabDetail = async () => {
  const result = await fetchLabDetail(() =>
    getLabDetailApi(Number(route.params.id))
  );

  if (result) {
    lab.value = result;
  }
};

const goToReserve = () => {
  router.push(`/lab/labs/${route.params.id}/reserve`);
};

const toggleFavorite = async () => {
  if (!lab.value) return;
  // TODO: Implement favorite toggle API
  lab.value.isFavorite = !lab.value.isFavorite;
  ElMessage.success(lab.value.isFavorite ? '已添加收藏' : '已取消收藏');
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
              <ElTag :type="lab.status === 0 ? 'success' : lab.status === 1 ? 'warning' : 'danger'">
                {{ lab.status === 0 ? '正常' : lab.status === 1 ? '维护中' : '停用' }}
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

        <div v-if="lab.equipmentList && lab.equipmentList.length > 0">
          <h3 class="text-lg font-semibold mb-4">设备列表</h3>
          <div class="flex flex-wrap gap-2">
            <ElTag v-for="equipment in lab.equipmentList" :key="equipment" type="info">
              {{ equipment }}
            </ElTag>
          </div>
        </div>
        <div v-else-if="lab.tags && lab.tags.length > 0">
          <h3 class="text-lg font-semibold mb-4">标签</h3>
          <div class="flex flex-wrap gap-2">
            <ElTag v-for="tag in lab.tags" :key="tag" type="info">
              {{ tag }}
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
