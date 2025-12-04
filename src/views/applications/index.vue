<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElPagination, ElDialog, ElDescriptions, ElDescriptionsItem, ElTag } from 'element-plus';
import { PageLayout, DataTable, FilterBar, ApplicationCard } from '@/components';
import { equipmentApi } from '@/api';
import { useApi, usePagination } from '@/composables';

const router = useRouter();
const route = useRoute();

const applications = ref([]);
const total = ref(0);
const selectedApplication = ref(null);
const dialogVisible = ref(false);

// 筛选条件
const filters = reactive({
  type: route.query.type || '',
  status: route.query.status ? Number(route.query.status) : undefined,
  keyword: route.query.keyword || '',
});

const { loading, execute: fetchApplications } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 表格列定义
const columns = [
  { prop: 'id', label: '申请ID', width: 80 },
  { prop: 'type', label: '申请类型', width: 100, formatter: (value) => value === 'equipment' ? '设备申请' : '仪器申请' },
  { prop: 'itemName', label: '申请项目', minWidth: 150 },
  { prop: 'userName', label: '申请人', width: 120 },
  { prop: 'purpose', label: '用途', minWidth: 150, showOverflowTooltip: true },
  { prop: 'timeSlot', label: '使用时段', width: 150 },
  { prop: 'status', label: '状态', width: 100 },
];

// 筛选选项
const filterOptions = [
  {
    key: 'type',
    label: '申请类型',
    type: 'select',
    options: [
      { label: '设备申请', value: 'equipment' },
      { label: '仪器申请', value: 'instrument' },
    ],
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '待审核', value: 0 },
      { label: '已通过', value: 1 },
      { label: '已拒绝', value: 2 },
    ],
  },
];

// 加载申请列表
const loadApplications = async () => {
  try {
    const result = await fetchApplications(() =>
      equipmentApi.getApplications({
        page: pagination.page,
        pageSize: pagination.pageSize,
        type: filters.type,
        status: filters.status,
        keyword: filters.keyword,
      })
    );

    if (result) {
      applications.value = result.list || [];
      total.value = result.total || 0;
    }
  } catch (error) {
    ElMessage.error('加载申请列表失败');
  }
};

// 处理筛选
const handleFilter = () => {
  resetPage();
  loadApplications();

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
  filters.type = '';
  filters.status = undefined;
  filters.keyword = '';
  resetPage();
  loadApplications();

  // 清除 URL 查询参数
  router.replace({ query: {} });
};

// 状态映射: 0-待审核,1-已通过,2-已拒绝,3-已归还
const statusMap = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已通过', type: 'success' },
  2: { label: '已拒绝', type: 'danger' },
  3: { label: '已归还', type: 'info' },
};

// 处理行点击 - 显示详情对话框
const handleRowClick = (row) => {
  selectedApplication.value = row;
  dialogVisible.value = true;
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
  selectedApplication.value = null;
};

// 处理分页变化
const handlePageChangeEvent = (newPage) => {
  handlePageChange(newPage);
  loadApplications();

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
  loadApplications();
});

onMounted(() => {
  loadApplications();
});
</script>

<template>
  <PageLayout title="申请管理" description="查看和管理所有仪器和设备申请" :loading="loading">
    <!-- 筛选栏 -->
    <div class="mb-6">
      <FilterBar
        :model-value="filters"
        :filter-options="filterOptions"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <!-- 申请列表 -->
    <div class="grid grid-cols-1 gap-4">
      <ApplicationCard
        v-for="application in applications"
        :key="application.id"
        :application="application"
        :show-actions="false"
        @click="handleRowClick"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="applications.length === 0 && !loading" class="text-center py-12">
      <p class="text-gray-500 text-lg">暂无申请记录</p>
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

    <!-- 申请详情对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="`申请详情 #${selectedApplication?.id}`"
      width="700px"
      @close="closeDialog"
    >
      <div v-if="selectedApplication">
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="申请ID">
            {{ selectedApplication.id }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="申请类型">
            {{ selectedApplication.type === 'equipment' ? '设备申请' : '仪器申请' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="申请项目" :span="2">
            {{ selectedApplication.itemName }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="申请人">
            {{ selectedApplication.userName }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="statusMap[selectedApplication.status]?.type">
              {{ statusMap[selectedApplication.status]?.label }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="使用时段" :span="2">
            {{ selectedApplication.timeSlot }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="用途" :span="2">
            {{ selectedApplication.purpose }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="selectedApplication.createdAt" label="申请时间" :span="2">
            {{ selectedApplication.createdAt }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </ElDialog>
  </PageLayout>
</template>
