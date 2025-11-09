<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { cancelAppointmentApi, getAppointmentsApi } from '@/api';
import { PageLayout, ReservationTable } from '@/components';
import { useApi } from '@/composables';
import { ReservationStatus } from '@/types';

const router = useRouter();

const appointments = ref([]);

const { loading, execute: fetchReservations } = useApi();

// 将 API 数据格式转换为组件需要的格式
const reservations = computed(() => {
  return appointments.value.map(item => ({
    id: item.id,
    labId: item.lab.id,
    labName: item.lab.name,
    userId: item.user.id,
    userName: item.user.username,
    date: item.appointmentDate,
    timeSlot: item.timeSlot,
    purpose: item.purpose,
    description: item.description,
    participantCount: item.participantCount,
    status: mapStatusToEnum(item.status),
    createdAt: item.createdAt,
  }));
});

// 将数字状态码映射为枚举
const mapStatusToEnum = (status) => {
  const statusMap = {
    0: ReservationStatus.PENDING,
    1: ReservationStatus.APPROVED,
    2: ReservationStatus.REJECTED,
    3: ReservationStatus.COMPLETED,
    4: ReservationStatus.CANCELLED,
  };
  return statusMap[status] || ReservationStatus.PENDING;
};

const loadReservations = async () => {
  const result = await fetchReservations(() => getAppointmentsApi());

  if (result) {
    appointments.value = result.list;
  }
};

const handleCancel = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await cancelAppointmentApi(Number(id));
    ElMessage.success('取消成功');
    loadReservations();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败');
    }
  }
};

const handleView = (reservation) => {
  router.push(`/reservation/detail/${reservation.id}`);
};

onMounted(() => {
  loadReservations();
});
</script>

<template>
  <PageLayout title="我的预约" description="查看和管理您的预约记录" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-6">
      <ReservationTable :reservations="reservations" :loading="loading" @cancel="handleCancel" @view="handleView" />
    </div>
  </PageLayout>
</template>
