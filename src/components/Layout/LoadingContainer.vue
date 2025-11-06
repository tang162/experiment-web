<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  loading?: boolean;
  minHeight?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  minHeight: '400px',
  className: '',
});

const minHeightClass = computed(() => `min-h-[${props.minHeight}]`);
</script>

<template>
  <div 
    v-loading="loading" 
    :class="[minHeightClass, className]"
    class="w-full"
  >
    <slot />
  </div>
</template>