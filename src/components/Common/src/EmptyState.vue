<script setup>
import { ElIcon, ElButton } from "element-plus";

defineProps({
  description: { type: String, default: "暂无数据" },
  icon: { type: String, default: "" },
  showAction: { type: Boolean, default: false },
  actionText: { type: String, default: "去添加" },
});

const emit = defineEmits(["action"]);
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
