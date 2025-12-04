<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElButton, ElIcon, ElMessage, ElMessageBox, ElDivider, ElCarousel, ElCarouselItem, ElTag } from 'element-plus';
import { ArrowLeft, Edit, Delete, Star, StarFilled, Collection, FolderOpened } from '@element-plus/icons-vue';
import { getNewsDetailApi, deleteNewsApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import { useAuthStore } from '@/stores';
import { request } from '@/utils/https';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const newsDetail = ref(null);

const { loading, execute: fetchDetail } = useApi();

const newsId = computed(() => Number(route.params.id));

// 是否是作者本人或管理员
const canEdit = computed(() => {
  const userRole = authStore.getUserRole;
  const userId = authStore.getUserInfo?.id;
  return newsDetail.value?.author?.id === userId || ['admin', 'super_admin'].includes(userRole);
});

// 加载动态详情
const loadDetail = async () => {
  const result = await fetchDetail(() => getNewsDetailApi(newsId.value));
  console.log(result)
  if (result) {
    newsDetail.value = result;
  }
};

// 切换点赞
const toggleLike = async () => {
  try {
    const response = await request.post(`/news/${newsId.value}/like`);
    newsDetail.value.isLiked = response.isLiked;
    newsDetail.value.likes = newsDetail.value.isLiked 
      ? (newsDetail.value.likes || 0) + 1 
      : Math.max(0, (newsDetail.value.likes || 0) - 1);
    ElMessage.success(response.message);
  } catch (error) {
    ElMessage.error(error.message || '操作失败');
  }
};

// 切换收藏
const toggleFavorite = async () => {
  try {
    const response = await request.post(`/news/${newsId.value}/favorite`);
    newsDetail.value.isFavorited = response.isFavorited;
    newsDetail.value.favorites = newsDetail.value.isFavorited 
      ? (newsDetail.value.favorites || 0) + 1 
      : Math.max(0, (newsDetail.value.favorites || 0) - 1);
    ElMessage.success(response.message);
  } catch (error) {
    ElMessage.error(error.message || '操作失败');
  }
};

// 编辑
const handleEdit = () => {
  router.push(`/news/edit/${newsId.value}`);
};

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这条动态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await deleteNewsApi(newsId.value);
    ElMessage.success('删除成功');
    router.push('/news');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 返回
const goBack = () => {
  router.back();
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadDetail();
});
</script>

<template>
  <PageLayout :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <div v-if="newsDetail">
        <!-- 标题 -->
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ newsDetail.title }}</h1>

        <!-- 标签 -->
        <div v-if="newsDetail.tags && newsDetail.tags.length > 0" class="flex gap-2 mb-4">
          <ElTag v-for="tag in newsDetail.tags" :key="tag" type="info">
            {{ tag }}
          </ElTag>
        </div>

        <!-- 元信息 -->
        <div class="flex items-center justify-between mb-6 text-sm text-gray-500">
          <div class="flex items-center gap-4">
            <span>作者: {{ newsDetail.author?.nickname || newsDetail.author?.username || '未知' }}</span>
            <span>发布时间: {{ formatDate(newsDetail.createdAt) }}</span>
            <span class="flex items-center gap-1">
              <ElIcon><Star /></ElIcon>
              {{ newsDetail.likes || 0 }}
            </span>
            <span class="flex items-center gap-1">
              <ElIcon><Collection /></ElIcon>
              {{ newsDetail.favorites || 0 }}
            </span>
          </div>
          
          <!-- 操作按钮 -->
          <div v-if="canEdit" class="flex gap-2">
            <ElButton size="small" :icon="Edit" @click="handleEdit">编辑</ElButton>
            <ElButton size="small" type="danger" :icon="Delete" @click="handleDelete">删除</ElButton>
          </div>
        </div>

        <ElDivider />

        <!-- 内容 -->
        <div class="prose max-w-none mb-8">
          <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ newsDetail.content }}</div>
        </div>

        <!-- 封面图 -->
        <div v-if="newsDetail.coverImage || newsDetail.cover" class="mb-8">
          <img
            :src="newsDetail.coverImage || newsDetail.cover"
            alt="封面图"
            class="w-full max-h-96 object-cover rounded-lg"
          />
        </div>

        <!-- 图片组轮播 -->
        <div v-if="newsDetail.images && newsDetail.images.length > 0" class="mb-8">
          <ElCarousel :interval="4000" type="card" height="400px" arrow="always">
            <ElCarouselItem v-for="(image, index) in newsDetail.images" :key="index">
              <img
                :src="image"
                :alt="`图片${index + 1}`"
                class="w-full h-full object-cover rounded-lg"
              />
            </ElCarouselItem>
          </ElCarousel>
        </div>

        <ElDivider />

        <!-- 点赞和收藏 -->
        <div class="flex items-center justify-center gap-4">
          <ElButton
            :type="newsDetail.isLiked ? 'primary' : 'default'"
            size="large"
            @click="toggleLike"
          >
            <ElIcon class="mr-2">
              <component :is="newsDetail.isLiked ? StarFilled : Star" />
            </ElIcon>
            {{ newsDetail.isLiked ? '已点赞' : '点赞' }} ({{ newsDetail.likes || 0 }})
          </ElButton>
          <ElButton
            :type="newsDetail.isFavorited ? 'warning' : 'default'"
            size="large"
            @click="toggleFavorite"
          >
            <ElIcon class="mr-2">
              <component :is="newsDetail.isFavorited ? FolderOpened : Collection" />
            </ElIcon>
            {{ newsDetail.isFavorited ? '已收藏' : '收藏' }} ({{ newsDetail.favorites || 0 }})
          </ElButton>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<style scoped>
.prose {
  font-size: 16px;
  line-height: 1.8;
}
</style>
