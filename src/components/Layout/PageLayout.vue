<script setup lang="ts">
import { computed } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';
import { PageHeader } from '@/components';

interface Props {
  title: string;
  description?: string;
  showBack?: boolean;
  loading?: boolean;
  containerClass?: string;
  contentClass?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const props = withDefaults(defineProps<Props>(), {
  showBack: false,
  loading: false,
  containerClass: '',
  contentClass: '',
  maxWidth: 'full',
});

const emit = defineEmits<{
  back: [];
}>();

const maxWidthClass = computed(() => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };
  return maxWidths[props.maxWidth];
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div :class="[maxWidthClass, 'mx-auto']">
        <PageHeader :title="title" :description="description" :show-back="showBack" @back="emit('back')" />

        <div v-loading="loading" :class="contentClass">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>