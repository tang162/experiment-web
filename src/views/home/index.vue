<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElCarousel, ElCarouselItem, ElButton, ElIcon } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';
import { getLabsApi, toggleFavoriteApi } from '@/api';
import { ElMessage } from 'element-plus';
import { LabCard, SearchBar } from '@/components';

const router = useRouter();

// 直接使用固定的轮播图地址
const banners = ref([
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581093458791-9d42e1c5e2e2?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&h=400&fit=crop',
]);
const popularLabs = ref([]);
const searchKeyword = ref('');
const loading = ref(false);

const functionCards = [
  {
    title: '实验室预约',
    icon: 'Calendar',
    description: '快速预约实验室',
    route: '/labs',
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: '仪器申请',
    icon: 'Tools',
    description: '申请使用实验仪器',
    route: '/instruments',
    color: 'from-green-400 to-green-600',
  },
  {
    title: '预约记录',
    icon: 'Document',
    description: '查看预约历史',
    route: '/profile/reservations',
    color: 'from-purple-400 to-purple-600',
  },
  {
    title: '新闻公告',
    icon: 'Bell',
    description: '查看最新公告',
    route: '/news',
    color: 'from-pink-400 to-pink-600',
  },
  {
    title: '消息通知',
    icon: 'Message',
    description: '查看系统通知',
    route: '/notification/list',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    title: '维修记录',
    icon: 'Setting',
    description: '查看维修记录',
    route: '/profile/repairs',
    color: 'from-red-400 to-red-600',
  },
];



const fetchPopularLabs = async () => {
  try {
    loading.value = true;
    const result = await getLabsApi({ pageSize: 6 });
    popularLabs.value = result.list || result || [];
  } catch (error) {
    console.error('获取热门实验室失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (keyword) => {
  router.push({
    path: '/labs',
    query: keyword ? { keyword } : {},
  });
};

const goToFunction = (route) => {
  router.push(route);
};

const handleLabClick = (lab) => {
  router.push(`/labs/${lab.id}`);
};

const handleToggleFavorite = async (lab) => {
  try {
    await toggleFavoriteApi(lab.id);
    lab.isFavorite = !lab.isFavorite;
    ElMessage.success(lab.isFavorite ? '已收藏' : '已取消收藏');
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

onMounted(() => {
  fetchPopularLabs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <ElCarousel height="400px" :interval="5000" arrow="always">
          <ElCarouselItem v-for="(banner, index) in banners" :key="index">
            <div class="h-full w-full">
              <img :src="banner" :alt="`轮播图 ${index + 1}`" class="w-full h-full object-cover rounded-lg" />
            </div>
          </ElCarouselItem>
        </ElCarousel>
      </div>

      <div class="mb-12">
        <div class="max-w-2xl mx-auto">
          <SearchBar v-model="searchKeyword" placeholder="搜索实验室名称或设备类型" @search="handleSearch" />
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">快速入口</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="card in functionCards" :key="card.route"
            class="cursor-pointer transform transition-all duration-300 hover:scale-105"
            @click="goToFunction(card.route)">
            <div class="bg-gradient-to-br rounded-2xl shadow-lg p-6 h-full text-white" :class="card.color">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold">{{ card.title }}</h3>
                <ElIcon :size="32">
                  <component :is="card.icon" />
                </ElIcon>
              </div>
              <p class="text-white/90">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">热门实验室</h2>
          <ElButton link @click="router.push('/labs')">
            查看更多 <ElIcon class="ml-1">
              <ArrowRight />
            </ElIcon>
          </ElButton>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LabCard v-for="lab in popularLabs" :key="lab.id" :lab="lab" @click="handleLabClick"
            @toggleFavorite="handleToggleFavorite" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-carousel__item) {
  border-radius: 8px;
  overflow: hidden;
}
</style>
