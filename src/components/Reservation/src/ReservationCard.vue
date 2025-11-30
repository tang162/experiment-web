<script setup>
import { computed } from 'vue';
import { ElCard, ElTag, ElButton, ElIcon, ElRow, ElCol } from 'element-plus';
import { Calendar, User, Clock, Delete, Edit } from '@element-plus/icons-vue';
import { StatusTag } from '@/components';

const props = defineProps({
  // 预约数据
  reservation: {
    type: Object,
    required: true,
    // 应包含: id, labName, userName, appointmentDate, timeSlot, purpose, participantCount, status, reason
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
  emit('click', props.reservation);
};

// 处理编辑
const handleEdit = (event) => {
  event.stopPropagation();
  emit('edit', props.reservation);
};

// 处理删除
const handleDelete = (event) => {
  event.stopPropagation();
  emit('delete', props.reservation);
};

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};
</script>

<template>
  <ElCard
    class="reservation-card cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    @click="handleClick"
  >
    <!-- 卡片头部 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900">{{ reservation.labName }}</h3>
          <p class="text-sm text-gray-600 mt-1">预约ID: {{ reservation.id }}</p>
        </div>
        <StatusTag :status="reservation.status" />
      </div>
    </template>

    <!-- 卡片内容 -->
    <div class="space-y-3">
      <!-- 申请人 -->
      <div class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-blue-500">
          <User />
        </ElIcon>
        <span class="text-sm">{{ reservation.userName }}</span>
      </div>

      <!-- 预约日期 -->
      <div class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-green-500">
          <Calendar />
        </ElIcon>
        <span class="text-sm">{{ formatDate(reservation.appointmentDate) }}</span>
      </div>

      <!-- 时间段 -->
      <div class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-orange-500">
          <Clock />
        </ElIcon>
        <span class="text-sm">{{ reservation.timeSlot }}</span>
      </div>

      <!-- 人数 -->
      <div v-if="reservation.participantCount" class="flex items-center gap-2 text-gray-700">
        <ElIcon class="text-purple-500">
          <User />
        </ElIcon>
        <span class="text-sm">{{ reservation.participantCount }}人</span>
      </div>

      <!-- 预约目的 -->
      <div v-if="showDetails && reservation.purpose" class="mt-3 pt-3 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          <span class="font-semibold">预约目的:</span>
          {{ reservation.purpose }}
        </p>
      </div>

      <!-- 拒绝原因 -->
      <div v-if="reservation.status === 2 && reservation.reason" class="mt-3 pt-3 border-t border-gray-200">
        <p class="text-sm text-red-600">
          <span class="font-semibold">拒绝原因:</span>
          {{ reservation.reason }}
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
.reservation-card {
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
