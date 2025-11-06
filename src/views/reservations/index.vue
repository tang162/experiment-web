<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { reservationApi } from '@/api';
import { PageHeader, ReservationTable } from '@/components';
import type { Reservation } from '@/types';

const reservations = ref<Reservation[]>([]);
const loading = ref(false);

const fetchReservations = async () => {
  loading.value = true;
  try {
    const response = await reservationApi.getMyReservations({ page: 1, pageSize: 20 });
    reservations.value = response.list;
  } catch (error) {
    console.error('获取预约列表失败:', error);
  } finally {
    loading.value = false;
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
    fetchReservations();
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
  fetchReservations();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <PageHeader
        title="我的预约"
        description="查看和管理您的预约记录"
      />
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <ReservationTable
          :reservations="reservations"
          :loading="loading"
          @cancel="handleCancel"
          @view="handleView"
        />
      </div>
    </div>
  </div>
</template>
