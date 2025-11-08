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


</script>

<template>
  <div v-loading="loading">
    <ElTable :data="reservations" stripe>
      <ElTableColumn prop="labName" label="实验室" min-width="80" align="center" />
      <ElTableColumn prop="date" label="预约日期" width="140" align="center" />
      <ElTableColumn prop="timeSlot" label="时段" width="100" align="center">
        <template #default="{ row }">
          <span v-if="row.timeSlot === 'MORNING' || row.timeSlot === 0">上午</span>
          <span v-else-if="row.timeSlot === 'AFTERNOON' || row.timeSlot === 1">下午</span>
          <span v-else-if="row.timeSlot === 'EVENING' || row.timeSlot === 2">晚上</span>
          <span v-else>{{ row.timeSlot }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="purpose" label="用途" min-width="100" show-overflow-tooltip align="center" />
      <ElTableColumn prop="participantCount" label="人数" width="80" align="center" />
      <ElTableColumn prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <ReservationStatusTag :status="row.status" size="small" />
        </template>
      </ElTableColumn>
      <ElTableColumn v-if="showActions" label="操作" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <div class="flex gap-2 justify-center">
            <ElButton v-if="canCancel(row.status)" type="danger" size="small" @click="emit('cancel', row.id)">
              取消
            </ElButton>
            <ElButton type="primary" size="small" @click="emit('view', row)">
              详情
            </ElButton>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>
