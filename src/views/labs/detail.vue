<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElTag, ElDivider, ElRate, ElCarousel, ElCarouselItem, ElImage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { getLabDetailApi } from '@/api';
import type { LabApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';

const route = useRoute();
const router = useRouter();

const { data: lab, loading, execute: fetchLabDetail } = useApi<LabApi.LabDetail>();

const loadLabDetail = async () => {
  const result = await fetchLabDetail(() =>
    getLabDetailApi(Number(route.params.id))
  );

  if (result) {
    lab.value = result;
  }
};

const goBack = () => {
  router.back();
};

const goToReserve = () => {
  router.push(`/lab/labs/${route.params.id}/reserve`);
};

// 状态相关的计算属性
const statusType = computed(() => {
  if (!lab.value) return 'info';
  switch (lab.value.status) {
    case 0: // 正常
      return 'success';
    case 1: // 维护中
      return 'warning';
    case 2: // 停用
      return 'danger';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  if (!lab.value) return '未知';
  switch (lab.value.status) {
    case 0: // 正常
      return '正常';
    case 1: // 维护中
      return '维护中';
    case 2: // 停用
      return '停用';
    default:
      return '未知';
  }
});

// 格式化更新时间
const formattedUpdateTime = computed(() => {
  if (!lab.value?.updatedAt) return '未知';
  return new Date(lab.value.updatedAt).toLocaleString('zh-CN');
});

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
    <div v-if="lab" class="space-y-6">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <ElButton :icon="ArrowLeft" @click="goBack">返回列表</ElButton>
      </div>

      <!-- 实验室图片轮播 -->
      <div v-if="lab.images && lab.images.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <ElCarousel height="400px" :interval="5000">
          <ElCarouselItem v-for="(image, index) in lab.images" :key="index">
            <ElImage :src="image" fit="cover" class="w-full h-full" />
          </ElCarouselItem>
        </ElCarousel>
      </div>

      <!-- 主要信息卡片 -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ lab.name }}</h1>
            <p class="text-lg text-gray-600 mb-2">{{ lab.department }}</p>
            <div class="flex items-center space-x-2">
              <ElTag :type="statusType">{{ statusText }}</ElTag>
              <span class="text-sm text-gray-500">更新于 {{ formattedUpdateTime }}</span>
            </div>
          </div>
          <div>
            <ElButton
              type="primary"
              size="large"
              @click="goToReserve"
              :disabled="lab.status !== 0"
            >
              {{ lab.status === 0 ? '预约实验室' : '暂不可预约' }}
            </ElButton>
          </div>
        </div>

        <ElDivider />

        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800">基本信息</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">实验室名称：</span>
                <span class="font-medium">{{ lab.name }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">所属院系：</span>
                <span class="font-medium">{{ lab.department }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">实验室位置：</span>
                <span class="font-medium">{{ lab.location }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">容纳人数：</span>
                <span class="font-medium">{{ lab.capacity }} 人</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">实验室状态：</span>
                <ElTag :type="statusType">{{ statusText }}</ElTag>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">综合评分：</span>
                <div class="flex items-center">
                  <ElRate :model-value="lab.rating" disabled show-score text-color="#ff9900" />
                </div>
              </div>
            </div>
          </div>

          <!-- 标签和设备 -->
          <div class="space-y-6">
            <div v-if="lab.tags && lab.tags.length > 0">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">实验室标签</h3>
              <div class="flex flex-wrap gap-2">
                <ElTag v-for="tag in lab.tags" :key="tag" type="primary" effect="plain">
                  {{ tag }}
                </ElTag>
              </div>
            </div>

            <div v-if="lab.equipmentList && lab.equipmentList.length > 0">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">设备列表</h3>
              <div class="flex flex-wrap gap-2">
                <ElTag v-for="equipment in lab.equipmentList" :key="equipment" type="success" effect="plain">
                  {{ equipment }}
                </ElTag>
              </div>
            </div>
          </div>
        </div>

        <!-- 实验室介绍 -->
        <div v-if="lab.description">
          <ElDivider />
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800">实验室介绍</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ lab.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
