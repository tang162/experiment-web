<script setup lang="ts">
import { computed } from 'vue';
import { ReservationStatus } from '@/types';
import { ElTabs } from 'element-plus'

interface Props {
  status: ReservationStatus;
  size?: 'small' | 'default' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
});

const tagType = computed(() => {
  switch (props.status) {
    case ReservationStatus.PENDING:
      return 'warning';
    case ReservationStatus.APPROVED:
      return 'success';
    case ReservationStatus.REJECTED:
      return 'danger';
    case ReservationStatus.COMPLETED:
      return 'info';
    case ReservationStatus.CANCELLED:
      return '';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  switch (props.status) {
    case ReservationStatus.PENDING:
      return '待审核';
    case ReservationStatus.APPROVED:
      return '已通过';
    case ReservationStatus.REJECTED:
      return '已驳回';
    case ReservationStatus.COMPLETED:
      return '已完成';
    case ReservationStatus.CANCELLED:
      return '已取消';
    default:
      return '未知';
  }
})
</script>

<template>
  <ElTabs :type="tagType" :size="size">
    {{ statusText }}
  </ElTabs>
</template>
