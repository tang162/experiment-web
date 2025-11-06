<script setup lang="ts">
import type { Reservation } from '@/types';
import { ReservationStatus } from '@/types';
import ReservationStatusTag from './ReservationStatusTag.vue';
import { ElTable, ElTableColumn, ElButton } from "element-plus";

interface Props {
  reservations: Reservation[];
  loading?: boolean;
  showActions?: boolean;
  showUser?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  showUser: false,
});

const emit = defineEmits<{
  cancel: [id: string | number];
  approve: [id: string | number];
  reject: [id: string | number];
  view: [reservation: Reservation];
}>();

const canCancel = (status: ReservationStatus) => {
  return status === ReservationStatus.PENDING;
};

const canApprove = (status: ReservationStatus) => {
  return status === ReservationStatus.PENDING;
};
</script>

<template>
  <div v-loading="loading">
    <ElTable :data="reservations" stripe>
      <ElTableColumn v-if="showUser" prop="userName" label="申请人" width="120" />
      <ElTableColumn prop="labName" label="实验室" min-width="150" />
      <ElTableColumn prop="date" label="预约日期" width="120" />
      <ElTableColumn prop="timeSlot" label="时段" width="100">
        <template #default="{ row }">
          <span v-if="row.timeSlot === 'MORNING'">上午</span>
          <span v-else-if="row.timeSlot === 'AFTERNOON'">下午</span>
          <span v-else-if="row.timeSlot === 'EVENING'">晚上</span>
          <span v-else>{{ row.timeSlot }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="purpose" label="用途" min-width="150" show-overflow-tooltip />
      <ElTableColumn prop="participantCount" label="人数" width="80" />
      <ElTableColumn prop="status" label="状态" width="100">
        <template #default="{ row }">
          <ReservationStatusTag :status="row.status" size="small" />
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="showActions" label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-2">
            <ElButton v-if="canCancel(row.status)" type="danger" size="small" text @click="emit('cancel', row.id)">
              取消
            </ElButton>
            <ElButton v-if="canApprove(row.status)" type="success" size="small" @click="emit('approve', row.id)">
              通过
            </ElButton>
            <ElButton v-if="canApprove(row.status)" type="danger" size="small" @click="emit('reject', row.id)">
              驳回
            </ElButton>
            <ElButton type="primary" size="small" text @click="emit('view', row)">
              详情
            </ElButton>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>
