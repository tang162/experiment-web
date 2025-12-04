<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox, ElPagination, ElDialog, ElDescriptions, ElDescriptionsItem, ElTag, ElButton, ElAlert, ElRate, ElIcon } from 'element-plus';
import { Calendar, Clock, User, Location, Document, InfoFilled } from '@element-plus/icons-vue';
import { PageLayout, DataTable, FilterBar, ReservationCard, StatusTag } from '@/components';
import { getAppointmentsApi, getAppointmentDetailApi, cancelAppointmentApi } from '@/api/modules/appointments';
import { useApi, usePagination } from '@/composables';

const router = useRouter();
const route = useRoute();

const reservations = ref([]);
const total = ref(0);
const selectedReservation = ref(null);
const dialogVisible = ref(false);
const detailLoading = ref(false);

// 筛选条件
const filters = reactive({
  status: route.query.status ? Number(route.query.status) : undefined,
  keyword: route.query.keyword || '',
});

const { loading, execute: fetchReservations } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 表格列定义
const columns = [
  { prop: 'id', label: '预约ID', width: 80 },
  { prop: 'lab.name', label: '实验室', minWidth: 150 },
  { prop: 'user.username', label: '申请人', width: 120 },
  { prop: 'appointmentDate', label: '预约日期', width: 120, formatter: (value) => new Date(value).toLocaleDateString('zh-CN') },
  { prop: 'timeSlot', label: '时间段', width: 150 },
  { prop: 'purpose', label: '预约目的', minWidth: 150, showOverflowTooltip: true },
  { prop: 'participantCount', label: '人数', width: 80 },
  { prop: 'status', label: '状态', width: 100 },
];

// 筛选选项
const filterOptions = [
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '待审核', value: 0 },
      { label: '已通过', value: 1 },
      { label: '已拒绝', value: 2 },
      { label: '已完成', value: 3 },
      { label: '已取消', value: 4 },
    ],
  },
];

// 加载预约列表
const loadReservations = async () => {
  const result = await fetchReservations(() =>
    getAppointmentsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: filters.status,
      keyword: filters.keyword,
    })
  );

  if (result) {
    reservations.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 处理筛选
const handleFilter = () => {
  resetPage();
  loadReservations();

  // 更新 URL 查询参数
  router.replace({
    query: {
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    },
  });
};

// 处理重置
const handleReset = () => {
  filters.status = undefined;
  filters.keyword = '';
  resetPage();
  loadReservations();

  // 清除 URL 查询参数
  router.replace({ query: {} });
};

// 时间段映射
const timeSlotMap = {
  0: '上午',
  1: '下午',
  2: '晚上',
};

// 状态映射
const statusMap = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已通过', type: 'success' },
  2: { label: '已拒绝', type: 'danger' },
  3: { label: '已完成', type: 'info' },
  4: { label: '已取消', type: 'info' },
};

// 处理行点击 - 加载详情并显示对话框
const handleRowClick = async (row) => {
  dialogVisible.value = true;
  detailLoading.value = true;
  
  try {
    const result = await getAppointmentDetailApi(row.id);
    if (result) {
      selectedReservation.value = result;
    }
  } catch (error) {
    ElMessage.error('加载预约详情失败');
    dialogVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
  selectedReservation.value = null;
};

// 是否可以取消
const canCancel = (status) => {
  return status === 0 || status === 1;
};

// 取消预约
const handleCancelReservation = async () => {
  if (!selectedReservation.value) return;

  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await cancelAppointmentApi(selectedReservation.value.id);
    ElMessage.success('取消成功');
    
    // 重新加载详情
    const result = await getAppointmentDetailApi(selectedReservation.value.id);
    if (result) {
      selectedReservation.value = result;
    }
    
    // 刷新列表
    loadReservations();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || '取消失败');
    }
  }
};

// 处理分页变化
const handlePageChangeEvent = (newPage) => {
  handlePageChange(newPage);
  loadReservations();

  // 更新 URL 查询参数
  router.replace({
    query: {
      ...route.query,
      page: newPage,
    },
  });
};

// 监听分页变化
watch(() => pagination.page, () => {
  loadReservations();
});

onMounted(() => {
  loadReservations();
});
</script>

<template>
  <PageLayout title="预约管理" description="查看和管理所有实验室预约" :loading="loading">
    <!-- 筛选栏 -->
    <div class="mb-6">
      <FilterBar
        :model-value="filters"
        :filter-options="filterOptions"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <!-- 预约列表 -->
    <div class="grid grid-cols-1 gap-4">
      <ReservationCard
        v-for="reservation in reservations"
        :key="reservation.id"
        :reservation="reservation"
        :show-actions="false"
        @click="handleRowClick"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="reservations.length === 0 && !loading" class="text-center py-12">
      <p class="text-gray-500 text-lg">暂无预约记录</p>
    </div>

    <!-- 分页 -->
    <div v-if="total > pagination.pageSize" class="flex justify-center mt-6">
      <ElPagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChangeEvent"
      />
    </div>

    <!-- 预约详情对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="selectedReservation ? `预约详情 #${selectedReservation.id}` : '预约详情'"
      width="800px"
      @close="closeDialog"
    >
      <div v-if="detailLoading" class="text-center py-8">
        <p class="text-gray-500">加载中...</p>
      </div>
      
      <div v-else-if="selectedReservation" class="space-y-4">
        <!-- 基本信息 -->
        <div>
          <h3 class="text-lg font-semibold mb-3 flex items-center justify-between">
            <span>基本信息</span>
            <ElTag :type="statusMap[selectedReservation.status]?.type">
              {{ statusMap[selectedReservation.status]?.label }}
            </ElTag>
          </h3>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><InfoFilled /></ElIcon>
                  预约ID
                </div>
              </template>
              {{ selectedReservation.id }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><User /></ElIcon>
                  申请人
                </div>
              </template>
              {{ selectedReservation.user?.username }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><Location /></ElIcon>
                  实验室
                </div>
              </template>
              {{ selectedReservation.lab?.name }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><Location /></ElIcon>
                  实验室地址
                </div>
              </template>
              {{ selectedReservation.lab?.location }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><Calendar /></ElIcon>
                  预约日期
                </div>
              </template>
              {{ selectedReservation.appointmentDate }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><Clock /></ElIcon>
                  时间段
                </div>
              </template>
              {{ timeSlotMap[selectedReservation.timeSlot] || '未知' }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="flex items-center">
                  <ElIcon class="mr-2"><User /></ElIcon>
                  参与人数
                </div>
              </template>
              {{ selectedReservation.participantCount }} 人
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>

        <!-- 实验室信息 -->
        <div v-if="selectedReservation.lab">
          <h3 class="text-lg font-semibold mb-3">实验室信息</h3>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="实验室名称">
              {{ selectedReservation.lab.name }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="所属部门">
              {{ selectedReservation.lab.department }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="实验室地址">
              {{ selectedReservation.lab.location }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="实验室容量">
              {{ selectedReservation.lab.capacity }} 人
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="selectedReservation.lab.rating" label="实验室评分">
              <ElRate :model-value="Number(selectedReservation.lab.rating)" disabled show-score text-color="#ff9900" />
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="selectedReservation.lab.description" label="实验室描述" :span="2">
              {{ selectedReservation.lab.description }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>

        <!-- 预约详情 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">预约详情</h3>
          <ElDescriptions :column="1" border>
            <ElDescriptionsItem label="预约目的">
              {{ selectedReservation.purpose }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="selectedReservation.description" label="详细说明">
              {{ selectedReservation.description }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="selectedReservation.status === 2 && selectedReservation.rejectionReason" label="拒绝原因">
              <ElAlert type="error" :closable="false">
                {{ selectedReservation.rejectionReason }}
              </ElAlert>
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>

        <!-- 审核信息 -->
        <div v-if="selectedReservation.reviewer || selectedReservation.reviewTime">
          <h3 class="text-lg font-semibold mb-3">审核信息</h3>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem v-if="selectedReservation.reviewer" label="审核人">
              {{ selectedReservation.reviewer }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="selectedReservation.reviewTime" label="审核时间">
              {{ selectedReservation.reviewTime }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>

        <!-- 时间信息 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">时间信息</h3>
          <ElDescriptions :column="2" border>
            <ElDescriptionsItem label="创建时间">
              {{ selectedReservation.createdAt }}
            </ElDescriptionsItem>
            <ElDescriptionsItem label="更新时间">
              {{ selectedReservation.updatedAt }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <ElButton @click="closeDialog">关闭</ElButton>
          <ElButton
            v-if="selectedReservation && canCancel(selectedReservation.status)"
            type="danger"
            @click="handleCancelReservation"
          >
            取消预约
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </PageLayout>
</template>
