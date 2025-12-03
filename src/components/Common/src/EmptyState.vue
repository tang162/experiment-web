<script setup>
import { ElIcon, ElButton } from "element-plus";
import { Star, Document, Box, FolderOpened } from "@element-plus/icons-vue";

const props = defineProps({
  description: { type: String, default: "暂无数据" },
  icon: { type: String, default: "" },
  showAction: { type: Boolean, default: false },
  actionText: { type: String, default: "去添加" },
});

const emit = defineEmits(["action"]);

// 图标映射
const iconMap = {
  Star,
  Document,
  Box,
  FolderOpened,
};

const iconComponent = props.icon ? iconMap[props.icon] : null;
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16">
    <ElIcon v-if="iconComponent" :size="80" class="text-gray-300 mb-4">
      <component :is="iconComponent" />
    </ElIcon>
    <p class="text-gray-500 text-base mb-6">{{ description }}</p>
    <ElButton v-if="showAction" type="primary" @click="emit('action')">
      {{ actionText }}
    </ElButton>
  </div>
</template>
