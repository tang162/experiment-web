<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElTag, ElButton, ElPagination, ElMessage, ElEmpty } from 'element-plus';
import { getAppointmentsApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi, usePagination } from '@/composables';

const appointments = ref([]);
const total = ref(0);

const { loading, execute: fetchAppointments } = useApi();
const { pagination, handlePageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 状态映射
const statusMap = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已通过', type: 'success' },
  2: { label: '已拒绝', type: 'danger' },
  3: { label: '已完成', type: 'info' },
  4: { label: '已取消', type: 'info' },
};

// 加载预约列表
const loadAppointments = async () => {
  const result = await fetchAppointments(() =>
    getAppointmentsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
  );

  if (result) {
    appointments.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <PageLayout title="预约管理" description="查看所有实验室预约" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-6">
      <ElTable :data="appointments" stripe style="width: 100%">
        <ElTableColumn prop="id" label="预约ID" width="80" />
        <ElTableColumn prop="lab" label="实验室" min-width="150">
          <template #default="{ row }">
            {{ row.lab?.name || '未知' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="user" label="申请人" width="120">
          <template #default="{ row }">
            {{ row.user?.username || '未知' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="appointmentDate" label="预约日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.appointmentDate) }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="timeSlot" label="时间段" width="150" />
        <ElTableColumn prop="purpose" label="预约目的" min-width="150" show-overflow-tooltip />
        <ElTableColumn prop="participantCount" label="人数" width="80" />
        <ElTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="statusMap[row.status]?.type" size="small">
              {{ statusMap[row.status]?.label }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div v-if="total > pagination.pageSize" class="flex justify-center mt-6">
        <ElPagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 空状态 -->
      <ElEmpty v-if="appointments.length === 0 && !loading" description="暂无预约记录" />
    </div>
  </PageLayout>
</template>
