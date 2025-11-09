<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElTag, ElDivider, ElCarousel, ElCarouselItem, ElImage } from 'element-plus';
import { ArrowLeft, Tools } from '@element-plus/icons-vue';
import { getInstrumentDetailApi } from '@/api/modules/instrument.api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import { INSTRUMENT_STATUS_MAP } from '@/types/instrument';

const route = useRoute();
const router = useRouter();

const { data: instrument, loading, execute: fetchInstrumentDetail } = useApi();

const loadInstrumentDetail = async () => {
  const result = await fetchInstrumentDetail(() =>
    getInstrumentDetailApi(Number(route.params.id))
  );

  if (result) {
    instrument.value = result;
  }
};

const goBack = () => {
  router.back();
};

// 申请使用仪器
const applyInstrument = () => {
  // 跳转到申请表单页面
  router.push(`/lab/instruments/${route.params.id}/apply`);
};

// 报告故障
const reportRepair = () => {
  router.push(`/equipment/repair?instrumentId=${route.params.id}`);
};

// 状态相关的计算属性
const statusInfo = computed(() => {
  if (!instrument.value) return { label: '未知', color: 'info' };
  return INSTRUMENT_STATUS_MAP[instrument.value.status || 0];
});

// 是否可以申请
const canApply = computed(() => {
  if (!instrument.value) return false;
  // 只有状态为正常的仪器才能申请
  return instrument.value.status === 0;
});

// 格式化更新时间
const formattedUpdateTime = computed(() => {
  if (!instrument.value?.updatedAt) return '未知';
  return new Date(instrument.value.updatedAt).toLocaleString('zh-CN');
});

const formattedCreatedTime = computed(() => {
  if (!instrument.value?.createdAt) return '未知';
  return new Date(instrument.value.createdAt).toLocaleString('zh-CN');
});

onMounted(() => {
  loadInstrumentDetail();
});
</script>

<template>
  <PageLayout :title="instrument?.name || '仪器详情'" :description="instrument?.model" :loading="loading">
    <div v-if="instrument" class="space-y-6">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <ElButton :icon="ArrowLeft" @click="goBack">返回列表</ElButton>
      </div>

      <!-- 仪器图片轮播 -->
      <div v-if="instrument.images && instrument.images.length > 0"
        class="bg-white rounded-lg shadow-md overflow-hidden">
        <ElCarousel height="400px" :interval="5000">
          <ElCarouselItem v-for="(image, index) in instrument.images" :key="index">
            <ElImage :src="image" fit="cover" class="w-full h-full" />
          </ElCarouselItem>
        </ElCarousel>
      </div>

      <!-- 主要信息卡片 -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ instrument.name }}</h1>
            <p class="text-lg text-gray-600 mb-2">型号: {{ instrument.model }}</p>
            <p class="text-md text-gray-500 mb-3">序列号: {{ instrument.serialNumber || '未设置' }}</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <ElTag :type="statusInfo.color" size="large">
              {{ statusInfo.label }}
            </ElTag>
          </div>
        </div>

        <ElDivider />

        <!-- 详细信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">基本信息</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="text-gray-600 w-24">所属实验室:</span>
                <span class="text-gray-900 font-medium">{{ instrument.lab.name }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-600 w-24">所属院系:</span>
                <span class="text-gray-900">{{ instrument.lab.department }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-600 w-24">设备状态:</span>
                <ElTag :type="statusInfo.color" size="small">{{ statusInfo.label }}</ElTag>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">时间信息</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="text-gray-600 w-24">创建时间:</span>
                <span class="text-gray-900">{{ formattedCreatedTime }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-600 w-24">更新时间:</span>
                <span class="text-gray-900">{{ formattedUpdateTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <ElDivider />

        <!-- 仪器描述 -->
        <div v-if="instrument.description" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">仪器描述</h3>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ instrument.description }}</p>
        </div>

        <!-- 仪器规格 -->
        <div v-if="instrument.specifications" class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">技术规格</h3>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ instrument.specifications }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-4 mt-8">
          <ElButton type="primary" size="large" :disabled="!canApply" @click="applyInstrument">
            {{ canApply ? '申请使用' : '当前不可申请' }}
          </ElButton>
          <ElButton type="warning" size="large" :icon="Tools" @click="reportRepair">
            报告故障
          </ElButton>
        </div>

        <div v-if="!canApply" class="mt-4">
          <p class="text-sm text-gray-500">
            * 该仪器当前状态为"{{ statusInfo.label }}"，暂时无法申请使用
          </p>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
