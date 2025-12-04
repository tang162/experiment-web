
<script setup>
import { computed } from 'vue';
import { ElTag, ElButton } from 'element-plus';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click', 'view-detail']);

// 状态映射: 0-待审核,1-已通过,2-已拒绝,3-已归还
const statusMap = {
  0: { type: 'warning', text: '待审核' },
  1: { type: 'success', text: '已通过' },
  2: { type: 'danger', text: '已拒绝' },
  3: { type: 'info', text: '已归还' },
};

const statusType = computed(() => {
  return statusMap[props.application.status]?.type || 'info';
});

const statusText = computed(() => {
  return statusMap[props.application.status]?.text || '未知';
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

  </div>
</template>


<style scoped>
.application-card:hover {
  transform: translateY(-2px);
}
</style>
