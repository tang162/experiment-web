<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElPagination, ElCard, ElTag, ElButton, ElEmpty, ElAvatar, ElIcon } from 'element-plus';
import { ChatDotRound, Clock, Location } from '@element-plus/icons-vue';
import { PageLayout, FilterBar } from '@/components';
import { getFeedbacksApi } from '@/api';
import { useApi, usePagination } from '@/composables';
import { useUserStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const feedbacks = ref([]);
const total = ref(0);

// 筛选条件
const filters = reactive({
  labId: route.query.labId ? Number(route.query.labId) : undefined,
  status: route.query.status !== undefined ? Number(route.query.status) : undefined,
});

const { loading, execute: fetchFeedbacks } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 状态映射
const statusMap = {
  0: { label: '待处理', type: 'warning' },
  1: { label: '已回复', type: 'success' },
  2: { label: '已关闭', type: 'info' },
};

// 筛选选项
const filterOptions = [
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '待处理', value: 0 },
      { label: '已回复', value: 1 },
      { label: '已关闭', value: 2 },
    ],
  },
];

// 是否可以创建反馈
const canCreate = computed(() => userStore.isLoggedIn);

// 加载反馈列表
const loadFeedbacks = async () => {
  const result = await fetchFeedbacks(() =>
    getFeedbacksApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      labId: filters.labId,
      status: filters.status,
    })
  );

  if (result) {
    feedbacks.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 处理筛选
const handleFilter = () => {
  resetPage();
  loadFeedbacks();
  router.replace({
    query: { ...filters, page: pagination.page },
  });
};

// 处理重置
const handleReset = () => {
  filters.labId = undefined;
  filters.status = undefined;
  resetPage();
  loadFeedbacks();
  router.replace({ query: {} });
};

// 查看详情
const handleViewDetail = (feedback) => {
  router.push({ name: 'FeedbackDetail', params: { id: feedback.id } });
};

// 创建反馈
const handleCreate = () => {
  router.push({ name: 'FeedbackCreate' });
};

// 处理分页变化
const handlePageChangeEvent = (newPage) => {
  handlePageChange(newPage);
  loadFeedbacks();
};

// 格式化时间
const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN');
};

onMounted(() => {
  loadFeedbacks();
});
</script>

<template>
  <PageLayout title="问题反馈" description="查看和管理实验室使用过程中的问题反馈" :loading="loading">
    <template #actions>
      <ElButton v-if="canCreate" type="primary" @click="handleCreate">提交反馈</ElButton>
    </template>

    <!-- 筛选栏 -->
    <div class="mb-6">
      <FilterBar
        :model-value="filters"
        :filter-options="filterOptions"
        @filter="handleFilter"
        @reset="handleReset"
      />
    </div>

    <!-- 反馈列表 -->
    <div class="space-y-4">
      <ElCard
        v-for="feedback in feedbacks"
        :key="feedback.id"
        class="cursor-pointer hover:shadow-md transition-shadow"
        @click="handleViewDetail(feedback)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <ElAvatar :size="32" :src="feedback.user?.avatar">
                {{ feedback.user?.nickname?.[0] || feedback.user?.username?.[0] }}
              </ElAvatar>
              <span class="font-medium">{{ feedback.user?.nickname || feedback.user?.username }}</span>
              <ElTag :type="statusMap[feedback.status]?.type" size="small">
                {{ statusMap[feedback.status]?.label }}
              </ElTag>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ feedback.title }}</h3>
            <p class="text-gray-600 line-clamp-2 mb-3">{{ feedback.content }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <ElIcon><Location /></ElIcon>
                {{ feedback.lab?.name }}
              </span>
              <span class="flex items-center gap-1">
                <ElIcon><Clock /></ElIcon>
                {{ formatTime(feedback.createdAt) }}
              </span>
              <span class="flex items-center gap-1">
                <ElIcon><ChatDotRound /></ElIcon>
                {{ feedback.replies?.length || 0 }} 条回复
              </span>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 空状态 -->
    <ElEmpty v-if="feedbacks.length === 0 && !loading" description="暂无反馈记录" />

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
  </PageLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
