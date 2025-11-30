<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getMyFavoritesApi, toggleFavoriteApi } from '@/api';
import { PageLayout, LabCard, EmptyState } from '@/components';
import { useApi } from '@/composables';

const router = useRouter();

const favorites = ref([]);

const { loading, execute: fetchFavorites } = useApi();

// 加载收藏列表
const loadFavorites = async () => {
  const result = await fetchFavorites(() => getMyFavoritesApi());

  if (result) {
    favorites.value = result.list || [];
  }
};

// 点击实验室卡片
const handleLabClick = (lab) => {
  router.push(`/lab/labs/${lab.id}`);
};

// 取消收藏
const handleToggleFavorite = async (lab) => {
  try {
    await toggleFavoriteApi(lab.id);
    ElMessage.success('已取消收藏');
    loadFavorites();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

onMounted(() => {
  loadFavorites();
});
</script>

<template>
  <PageLayout title="我的收藏" description="查看您收藏的实验室" :loading="loading">
    <div class="min-h-[400px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
        <LabCard
          v-for="favorite in favorites"
          :key="favorite.id"
          :lab="favorite.lab"
          @click="handleLabClick"
          @toggleFavorite="handleToggleFavorite"
        />
      </div>

      <EmptyState v-if="favorites.length === 0 && !loading" description="暂无收藏" />
    </div>
  </PageLayout>
</template>
