<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { reservationApi } from '@/api';
import { PageLayout, ReservationTable } from '@/components';
import { useApi } from '@/composables';
import type { Reservation } from '@/types';

const reservations = ref<Reservation[]>([]);

const { loading, execute: fetchReservations } = useApi<{ list: Reservation[] }>();

const loadReservations = async () => {
  const result = await fetchReservations(() => 
    reservationApi.getMyReservations({ page: 1, pageSize: 20 })
  );
  
  if (result) {
    reservations.value = result.list;
  }
};

const handleCancel = async (id: string | number) => {
  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await reservationApi.cancelReservation(id);
    ElMessage.success('取消成功');
    loadReservations();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败');
    }
  }
};

const handleView = (reservation: Reservation) => {
  console.log('查看预约详情', reservation);
};

onMounted(() => {
  loadReservations();
});
</script>

<template>
  <PageLayout
    title="我的预约"
    description="查看和管理您的预约记录"
    :loading="loading"
  >
    <div class="bg-white rounded-lg shadow-md p-6">
      <ReservationTable
        :reservations="reservations"
        :loading="loading"
        @cancel="handleCancel"
        @view="handleView"
      />
    </div>
  </PageLayout>
</template>
