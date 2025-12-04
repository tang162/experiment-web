<script setup>
import { ref, onMounted, reactive } from 'vue';
import { ElTable, ElTableColumn, ElTag, ElButton, ElPagination, ElMessage, ElMessageBox, ElEmpty, ElSelect, ElOption, ElDatePicker, ElInput } from 'element-plus';
import { getPendingAppointmentsApi, reviewAppointmentApi } from '@/api';
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

// 筛选条件
const filters = reactive({
  status: '',
  labName: '',
  username: '',
  dateRange: [],
});

// 状态映射
const statusMap = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已通过', type: 'success' },
  2: { label: '已拒绝', type: 'danger' },
  3: { label: '已完成', type: 'info' },
  4: { label: '已取消', type: 'info' },
};

// 状态选项
const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 0, label: '待审核' },
  { value: 1, label: '已通过' },
  { value: 2, label: '已拒绝' },
  { value: 3, label: '已完成' },
  { value: 4, label: '已取消' },
];

// 加载待审核预约
const loadAppointments = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  // 添加筛选条件
  if (filters.status !== '') {
    params.status = filters.status;
  }
  if (filters.labName) {
    params.labName = filters.labName;
  }
  if (filters.username) {
    params.username = filters.username;
  }
  if (filters.dateRange && filters.dateRange.length === 2) {
    params.startDate = filters.dateRange[0];
    params.endDate = filters.dateRange[1];
  }

  const result = await fetchAppointments(() =>
    getPendingAppointmentsApi(params)
  );

  if (result) {
    appointments.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 重置筛选
const resetFilters = () => {
  filters.status = '';
  filters.labName = '';
  filters.username = '';
  filters.dateRange = [];
  pagination.page = 1;
  loadAppointments();
};

// 应用筛选
const applyFilters = () => {
  pagination.page = 1;
  loadAppointments();
};

// 审核预约
const handleReview = async (id, status, reason = '') => {
  try {
    const action = status === 1 ? '通过' : '拒绝';
    
    let confirmReason = reason;
    if (status === 2 && !reason) {
      const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝预约', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入拒绝原因',
      });
      confirmReason = value;
    }

    await reviewAppointmentApi(id, {
      status,
      reason: confirmReason,
    });

    ElMessage.success(`${action}成功`);
    loadAppointments();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 通过预约
const approveAppointment = (id) => {
  handleReview(id, 1);
};

// 拒绝预约
const rejectAppointment = (id) => {
  handleReview(id, 2);
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
  <PageLayout title="预约审核" description="审核学生的实验室预约申请" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- 筛选区域 -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <ElSelect v-model="filters.status" placeholder="选择状态" clearable class="w-full">
              <ElOption
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">实验室名称</label>
            <ElInput v-model="filters.labName" placeholder="输入实验室名称" clearable />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">申请人</label>
            <ElInput v-model="filters.username" placeholder="输入申请人姓名" clearable />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">预约日期范围</label>
            <ElDatePicker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="w-full"
              clearable
            />
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <ElButton type="primary" @click="applyFilters">查询</ElButton>
          <ElButton @click="resetFilters">重置</ElButton>
        </div>
      </div>

      <!-- 表格 -->
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
        <ElTableColumn label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div v-if="row.status === 0" class="flex gap-2">
              <ElButton type="success" size="small" @click="approveAppointment(row.id)">
                通过
              </ElButton>
              <ElButton type="danger" size="small" @click="rejectAppointment(row.id)">
                拒绝
              </ElButton>
            </div>
            <span v-else class="text-gray-500">已处理</span>
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
      <ElEmpty v-if="appointments.length === 0 && !loading" description="暂无待审核预约" />
    </div>
  </PageLayout>
</template>
