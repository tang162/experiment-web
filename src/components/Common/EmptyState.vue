<script setup lang="ts">
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
    <el-icon v-if="icon" :size="64" class="text-gray-400 mb-4">
      <component :is="icon" />
    </el-icon>
    <p class="text-gray-500 mb-4">{{ description }}</p>
    <el-button v-if="showAction" type="primary" @click="emit('action')">
      {{ actionText }}
    </el-button>
  </div>
</template>
