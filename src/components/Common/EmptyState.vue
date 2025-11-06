<script setup lang="ts">
import { ElIcon, ElButton } from "element-plus";

interface Props {
  description?: string;
  icon?: string;
  showAction?: boolean;
  actionText?: string;
}

withDefaults(defineProps<Props>(), {
  description: '暂无数据',
  showAction: false,
  actionText: '去添加',
});

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <ElIcon v-if="icon" :size="64" class="text-gray-400 mb-4">
      <component :is="icon" />
    </ElIcon>
    <p class="text-gray-500 mb-4">{{ description }}</p>
    <ElButton v-if="showAction" type="primary" @click="emit('action')">
      {{ actionText }}
    </ElButton>
  </div>
</template>
