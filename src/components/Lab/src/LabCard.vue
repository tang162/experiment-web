<script setup>
import { computed } from "vue";
import { School, User, Star, Edit } from "@element-plus/icons-vue";
import { ElIcon, ElTag, ElImage, ElButton } from "element-plus";
import { LabStatus } from "@/types";

const props = defineProps({
  lab: {
    type: Object,
    required: true,
  },
  showFavorite: {
    type: Boolean,
    default: true,
  },
  favoriteLoading: {
    type: Boolean,
    default: false,
  },
  // 是否显示编辑按钮
  showEdit: {
    type: Boolean,
    default: false,
  },
  // 是否显示标签
  showTags: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click", "toggleFavorite", "edit"]);

const statusType = computed(() => {
  switch (props.lab.status) {
    case LabStatus.AVAILABLE:
      return "success";
    case LabStatus.MAINTENANCE:
      return "warning";
    case LabStatus.DISABLED:
      return "info";
    default:
      return "info";
  }
});

const statusText = computed(() => {
  switch (props.lab.status) {
    case LabStatus.AVAILABLE:
      return "可用";
    case LabStatus.MAINTENANCE:
      return "占用";
    case LabStatus.DISABLED:
      return "维护中";
    default:
      return "未知";
  }
});

// 获取第一张图片
const coverImage = computed(() => {
  const images = props.lab.images;
  return images && images.length > 0 ? images[0] : null;
});

const handleClick = () => {
  emit("click", props.lab);
};

const handleFavoriteClick = (event) => {
  event.stopPropagation();
  // Prevent action if loading
  if (props.favoriteLoading) {
    return;
  }
  emit("toggleFavorite", props.lab);
};

const handleEditClick = (event) => {
  event.stopPropagation();
  emit("edit", props.lab);
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    @click="handleClick"
  >
    <!-- 有图片时显示图片 -->
    <div v-if="coverImage" class="h-48 relative">
      <ElImage :src="coverImage" fit="cover" class="w-full h-full" />
      <div 
        v-if="showFavorite" 
        class="absolute top-3 right-3 cursor-pointer transition-opacity" 
        :class="{ 'opacity-50 cursor-not-allowed': favoriteLoading }"
        @click="handleFavoriteClick"
      >
        <ElIcon :size="24" :color="lab.isFavorite ? '#f56c6c' : 'white'">
          <Star :filled="lab.isFavorite" />
        </ElIcon>
      </div>
    </div>
    <!-- 无图片时显示默认背景 -->
    <div v-else class="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative">
      <ElIcon :size="64" color="white">
        <School />
      </ElIcon>
      <div 
        v-if="showFavorite" 
        class="absolute top-3 right-3 cursor-pointer transition-opacity" 
        :class="{ 'opacity-50 cursor-not-allowed': favoriteLoading }"
        @click="handleFavoriteClick"
      >
        <ElIcon :size="24" :color="lab.isFavorite ? '#f56c6c' : 'white'">
          <Star :filled="lab.isFavorite" />
        </ElIcon>
      </div>
    </div>
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 truncate flex-1 mr-2">{{ lab.name }}</h3>
        <ElTag size="small" :type="statusType">
          {{ statusText }}
        </ElTag>
      </div>
      <p class="text-sm text-gray-600 mb-2 truncate">{{ lab.department }}</p>
      <p v-if="lab.location" class="text-sm text-gray-500 mb-2 truncate">{{ lab.location }}</p>
      
      <!-- 标签 -->
      <div v-if="showTags && lab.tags && lab.tags.length > 0" class="mb-3 flex flex-wrap gap-1">
        <ElTag v-for="tag in lab.tags.slice(0, 3)" :key="tag" size="small" type="info">
          {{ tag }}
        </ElTag>
        <ElTag v-if="lab.tags.length > 3" size="small" type="info">
          +{{ lab.tags.length - 3 }}
        </ElTag>
      </div>
      
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span class="flex items-center">
          <ElIcon class="mr-1">
            <User />
          </ElIcon>
          {{ lab.capacity }}人
        </span>
        <span v-if="!showEdit" class="flex items-center">
          <ElIcon class="mr-1">
            <Star />
          </ElIcon>
          {{ lab.rating || "暂无" }}
        </span>
        <!-- 编辑按钮 -->
        <ElButton v-if="showEdit" type="primary" size="small" @click="handleEditClick">
          <ElIcon class="mr-1"><Edit /></ElIcon>
          编辑
        </ElButton>
      </div>
    </div>
  </div>
</template>
