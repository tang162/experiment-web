<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  showBack: false,
});

const emit = defineEmits<{
  back: [];
}>();
</script>

<template>
  <div class="mb-6">
    <div v-if="showBack" class="mb-4">
      <el-button text @click="emit('back')">
        <el-icon class="mr-1"><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
    <p v-if="description" class="text-gray-600">{{ description }}</p>
  </div>
</template>
