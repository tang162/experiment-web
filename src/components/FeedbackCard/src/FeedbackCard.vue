<template>
  <div class="feedback-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer" @click="handleClick">
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ feedback.title }}</h3>
        <p class="text-sm text-gray-500">反馈ID: {{ feedback.id }}</p>
      </div>
      <ElTag :type="statusType" size="small">{{ statusText }}</ElTag>
    </div>

    <div class="space-y-2 text-sm mb-3">
      <div class="flex items-center text-gray-600">
        <span class="w-20 text-gray-500">关联实验室：</span>
        <span>{{ feedback.lab?.name || '未知实验室' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <span class="w-20 text-gray-500">提交时间：</span>
        <span>{{ formatDate(feedback.createdAt) }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <span class="w-20 text-gray-500">回复数：</span>
        <span class="font-medium text-blue-600">{{ feedback.replies?.length || 0 }}</span>
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

const props = defineProps({
  feedback: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click', 'view-detail']);

const statusType = computed(() => {
  switch (props.feedback.status) {
    case 0:
      return 'warning';
    case 1:
      return 'primary';
    case 2:
      return 'success';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  switch (props.feedback.status) {
    case 0:
      return '待处理';
    case 1:
      return '已回复';
    case 2:
      return '已关闭';
    default:
      return '未知';
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

const handleClick = () => {
  emit('click', props.feedback);
};

const handleViewDetail = () => {
  emit('view-detail', props.feedback);
};
</script>

<style scoped>
.feedback-card:hover {
  transform: translateY(-2px);
}
</style>
