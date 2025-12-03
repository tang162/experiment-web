<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElTag, ElDivider, ElRate, ElCarousel, ElCarouselItem, ElImage, ElMessage, ElIcon } from 'element-plus';
import { ArrowLeft, Star } from '@element-plus/icons-vue';
import { getLabDetailApi, toggleFavoriteApi } from '@/api';
import { PageLayout, InstrumentCard } from '@/components';
import { useApi } from '@/composables';

// 点击器材卡片跳转到器材详情
const goToInstrumentDetail = (instrument) => {
  router.push(`/instruments/${instrument.id}`);
};

const route = useRoute();
const router = useRouter();

const { data: lab, loading, execute: fetchLabDetail } = useApi();
const favoriteLoading = ref(false); // Track loading state for favorite button

const loadLabDetail = async () => {
  const result = await fetchLabDetail(() =>
    getLabDetailApi(Number(route.params.id))
  );

  if (result) {
    lab.value = result;
  }
};

const goBack = () => {
  router.back();
};

const goToReserve = () => {
  router.push(`/labs/reserve/${route.params.id}`);
};

// 收藏相关的计算属性
const isFavorited = computed(() => {
  return lab.value?.isFavorite || false;
});

const favoriteButtonText = computed(() => {
  return isFavorited.value ? '已收藏' : '收藏';
});

const favoriteButtonIcon = computed(() => {
  return Star;
});

// 切换收藏状态
const handleToggleFavorite = async () => {
  // 防止重复点击
  if (favoriteLoading.value) {
    return;
  }

  // 添加loading状态
  favoriteLoading.value = true;

  // 保存原始状态用于回滚
  const originalFavoriteState = lab.value?.isFavorite || false;

  try {
    // 乐观更新：立即更新UI状态
    if (lab.value) {
      lab.value.isFavorite = !lab.value.isFavorite;
    }

    // 调用API
    const result = await toggleFavoriteApi(route.params.id);
    
    if (result) {
      // 显示成功提示
      ElMessage.success(result.data?.message || '操作成功');
    }
  } catch (error) {
    // API调用失败，回滚UI状态
    if (lab.value) {
      lab.value.isFavorite = originalFavoriteState;
    }

    // 显示错误提示
    ElMessage.error(error.message || '操作失败，请稍后重试');
  } finally {
    // 移除loading状态
    favoriteLoading.value = false;
  }
};

// 状态相关的计算属性
const statusType = computed(() => {
  if (!lab.value) return 'info';
  switch (lab.value.status) {
    case 0: // 正常
      return 'success';
    case 1: // 维护中
      return 'warning';
    case 2: // 停用
      return 'danger';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  if (!lab.value) return '未知';
  switch (lab.value.status) {
    case 0: // 正常
      return '正常';
    case 1: // 维护中
      return '维护中';
    case 2: // 停用
      return '停用';
    default:
      return '未知';
  }
});

// 格式化更新时间
const formattedUpdateTime = computed(() => {
  if (!lab.value?.updatedAt) return '未知';
  return new Date(lab.value.updatedAt).toLocaleString('zh-CN');
});

onMounted(() => {
  loadLabDetail();
});
</script>

<template>
  <PageLayout :title="lab?.name || '实验室详情'" :description="lab?.department || ''" :loading="loading">
    <div v-if="lab" class="space-y-6">
      <!-- 返回按钮 -->
      <div class="mb-4">
        <ElButton :icon="ArrowLeft" @click="goBack">返回列表</ElButton>
      </div>

      <!-- 实验室图片轮播 -->
      <div v-if="lab.images && lab.images.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <ElCarousel height="400px" :interval="5000">
          <ElCarouselItem v-for="(image, index) in lab.images" :key="index">
            <ElImage :src="image" fit="cover" class="w-full h-full" />
          </ElCarouselItem>
        </ElCarousel>
      </div>

      <!-- 主要信息卡片 -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ lab.name }}</h1>
            <p class="text-lg text-gray-600 mb-2">{{ lab.department }}</p>
            <div class="flex items-center space-x-2">
              <ElTag :type="statusType">{{ statusText }}</ElTag>
              <span class="text-sm text-gray-500">更新于 {{ formattedUpdateTime }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <ElButton 
              size="large" 
              @click="handleToggleFavorite"
              :type="isFavorited ? 'danger' : 'default'"
              :plain="!isFavorited"
              :loading="favoriteLoading"
              :disabled="favoriteLoading"
            >
              <ElIcon class="mr-1" v-if="!favoriteLoading">
                <component :is="favoriteButtonIcon" :filled="isFavorited" />
              </ElIcon>
              {{ favoriteButtonText }}
            </ElButton>
            <ElButton type="primary" size="large" @click="goToReserve" :disabled="lab.status !== 0">
              {{ lab.status === 0 ? '预约实验室' : '暂不可预约' }}
            </ElButton>
          </div>
        </div>

        <ElDivider />

        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800">基本信息</h3>
            <div class="space-y-3">
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">实验室名称：</span>
                <span class="font-medium">{{ lab.name }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">所属院系：</span>
                <span class="font-medium">{{ lab.department }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">实验室位置：</span>
                <span class="font-medium">{{ lab.location }}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">容纳人数：</span>
                <span class="font-medium">{{ lab.capacity }} 人</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">实验室状态：</span>
                <ElTag :type="statusType">{{ statusText }}</ElTag>
              </div>
              <div class="flex items-start">
                <span class="text-gray-600 w-28 flex-shrink-0">综合评分：</span>
                <div class="flex items-center">
                  <ElRate :value="lab.rating" disabled show-score text-color="#ff9900" />
                </div>
              </div>
            </div>
          </div>

          <!-- 标签和设备 -->
          <div class="space-y-6">
            <div v-if="lab.tags && lab.tags.length > 0">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">实验室标签</h3>
              <div class="flex flex-wrap gap-2">
                <ElTag v-for="tag in lab.tags" :key="tag" type="primary" effect="plain">
                  {{ tag }}
                </ElTag>
              </div>
            </div>

            <div v-if="lab.equipmentList && lab.equipmentList.length > 0">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">设备列表</h3>
              <div class="flex flex-wrap gap-2">
                <ElTag v-for="equipment in lab.equipmentList" :key="equipment" type="success" effect="plain">
                  {{ equipment }}
                </ElTag>
              </div>
            </div>
          </div>
        </div>

        <!-- 实验室介绍 -->
        <div v-if="lab.description">
          <ElDivider />
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800">实验室介绍</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ lab.description }}</p>
          </div>
        </div>

        <!-- 关联器材 -->
        <div v-if="lab.instruments && lab.instruments.length > 0">
          <ElDivider />
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-800">关联器材</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <InstrumentCard 
                v-for="instrument in lab.instruments" 
                :key="instrument.id" 
                :instrument="instrument"
                @click="goToInstrumentDetail"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>
