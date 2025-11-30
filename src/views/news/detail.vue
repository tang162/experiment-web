<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElButton, ElIcon, ElMessage, ElMessageBox, ElDivider } from 'element-plus';
import { ArrowLeft, Edit, Delete, Star, StarFilled } from '@element-plus/icons-vue';
import { getNewsDetailApi, likeNewsApi, deleteNewsApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import { useAuthStore } from '@/stores';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const newsDetail = ref(null);
const isLiked = ref(false);

const { loading, execute: fetchDetail } = useApi();

const newsId = computed(() => Number(route.params.id));

// 是否是作者本人
const isAuthor = computed(() => {
  return newsDetail.value?.author?.id === authStore.getUserInfo?.id;
});

// 加载新闻详情
const loadDetail = async () => {
  const result = await fetchDetail(() => getNewsDetailApi(newsId.value));
  if (result) {
    newsDetail.value = result;
  }
};

// 点赞
const handleLike = async () => {
  try {
    await likeNewsApi(newsId.value);
    isLiked.value = !isLiked.value;
    if (isLiked.value) {
      newsDetail.value.likeCount = (newsDetail.value.likeCount || 0) + 1;
      ElMessage.success('点赞成功');
    } else {
      newsDetail.value.likeCount = Math.max(0, (newsDetail.value.likeCount || 0) - 1);
      ElMessage.success('取消点赞');
    }
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 编辑
const handleEdit = () => {
  router.push(`/news/edit/${newsId.value}`);
};

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇新闻吗？', '提示', {
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

        <!-- 元信息 -->
        <div class="flex items-center justify-between mb-6 text-sm text-gray-500">
          <div class="flex items-center gap-4">
            <span>作者: {{ newsDetail.author?.username || '未知' }}</span>
            <span>发布时间: {{ formatDate(newsDetail.createdAt) }}</span>
            <span v-if="newsDetail.viewCount">浏览: {{ newsDetail.viewCount }}</span>
          </div>
          
          <!-- 操作按钮 -->
          <div v-if="isAuthor" class="flex gap-2">
            <ElButton size="small" :icon="Edit" @click="handleEdit">编辑</ElButton>
            <ElButton size="small" type="danger" :icon="Delete" @click="handleDelete">删除</ElButton>
          </div>
        </div>

        <ElDivider />

        <!-- 内容 -->
        <div class="prose max-w-none mb-8">
          <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ newsDetail.content }}</div>
        </div>

        <!-- 图片 -->
        <div v-if="newsDetail.images && newsDetail.images.length > 0" class="mb-8">
          <div class="grid grid-cols-2 gap-4">
            <img
              v-for="(image, index) in newsDetail.images"
              :key="index"
              :src="image"
              :alt="`图片${index + 1}`"
              class="w-full rounded-lg"
            />
          </div>
        </div>

        <ElDivider />

        <!-- 点赞 -->
        <div class="flex items-center justify-center gap-4">
          <ElButton
            :type="isLiked ? 'primary' : 'default'"
            size="large"
            @click="handleLike"
          >
            <ElIcon class="mr-2">
              <component :is="isLiked ? StarFilled : Star" />
            </ElIcon>
            {{ isLiked ? '已点赞' : '点赞' }} ({{ newsDetail.likeCount || 0 }})
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
