<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElPagination, ElMessage } from 'element-plus';
import { getLabsApi } from '@/api';
import { PageLayout, LabCard, LabFilter, EmptyState } from '@/components';
import { useApi, usePagination } from '@/composables';
import { LabStatus, type Lab, type LabFilter as LabFilterType } from '@/types';

const router = useRouter();
const route = useRoute();

const labs = ref<Lab[]>([]);

const filters = reactive<LabFilterType>({
  keyword: (route.query.keyword as string) || '',
  department: (route.query.department as string) || '',
  equipmentType: (route.query.equipmentType as string) || '',
  status: (route.query.status as LabStatus) || undefined,
  minCapacity: undefined,
  maxCapacity: undefined,
});

const total = ref(0);
const { loading, execute: fetchLabs } = useApi<Lab[]>();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 12,
  totalItems: total,
});

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
    labs.value = result || [];
    total.value = result?.length || 0;
  }
};

const handleFilterUpdate = (newFilters: LabFilterType) => {
  Object.assign(filters, newFilters);
};

const handleFilter = () => {
  resetPage();
  loadLabs();
};

const handleReset = () => {
  resetPage();
  loadLabs();
};

const handleLabClick = (lab: Lab) => {
  router.push(`/lab/labs/${lab.id}`);
};

const handleToggleFavorite = async (lab: Lab) => {
  // TODO: Implement favorite toggle API
  lab.isFavorite = !lab.isFavorite;
  ElMessage.success(lab.isFavorite ? '已添加收藏' : '已取消收藏');
};

// Watch for pagination changes
watch(() => pagination.page, () => {
  loadLabs();
});

onMounted(() => {
  loadLabs();
});
</script>

<template>
  <PageLayout
    title="实验室预约"
    description="选择适合您的实验室"
    :loading="loading"
  >
    <div class="mb-6">
      <LabFilter
        :model-value="filters"
        @update:model-value="handleFilterUpdate"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <div class="min-h-[400px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <LabCard
          v-for="lab in labs"
          :key="lab.id"
          :lab="lab"
          @click="handleLabClick"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>

      <EmptyState
        v-if="labs.length === 0 && !loading"
        description="暂无实验室"
      />

      <div v-if="total && total > pagination.pageSize" class="flex justify-center">
        <ElPagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </PageLayout>
</template>
