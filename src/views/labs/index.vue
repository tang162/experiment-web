<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElPagination } from 'element-plus';
import { getLabsApi } from '@/api';
import PageLayout from '@/components/Layout/PageLayout.vue';
import LabCard from '@/components/Lab/LabCard.vue';
import LabFilter from '@/components/Lab/LabFilter.vue';
import EmptyState from '@/components/Common/EmptyState.vue';
import { useApi, usePagination } from '@/composables';

const router = useRouter();
const route = useRoute();

const labs = ref([]);

// 筛选条件 - 完全按照 API 定义
const filters = reactive({
  keyword: (route.query.keyword) || '',
  department: (route.query.department) || '',
  status: route.query.status ? Number(route.query.status) : undefined,
  tags: (route.query.tags) || ''
});

const total = ref(0);
const { loading, execute: fetchLabs } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 8,
  totalItems: total,
});

// 加载实验室列表
const loadLabs = async () => {
  const result = await fetchLabs(() =>
    getLabsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword,
      department: filters.department,
      status: filters.status,
      tags: filters.tags,
    })
  );

  if (result) {
    labs.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 更新筛选条件
const handleFilterUpdate = (newFilters) => {
  Object.assign(filters, newFilters);
};

// 应用筛选
const handleFilter = () => {
  resetPage();
  loadLabs();

  // 更新 URL 查询参数
  router.replace({
    query: {
      ...route.query,
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    },
  });
};

// 重置筛选
const handleReset = () => {
  filters.keyword = '';
  filters.department = '';
  filters.status = undefined;
  filters.tags = '';
  resetPage();
  loadLabs();

  // 清除 URL 查询参数
  router.replace({ query: {} });
};

// 点击实验室卡片
const handleLabClick = (lab) => {
  router.push(`/lab/labs/${lab.id}`);
};

// 监听分页变化
watch(() => pagination.page, () => {
  loadLabs();

  // 更新 URL 查询参数
  router.replace({
    query: {
      ...route.query,
      page: pagination.page,
    },
  });
});

onMounted(() => {
  loadLabs();
});
</script>

<template>
  <PageLayout title="实验室预约" description="选择适合您的实验室" :loading="loading">
    <div class="mb-6">
      <LabFilter :model-value="filters" @update:model-value="handleFilterUpdate" @filter="handleFilter"
        @reset="handleReset" />
    </div>

    <div class="min-h-[400px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <template v-for="lab in labs" :key="lab.id">
          <LabCard :lab="lab" @click="handleLabClick" />
        </template>
      </div>

      <EmptyState v-if="labs.length === 0 && !loading" description="暂无实验室" />

      <div v-if="total && total > pagination.pageSize" class="flex justify-center">
        <ElPagination v-model:current-page="pagination.page" :page-size="pagination.pageSize" :total="total"
          layout="prev, pager, next, jumper" @current-change="handlePageChange" />
      </div>
    </div>
  </PageLayout>
</template>
