<script setup>
import { computed } from 'vue';

const props = defineProps(
  {
    loading: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: "400px"
    },
    className: {
      type: String,
      default: "className"

    }
  }
)

const minHeightClass = computed(() => `min-h-[${props.minHeight}]`);
</script>

<template>
  <div v-loading="loading" :class="[minHeightClass, className]" class="w-full">
    <slot />
  </div>
</template>