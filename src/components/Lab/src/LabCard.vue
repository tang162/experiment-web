<script setup>
import { computed } from "vue";
import { School, User, Star } from "@element-plus/icons-vue";
import { ElIcon, ElTag } from "element-plus";
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
});

const emit = defineEmits(["click", "toggleFavorite"]);

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
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    @click="handleClick"
  >
    <div class="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative">
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
      <p class="text-sm text-gray-600 mb-3 truncate">{{ lab.department }}</p>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span class="flex items-center">
          <ElIcon class="mr-1">
            <User />
          </ElIcon>
          {{ lab.capacity }}人
        </span>
        <span class="flex items-center">
          <ElIcon class="mr-1">
            <Star />
          </ElIcon>
          {{ lab.rating || "暂无" }}
        </span>
      </div>
    </div>
  </div>
</template>
