<template>
  <div class="repair-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer" @click="handleClick">
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ repair.instrument?.name || '未知仪器' }}</h3>
        <p class="text-sm text-gray-500">报修ID: {{ repair.id }}</p>
      </div>
      <ElTag :type="statusType" size="small">{{ statusText }}</ElTag>
    </div>

    <div class="mb-3">
      <p class="text-sm text-gray-500 mb-1">故障描述：</p>
      <p class="text-sm text-gray-700 line-clamp-3">{{ repair.description }}</p>
    </div>

    <div class="space-y-2 text-sm">
      <div class="flex items-center text-gray-600">
        <span class="w-20 text-gray-500">报修时间：</span>
        <span>{{ formatDate(repair.createdAt) }}</span>
      </div>
      <div v-if="repair.updatedAt && repair.updatedAt !== repair.createdAt" class="flex items-center text-gray-600">
        <span class="w-20 text-gray-500">更新时间：</span>
        <span>{{ formatDate(repair.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElTag } from 'element-plus';
import { RepairStatus } from '@/types';

const props = defineProps({
  repair: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click']);

const statusType = computed(() => {
  switch (props.repair.status) {
    case RepairStatus.PENDING:
      return 'warning';
    case RepairStatus.IN_PROGRESS:
      return 'primary';
    case RepairStatus.COMPLETED:
      return 'success';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  switch (props.repair.status) {
    case RepairStatus.PENDING:
      return '待处理';
    case RepairStatus.IN_PROGRESS:
      return '维修中';
    case RepairStatus.COMPLETED:
      return '已完成';
    default:
      return '未知';
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const handleClick = () => {
  emit('click', props.repair);
};
</script>

<style scoped>
.repair-card:hover {
  transform: translateY(-2px);
}
</style>
