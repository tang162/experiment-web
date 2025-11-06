<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reservationApi } from '@/api';
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

onMounted(() => {
  fetchReservations();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">我的预约</h1>
      <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
        <el-table :data="reservations" stripe>
          <el-table-column prop="labName" label="实验室" />
          <el-table-column prop="date" label="预约日期" />
          <el-table-column prop="timeSlot" label="时段" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 'APPROVED' ? 'success' : 'warning'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
