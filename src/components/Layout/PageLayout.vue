<script setup>
import { computed } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { ElButton, ElIcon } from 'element-plus';
import { PageHeader } from '@/components';



const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  showBack: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  containerClass: { type: String, default: "" },
  contentClass: { type: String, default: "" },
  maxWidth: { type: String, default: "full" },
});




const emit = defineEmits({
  back: () => { }
});

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