<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElPagination } from 'element-plus';
import { PageLayout, InstrumentCard, InstrumentFilter, EmptyState } from '@/components';
import { getInstrumentsApi } from '@/api';
import { useApi, usePagination } from '@/composables';

const router = useRouter();
const route = useRoute();

const instruments = ref([]);

// 筛选条件 - 完全按照 API 定义
const filters = reactive({
  labId: route.query.labId ? Number(route.query.labId) : undefined,
  status: route.query.status ? Number(route.query.status) : undefined,
});

const total = ref(0);
const { loading, execute: fetchInstruments } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 8,
  totalItems: total,
});

// 加载仪器列表
const loadInstruments = async () => {
  const result = await fetchInstruments(() =>
    getInstrumentsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      labId: filters.labId,
      status: filters.status,
    })
  );

  if (result) {
    instruments.value = result.list || [];
    console.log(instruments.value);
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
  loadInstruments();

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
  filters.labId = undefined;
  filters.status = undefined;
  resetPage();
  loadInstruments();

  // 清除 URL 查询参数
  router.replace({ query: {} });
};

// 点击仪器卡片
const handleInstrumentClick = (instrument) => {
  router.push(`/lab/instruments/${instrument.id}`);
};

// 监听分页变化
watch(() => pagination.page, () => {
  loadInstruments();

  // 更新 URL 查询参数
  router.replace({
    query: {
      ...route.query,
      page: pagination.page,
    },
  });
});

onMounted(() => {
  loadInstruments();
});
</script>

<template>
  <PageLayout title="仪器列表" description="浏览和申请使用实验仪器" :loading="loading">
    <div class="mb-6">
      <InstrumentFilter :model-value="filters" show-lab-filter @update:model-value="handleFilterUpdate"
        @filter="handleFilter" @reset="handleReset" />
    </div>

    <div class="min-h-[400px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <template v-for="instrument in instruments" :key="instrument.id">
          <!-- <InstrumentCard :instrument="instrument" @click="handleInstrumentClick" /> -->
        </template>
      </div>

      <EmptyState v-if="instruments.length === 0 && !loading" description="暂无仪器" />

      <div v-if="total && total > pagination.pageSize" class="flex justify-center">
        <ElPagination v-model:current-page="pagination.page" :page-size="pagination.pageSize" :total="total"
          layout="prev, pager, next, jumper" @current-change="handlePageChange" />
      </div>
    </div>
  </PageLayout>
</template>
