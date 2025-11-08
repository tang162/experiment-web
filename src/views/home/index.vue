<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElCarousel, ElCarouselItem, ElButton, ElIcon } from 'element-plus';
import { ArrowRight } from '@element-plus/icons-vue';
import { bannerApi, getLabsApi } from '@/api';
import { LabCard, SearchBar } from '@/components';
import type { Banner, Lab } from '@/types';

const router = useRouter();

const banners = ref<Banner[]>([]);
const popularLabs = ref<Lab[]>([]);
const searchKeyword = ref('');
const loading = ref(false);

const functionCards = [
  {
    title: '实验室预约',
    icon: 'Calendar',
    description: '快速预约实验室',
    route: '/lab/labs',
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: '仪器申请',
    icon: 'Tools',
    description: '申请使用实验仪器',
    route: '/equipment/apply',
    color: 'from-green-400 to-green-600',
  },
  {
    title: '设备报修',
    icon: 'Warning',
    description: '报告设备故障',
    route: '/equipment/repair',
    color: 'from-orange-400 to-orange-600',
  },
  {
    title: '预约记录',
    icon: 'Document',
    description: '查看预约历史',
    route: '/reservation/list',
    color: 'from-purple-400 to-purple-600',
  },
];

const fetchBanners = async () => {
  try {
    // banners.value = await bannerApi.getBanners(5);
  } catch (error) {
    console.error('获取轮播图失败:', error);
  }
};

const fetchPopularLabs = async () => {
  try {
    loading.value = true;
    // const result = await getLabsApi({ pageSize: 6 });
    // popularLabs.value = result || [];
  } catch (error) {
    console.error('获取热门实验室失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (keyword: string) => {
  router.push({
    path: '/lab/labs',
    query: keyword ? { keyword } : {},
  });
};

const goToFunction = (route: string) => {
  router.push(route);
};

const handleLabClick = (lab: Lab) => {
  router.push(`/lab/labs/${lab.id}`);
};

const handleToggleFavorite = async (lab: Lab) => {
  // TODO: Implement favorite toggle API
  lab.isFavorite = !lab.isFavorite;
  console.log('Favorite toggled:', lab.isFavorite);
};

onMounted(() => {
  fetchBanners();
  fetchPopularLabs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <ElCarousel height="400px" :interval="5000" arrow="always">
          <ElCarouselItem v-for="banner in banners" :key="banner.id">
            <div class="h-full w-full cursor-pointer" @click="banner.link && router.push(banner.link)">
              <img :src="banner.image" :alt="banner.title" class="w-full h-full object-cover rounded-lg" />
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
          <ElButton link @click="router.push('/lab/labs')">
            查看更多 <ElIcon class="ml-1">
              <ArrowRight />
            </ElIcon>
          </ElButton>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LabCard v-for="lab in popularLabs" :key="lab.id" :lab="lab" @click="handleLabClick"
            @toggle-favorite="handleToggleFavorite" />
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
