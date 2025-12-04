<template>
  <div class="application-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer" @click="handleClick">
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ application.instrument?.name || '未知仪器' }}</h3>
        <p class="text-sm text-gray-500">申请ID: {{ application.id }}</p>
      </div>
      <ElTag :type="statusType" size="small">{{ statusText }}</ElTag>
    </div>

    <div class="space-y-2 text-sm">
      <div class="flex items-center text-gray-600">
        <span class="w-16 text-gray-500">型号：</span>
        <span>{{ application.instrument?.model || '未设置' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <span class="w-16 text-gray-500">序列号：</span>
        <span>{{ application.instrument?.serialNumber || '未设置' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <span class="w-16 text-gray-500">实验室：</span>
        <span>{{ application.instrument?.lab?.name || '未知' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <span class="w-16 text-gray-500">申请时间：</span>
        <span>{{ formatDate(application.createdAt) }}</span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end">
      <ElButton type="primary" size="small" @click.stop="handleViewDetail">
        查看详情
      </ElButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElTag, ElButton } from 'element-plus';
import { ApplicationStatus } from '@/types';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click', 'view-detail']);

const statusType = computed(() => {
  switch (props.application.status) {
    case ApplicationStatus.PENDING:
      return 'warning';
    case ApplicationStatus.APPROVED:
      return 'success';
    case ApplicationStatus.REJECTED:
      return 'danger';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  switch (props.application.status) {
    case ApplicationStatus.PENDING:
      return '待审核';
    case ApplicationStatus.APPROVED:
      return '已通过';
    case ApplicationStatus.REJECTED:
      return '已驳回';
    default:
      return '未知';
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const handleClick = () => {
  emit('click', props.application);
};

const handleViewDetail = () => {
  emit('view-detail', props.application);
};
</script>

<style scoped>
.application-card:hover {
  transform: translateY(-2px);
}
</style>
