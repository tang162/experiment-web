<script setup>
import { computed } from 'vue';
import { ElCard, ElTag, ElButton, ElIcon, ElRow, ElCol } from 'element-plus';
import { User, Clock, Document, Delete, Edit } from '@element-plus/icons-vue';
import { StatusTag } from '@/components';

const props = defineProps({
  // 申请数据
  application: {
    type: Object,
    required: true,
    // 应包含: id, type, itemName, userName, purpose, timeSlot, description, status, reason
  },
  // 是否显示操作按钮
  showActions: {
    type: Boolean,
    default: true,
  },
  // 是否显示详情
  showDetails: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['click', 'edit', 'delete']);

// 处理卡片点击
const handleClick = () => {
  emit('click', props.application);
};

// 处理编辑
const handleEdit = (event) => {
  event.stopPropagation();
  emit('edit', props.application);
};

// 处理删除
const handleDelete = (event) => {
  event.stopPropagation();
  emit('delete', props.application);
};

// 获取申请类型文本
const getApplicationTypeText = computed(() => {
  const typeMap = {
    equipment: '设备申请',
    instrument: '仪器申请',
  };
  return typeMap[props.application.type] || '申请';
});

// 获取申请类型颜色
const getApplicationTypeColor = computed(() => {
  const colorMap = {
    equipment: 'warning',
    instrument: 'success',
  };
  return colorMap[props.application.type] || 'info';
});
</script>

<template>
  <ElCard
    class="application-card cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    @click="handleClick"
  >
    <!-- 卡片头部 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <ElTag :type="getApplicationTypeColor" size="small">
              {{ getApplicationTypeText }}
            </ElTag>
            <h3 class="text-lg font-bold text-gray-900">{{ application.itemName }}</h3>
          </div>
          <p class="text-sm text-gray-600">申请ID: {{ application.id }}</p>
        </div>
        <StatusTag :status="application.status" />
      </div>
    </template>

    <!-- 卡片内容 -->
    <div class="space-y-3">
      <!-- 申请人 -->
      <div class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-blue-500">
          <User />
        </ElIcon>
        <span class="text-sm">{{ application.userName }}</span>
      </div>

      <!-- 用途 -->
      <div class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-green-500">
          <Document />
        </ElIcon>
        <span class="text-sm">{{ application.purpose }}</span>
      </div>

      <!-- 使用时段 -->
      <div class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-orange-500">
          <Clock />
        </ElIcon>
        <span class="text-sm">{{ application.timeSlot }}</span>
      </div>

      <!-- 详细说明 -->
      <div v-if="showDetails && application.description" class="mt-3 pt-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          <span class="font-semibold">详细说明:</span>
          {{ application.description }}
        </p>
      </div>

      <!-- 拒绝原因 -->
      <div v-if="application.status === 2 && application.reason" class="mt-3 pt-3 border-t border-gray-200">
        <p class="text-sm text-red-600">
          <span class="font-semibold">拒绝原因:</span>
          {{ application.reason }}
        </p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <template v-if="showActions" #footer>
      <div class="flex gap-2 justify-end">
        <ElButton
          type="primary"
          text
          size="small"
          @click="handleEdit"
        >
          <ElIcon class="mr-1">
            <Edit />
          </ElIcon>
          编辑
        </ElButton>
        <ElButton
          type="danger"
          text
          size="small"
          @click="handleDelete"
        >
          <ElIcon class="mr-1">
            <Delete />
          </ElIcon>
          删除
        </ElButton>
      </div>
    </template>
  </ElCard>
</template>

<style lang="scss" scoped>
.application-card {
  :deep(.el-card__header) {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  :deep(.el-card__body) {
    padding: 1rem;
  }

  :deep(.el-card__footer) {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
  }
}
</style>
