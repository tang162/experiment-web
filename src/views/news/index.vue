<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElCard, ElButton, ElTag, ElPagination, ElInput, ElIcon, ElEmpty } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';
import { getNewsListApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi, usePagination } from '@/composables';
import { useAuthStore } from '@/stores';
import { UserRole } from '@/types';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const newsList = ref([]);
const total = ref(0);

const filters = reactive({
  keyword: route.query.keyword || '',
  category: route.query.category || '',
});

const { loading, execute: fetchNews } = useApi();
const { pagination, handlePageChange, resetPage } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 是否是教师
const isTeacher = authStore.getUserRole === UserRole.TEACHER;

// 加载新闻列表
const loadNews = async () => {
  const result = await fetchNews(() =>
    getNewsListApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: filters.keyword,
      category: filters.category,
    })
  );

  if (result) {
    newsList.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 搜索
const handleSearch = () => {
  resetPage();
  loadNews();
};

// 查看详情
const viewDetail = (id) => {
  router.push(`/news/${id}`);
};

// 发布新闻
const createNews = () => {
  router.push('/news/create');
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

// 监听分页变化
watch(() => pagination.page, loadNews);

onMounted(() => {
  loadNews();
});
</script>

<template>
  <PageLayout title="新闻公告" description="查看最新的实验室新闻和公告" :loading="loading">
    <!-- 搜索和操作栏 -->
    <div class="mb-6 flex justify-between items-center">
      <div class="flex gap-4 flex-1 max-w-md">
        <ElInput
          v-model="filters.keyword"
          placeholder="搜索新闻标题或内容"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <ElIcon><Search /></ElIcon>
          </template>
        </ElInput>
        <ElButton type="primary" @click="handleSearch">搜索</ElButton>
      </div>
      
      <ElButton v-if="isTeacher" type="primary" :icon="Plus" @click="createNews">
        发布新闻
      </ElButton>
    </div>

    <!-- 新闻列表 -->
    <div class="space-y-4">
      <ElCard
        v-for="news in newsList"
        :key="news.id"
        shadow="hover"
        class="cursor-pointer transition-all hover:shadow-lg"
        @click="viewDetail(news.id)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ news.title }}</h3>
            <p class="text-gray-600 mb-3 line-clamp-2">{{ news.content }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>作者: {{ news.author?.username || '未知' }}</span>
              <span>发布时间: {{ formatDate(news.createdAt) }}</span>
              <span v-if="news.viewCount">浏览: {{ news.viewCount }}</span>
              <span v-if="news.likeCount">点赞: {{ news.likeCount }}</span>
            </div>
          </div>
          <div v-if="news.category" class="ml-4">
            <ElTag>{{ news.category }}</ElTag>
          </div>
        </div>
      </ElCard>

      <!-- 空状态 -->
      <ElEmpty v-if="newsList.length === 0 && !loading" description="暂无新闻" />

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
