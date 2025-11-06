<script setup lang="ts">
import { computed } from 'vue';
import { School, User, Star } from '@element-plus/icons-vue';
import type { Lab } from '@/types';
import { LabStatus } from '@/types';

interface Props {
  lab: Lab;
  showFavorite?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFavorite: true,
});

const emit = defineEmits<{
  click: [lab: Lab];
  toggleFavorite: [lab: Lab];
}>();

const statusType = computed(() => {
  switch (props.lab.status) {
    case LabStatus.AVAILABLE:
      return 'success';
    case LabStatus.OCCUPIED:
      return 'warning';
    case LabStatus.MAINTENANCE:
      return 'info';
    default:
      return 'info';
  }
});

const statusText = computed(() => {
  switch (props.lab.status) {
    case LabStatus.AVAILABLE:
      return '可用';
    case LabStatus.OCCUPIED:
      return '占用';
    case LabStatus.MAINTENANCE:
      return '维护中';
    default:
      return '未知';
  }
});

const handleClick = () => {
  emit('click', props.lab);
};

const handleFavoriteClick = (event: Event) => {
  event.stopPropagation();
  emit('toggleFavorite', props.lab);
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    @click="handleClick"
  >
    <div class="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative">
      <el-icon :size="64" color="white">
        <School />
      </el-icon>
      <div
        v-if="showFavorite"
        class="absolute top-3 right-3 cursor-pointer"
        @click="handleFavoriteClick"
      >
        <el-icon :size="24" :color="lab.isFavorite ? '#f56c6c' : 'white'">
          <Star :filled="lab.isFavorite" />
        </el-icon>
      </div>
    </div>
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 truncate flex-1 mr-2">{{ lab.name }}</h3>
        <el-tag size="small" :type="statusType">
          {{ statusText }}
        </el-tag>
      </div>
      <p class="text-sm text-gray-600 mb-3 truncate">{{ lab.department }}</p>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span class="flex items-center">
          <el-icon class="mr-1"><User /></el-icon>
          {{ lab.capacity }}人
        </span>
        <span class="flex items-center">
          <el-icon class="mr-1"><Star /></el-icon>
          {{ lab.rating?.toFixed(1) || '暂无' }}
        </span>
      </div>
    </div>
  </div>
</template>
