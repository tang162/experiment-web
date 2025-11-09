<script setup>
import { ref, onMounted, } from 'vue';
import { useRouter } from 'vue-router';
import { ElTable, ElTableColumn, ElTag, ElButton, ElPagination, } from 'element-plus';
import { getMyInstrumentApplicationsApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi, usePagination } from '@/composables';
import { INSTRUMENT_STATUS_MAP } from '@/types';

const router = useRouter();

const applications = ref([]);
const total = ref(0);

const { loading, execute: fetchApplications } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 加载申请列表
const loadApplications = async () => {
  const result = await fetchApplications(() =>
    getMyInstrumentApplicationsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
  );

  if (result) {
    applications.value = result.list || [];
    console.log(applications.value);

    total.value = result.total || 0;
  }
};

// 查看仪器详情
const viewDetail = (row) => {
  router.push(`/lab/instruments/${row.instrument.id}`);
};

// 获取状态信息
const getStatusInfo = (status) => {
  return INSTRUMENT_STATUS_MAP[status];
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadApplications();
});
</script>

<template>
  <PageLayout title="我的仪器申请" description="查看和管理您的仪器使用申请" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- 表格 -->
      <ElTable :data="applications" stripe style="width: 100%">
        <ElTableColumn prop="id" label="申请ID" width="80" />
        <ElTableColumn prop="name" label="仪器名称" min-width="150">
          <template #default="{ row }">
            {{ row.instrument.name || '未设置' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="model" label="型号" min-width="120">
          <template #default="{ row }">
            {{ row.instrument.model || '未设置' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="serialNumber" label="序列号" min-width="120">
          <template #default="{ row }">
            {{ row.instrument.serialNumber || '未设置' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="lab" label="所属实验室" min-width="150">
          <template #default="{ row }">
            {{ row.lab.name }}- {{ row.lab.location }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="getStatusInfo(row.status).color" size="small">
              {{ getStatusInfo(row.status).label }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="申请时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <ElButton link type="primary" size="small" @click="viewDetail(row)">
              查看详情
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div v-if="total > pagination.pageSize" class="flex justify-center mt-6">
        <ElPagination v-model:current-page="pagination.page" :page-size="pagination.pageSize" :total="total"
          layout="total, prev, pager, next, jumper" @current-change="handlePageChange" />
      </div>

      <!-- 空状态 -->
      <div v-if="applications.length === 0 && !loading" class="text-center py-12">
        <p class="text-gray-500 mb-4">暂无申请记录</p>
        <ElButton type="primary" @click="router.push('/lab/instruments')">
          去申请仪器
        </ElButton>
      </div>
    </div>
  </PageLayout>
</template>
