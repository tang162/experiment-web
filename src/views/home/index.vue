<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import { bannerApi, labApi } from '@/api';
import type { Banner, Lab, LabFilter } from '@/types';

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
    route: '/labs',
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
    route: '/reservations',
    color: 'from-purple-400 to-purple-600',
  },
];

const fetchBanners = async () => {
  try {
    banners.value = await bannerApi.getBanners(5);
  } catch (error) {
    console.error('获取轮播图失败:', error);
  }
};

const fetchPopularLabs = async () => {
  try {
    loading.value = true;
    popularLabs.value = await labApi.getPopularLabs(6);
  } catch (error) {
    console.error('获取热门实验室失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  const filter: LabFilter = {};
  if (searchKeyword.value) {
    filter.keyword = searchKeyword.value;
  }
  router.push({
    path: '/labs',
    query: filter,
  });
};

const goToFunction = (route: string) => {
  router.push(route);
};

const goToLabDetail = (id: string | number) => {
  router.push(`/labs/${id}`);
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
        <el-carousel height="400px" :interval="5000" arrow="always">
          <el-carousel-item v-for="banner in banners" :key="banner.id">
            <div
              class="h-full w-full cursor-pointer"
              @click="banner.link && router.push(banner.link)"
            >
              <img
                :src="banner.image"
                :alt="banner.title"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="mb-12">
        <div class="max-w-2xl mx-auto">
          <el-input
            v-model="searchKeyword"
            size="large"
            placeholder="搜索实验室名称或设备类型"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">快速入口</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="card in functionCards"
            :key="card.route"
            class="cursor-pointer transform transition-all duration-300 hover:scale-105"
            @click="goToFunction(card.route)"
          >
            <div
              class="bg-gradient-to-br rounded-2xl shadow-lg p-6 h-full text-white"
              :class="card.color"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold">{{ card.title }}</h3>
                <el-icon :size="32">
                  <component :is="card.icon" />
                </el-icon>
              </div>
              <p class="text-white/90">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">热门实验室</h2>
          <el-button type="text" @click="router.push('/labs')">
            查看更多 <el-icon class="ml-1"><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div v-loading="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="lab in popularLabs"
            :key="lab.id"
            class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            @click="goToLabDetail(lab.id)"
          >
            <div class="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <el-icon :size="64" color="white">
                <School />
              </el-icon>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ lab.name }}</h3>
                <el-tag size="small" :type="lab.status === 'AVAILABLE' ? 'success' : 'info'">
                  {{ lab.status === 'AVAILABLE' ? '可用' : lab.status === 'OCCUPIED' ? '占用' : '维护中' }}
                </el-tag>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ lab.department }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span class="flex items-center">
                  <el-icon class="mr-1"><User /></el-icon>
                  {{ lab.capacity }}人
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Star /></el-icon>
                  {{ lab.rating?.toFixed(1) || '暂无评分' }}
                </span>
              </div>
            </div>
          </div>
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
