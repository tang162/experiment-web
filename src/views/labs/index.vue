<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { labApi } from '@/api';
import { PageHeader, LabCard, LabFilter, EmptyState } from '@/components';
import { LabStatus, type Lab, type LabFilter as LabFilterType } from '@/types';

const router = useRouter();
const route = useRoute();

const labs = ref<Lab[]>([]);
const total = ref(0);
const loading = ref(false);

const pagination = reactive({
  page: 1,
  pageSize: 12,
});

const filters = reactive<LabFilterType>({
  keyword: (route.query.keyword as string) || '',
  department: (route.query.department as string) || '',
  equipmentType: (route.query.equipmentType as string) || '',
  status: (route.query.status as LabStatus) || undefined,
  minCapacity: undefined,
  maxCapacity: undefined,
});

const fetchLabs = async () => {
  loading.value = true;
  try {
    const response = await labApi.getLabList({
      ...filters,
      ...pagination,
    });
    labs.value = response.list;
    total.value = response.total;
  } catch (error) {
    console.error('获取实验室列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  fetchLabs();
};

const handleFilterUpdate = (newFilters: LabFilterType) => {
  Object.assign(filters, newFilters);
};

const handleFilter = () => {
  pagination.page = 1;
  fetchLabs();
};

const handleReset = () => {
  pagination.page = 1;
  fetchLabs();
};

const handleLabClick = (lab: Lab) => {
  router.push(`/labs/${lab.id}`);
};

const handleToggleFavorite = async (lab: Lab) => {
  try {
    await labApi.toggleFavorite(lab.id);
    lab.isFavorite = !lab.isFavorite;
  } catch (error) {
    console.error('收藏操作失败:', error);
  }
};

onMounted(() => {
  fetchLabs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <PageHeader
        title="实验室预约"
        description="选择适合您的实验室"
      />

      <div class="mb-6">
        <LabFilter
          :model-value="filters"
          @update:model-value="handleFilterUpdate"
          @filter="handleFilter"
          @reset="handleReset"
        />
      </div>

      <div v-loading="loading" class="min-h-[400px]">
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

        <div v-if="total > pagination.pageSize" class="flex justify-center">
          <el-pagination
            v-model:current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
