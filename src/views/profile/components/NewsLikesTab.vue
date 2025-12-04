<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElEmpty, ElPagination, ElIcon, ElMessage } from 'element-plus';
import { Star, Collection } from '@element-plus/icons-vue';
import { getMyNewsLikesApi } from '@/api';

const router = useRouter();
const loading = ref(false);
const newsList = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);
const initialized = ref(false);

// 加载我点赞的动态
const loadMyLikes = async () => {
  loading.value = true;
  try {
    const response = await getMyNewsLikesApi({
      page: page.value,
      pageSize: pageSize.value
    });
    console.log(response)
    newsList.value = response.list || [];
    total.value = response.total || 0;
    initialized.value = true;
  } catch (error) {
    ElMessage.error(error.message || '加载失败');
    initialized.value = true; // 即使失败也标记为已初始化，显示空状态
  } finally {
    loading.value = false;
  }
};

// 查看详情
const viewDetail = (id) => {
  router.push(`/news/${id}`);
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

// 分页变化
const handlePageChange = (newPage) => {
  page.value = newPage;
  loadMyLikes();
};

// 初始化加载（由父组件调用）
const init = () => {
  if (!initialized.value) {
    loadMyLikes();
  }
};

// 暴露方法给父组件
defineExpose({ init });
</script>

<template>
  <div v-loading="loading" class="min-h-[400px]">
    <div v-if="newsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ElCard
        v-for="news in newsList"
        :key="news.id"
        shadow="hover"
        class="cursor-pointer transition-all hover:shadow-lg"
        @click="viewDetail(news.id)"
      >
        <!-- 封面图片 -->
        <div v-if="news.coverImage" class="mb-3">
          <img
            :src="news.coverImage"
            :alt="news.title"
            class="w-full h-40 object-cover rounded"
          />
        </div>

        <div class="flex flex-col h-full">
          <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ news.title }}</h3>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{{ news.content }}</p>
          
          <div class="space-y-2">
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <ElIcon><Star /></ElIcon>
                {{ news.likes || 0 }}
              </span>
              <span class="flex items-center gap-1">
                <ElIcon><Collection /></ElIcon>
                {{ news.favorites || 0 }}
              </span>
            </div>
            
            <div class="text-xs text-gray-400">
              <div>作者: {{ news.author?.nickname || news.author?.username || '未知' }}</div>
              <div v-if="news.likedAt">点赞时间: {{ formatDate(news.likedAt) }}</div>
            </div>
          </div>
        </div>
      </ElCard>
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="flex justify-center mt-6">
      <ElPagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="newsList.length === 0 && !loading && initialized" class="bg-white rounded-lg shadow-md p-12">
      <ElEmpty description="暂无点赞的动态">
        <template #image>
          <ElIcon :size="80" color="#909399">
            <Star />
          </ElIcon>
        </template>
      </ElEmpty>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
