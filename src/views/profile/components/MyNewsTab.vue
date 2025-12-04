<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElCard, ElButton, ElEmpty, ElPagination, ElMessage, ElMessageBox, ElIcon } from 'element-plus';
import { Edit, Delete, View, Star, Collection } from '@element-plus/icons-vue';
import { getMyNewsApi, deleteNewsApi } from '@/api';
import { useApi, usePagination } from '@/composables';

const router = useRouter();

const newsList = ref([]);
const total = ref(0);

const { loading, execute: fetchNews } = useApi();
const { pagination, handlePageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 加载我的动态
const loadMyNews = async () => {
  const result = await fetchNews(() =>
    getMyNewsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
  );

  if (result) {
    newsList.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 查看详情
const viewDetail = (id) => {
  router.push(`/news/${id}`);
};

// 编辑
const handleEdit = (id) => {
  router.push(`/news/edit/${id}`);
};

// 删除
const handleDelete = async (news) => {
  try {
    await ElMessageBox.confirm('确定要删除这条动态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await deleteNewsApi(news.id);
    ElMessage.success('删除成功');
    loadMyNews();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

// 初始化方法（供父组件调用）
const init = () => {
  loadMyNews();
};

defineExpose({ init });
</script>

<template>
  <div v-loading="loading" class="min-h-[400px]">
    <div class="space-y-4">
      <ElCard
        v-for="news in newsList"
        :key="news.id"
        shadow="hover"
        class="cursor-pointer transition-all hover:shadow-lg"
      >
        <div class="flex justify-between items-start gap-4">
          <!-- 封面图 -->
          <div v-if="news.coverImage || news.cover" class="flex-shrink-0">
            <img
              :src="news.coverImage || news.cover"
              :alt="news.title"
              class="w-32 h-32 object-cover rounded-lg"
            />
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 min-w-0" @click="viewDetail(news.id)">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ news.title }}</h3>
            <p class="text-gray-600 mb-3 line-clamp-2">{{ news.content }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>发布时间: {{ formatDate(news.createdAt) }}</span>
              <span class="flex items-center gap-1">
                <ElIcon><Star /></ElIcon>
                {{ news.likes || 0 }}
              </span>
              <span class="flex items-center gap-1">
                <ElIcon><Collection /></ElIcon>
                {{ news.favorites || 0 }}
              </span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex-shrink-0 flex gap-2">
            <ElButton size="small" :icon="View" @click="viewDetail(news.id)">
              查看
            </ElButton>
            <ElButton size="small" type="primary" :icon="Edit" @click="handleEdit(news.id)">
              编辑
            </ElButton>
            <ElButton size="small" type="danger" :icon="Delete" @click="handleDelete(news)">
              删除
            </ElButton>
          </div>
        </div>
      </ElCard>

      <!-- 空状态 -->
      <div v-if="newsList.length === 0 && !loading" class="bg-white rounded-lg shadow-md p-12">
        <ElEmpty description="暂无发布的动态">
          <ElButton type="primary" @click="$router.push('/news/create')">
            发布动态
          </ElButton>
        </ElEmpty>
      </div>

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
