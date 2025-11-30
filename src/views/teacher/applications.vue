<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElTag, ElButton, ElPagination, ElMessage, ElMessageBox, ElEmpty } from 'element-plus';
import { getInstrumentApplicationsApi, reviewInstrumentApplicationApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi, usePagination } from '@/composables';

const applications = ref([]);
const total = ref(0);

const { loading, execute: fetchApplications } = useApi();
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
};

// 加载仪器申请列表
const loadApplications = async () => {
  const result = await fetchApplications(() =>
    getInstrumentApplicationsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
  );

  if (result) {
    applications.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 审核申请
const handleReview = async (id, status, reason = '') => {
  try {
    const action = status === 1 ? '通过' : '拒绝';
    
    let confirmReason = reason;
    if (status === 2 && !reason) {
      const { value } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入拒绝原因',
      });
      confirmReason = value;
    }

    await reviewInstrumentApplicationApi(id, {
      status,
      reason: confirmReason,
    });

    ElMessage.success(`${action}成功`);
    loadApplications();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 通过申请
const approveApplication = (id) => {
  handleReview(id, 1);
};

// 拒绝申请
const rejectApplication = (id) => {
  handleReview(id, 2);
};

// 格式化时间
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadApplications();
});
</script>

<template>
  <PageLayout title="仪器申请审核" description="审核学生的仪器使用申请" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-6">
      <ElTable :data="applications" stripe style="width: 100%">
        <ElTableColumn prop="id" label="申请ID" width="80" />
        <ElTableColumn prop="instrument" label="仪器名称" min-width="150">
          <template #default="{ row }">
            {{ row.instrument?.name || '未知' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="model" label="型号" width="120">
          <template #default="{ row }">
            {{ row.instrument?.model || '未设置' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="lab" label="所属实验室" min-width="150">
          <template #default="{ row }">
            {{ row.lab?.name || '未知' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="user" label="申请人" width="120">
          <template #default="{ row }">
            {{ row.user?.username || '未知' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="purpose" label="使用目的" min-width="150" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.purpose || '未填写' }}
          </template>
        </ElTableColumn>
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
              <ElButton type="success" size="small" @click="approveApplication(row.id)">
                通过
              </ElButton>
              <ElButton type="danger" size="small" @click="rejectApplication(row.id)">
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
      <ElEmpty v-if="applications.length === 0 && !loading" description="暂无待审核申请" />
    </div>
  </PageLayout>
</template>
