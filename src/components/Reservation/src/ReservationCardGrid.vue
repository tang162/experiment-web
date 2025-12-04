<script setup>
import { ReservationStatus } from '@/types';
import ReservationStatusTag from './ReservationStatusTag.vue';
import { ElButton, ElTag } from 'element-plus';

const props = defineProps({
  reservations: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  showUser: {
    type: Boolean,
    default: false,
  },
  showEvaluate: {
    type: Boolean,
    default: true,
  },
  showFeedback: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['cancel', 'approve', 'reject', 'view', 'evaluate', 'feedback']);

const canCancel = (status) => {
  return status === ReservationStatus.PENDING;
};

const canEvaluate = (row) => {
  // 只有已通过或已完成的预约可以评价，且未评价过
  const canEvaluateStatus = row.status === ReservationStatus.APPROVED || 
                            row.status === ReservationStatus.COMPLETED ||
                            row.status === 1 || 
                            row.status === 4;
  return canEvaluateStatus && !row.hasEvaluation;
};

const canFeedback = (row) => {
  return row.status === ReservationStatus.APPROVED || 
         row.status === ReservationStatus.COMPLETED ||
         row.status === 1 || 
         row.status === 4;
};

const getTimeSlotText = (timeSlot) => {
  if (timeSlot === 'MORNING' || timeSlot === 0) return '上午';
  if (timeSlot === 'AFTERNOON' || timeSlot === 1) return '下午';
  if (timeSlot === 'EVENING' || timeSlot === 2) return '晚上';
  return timeSlot;
};
</script>

<template>
  <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="reservation in reservations"
      :key="reservation.id"
      class="reservation-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer"
      @click="emit('view', reservation)"
    >
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ reservation.labName }}</h3>
          <p class="text-sm text-gray-500">预约ID: {{ reservation.id }}</p>
        </div>
        <ReservationStatusTag :status="reservation.status" size="small" />
      </div>

      <div class="space-y-2 text-sm mb-4">
        <div class="flex items-center text-gray-600">
          <span class="w-16 text-gray-500">日期：</span>
          <span>{{ reservation.date }}</span>
        </div>
        <div class="flex items-center text-gray-600">
          <span class="w-16 text-gray-500">时段：</span>
          <ElTag size="small" type="info">{{ getTimeSlotText(reservation.timeSlot) }}</ElTag>
        </div>
        <div class="flex items-center text-gray-600">
          <span class="w-16 text-gray-500">用途：</span>
          <span class="line-clamp-1">{{ reservation.purpose }}</span>
        </div>
        <div class="flex items-center text-gray-600">
          <span class="w-16 text-gray-500">人数：</span>
          <span>{{ reservation.participantCount }} 人</span>
        </div>
        <div v-if="showUser && reservation.userName" class="flex items-center text-gray-600">
          <span class="w-16 text-gray-500">预约人：</span>
          <span>{{ reservation.userName }}</span>
        </div>
      </div>

      <div v-if="showActions" class="pt-4 border-t border-gray-100 flex flex-wrap gap-2 justify-end" @click.stop>
        <ElButton 
          v-if="canCancel(reservation.status)" 
          type="danger" 
          size="small" 
          @click="emit('cancel', reservation.id)"
        >
          取消
        </ElButton>
        <ElButton 
          type="primary" 
          size="small" 
          @click="emit('view', reservation)"
        >
          详情
        </ElButton>
        <ElButton 
          v-if="showEvaluate && canEvaluate(reservation)" 
          type="success" 
          size="small" 
          @click="emit('evaluate', reservation)"
        >
          评价
        </ElButton>
        <ElButton 
          v-if="showFeedback && canFeedback(reservation)" 
          type="warning" 
          size="small" 
          @click="emit('feedback', reservation)"
        >
          反馈
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservation-card:hover {
  transform: translateY(-2px);
}
</style>
