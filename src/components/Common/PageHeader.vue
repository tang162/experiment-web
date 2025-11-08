<script setup>
import { ArrowLeft } from "@element-plus/icons-vue";
import { ElButton, ElIcon } from "element-plus";

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  showBack: { type: Boolean, default: false },
});

const emit = defineEmits(["back"]);
</script>

<template>
  <div class="mb-6">
    <div v-if="showBack" class="mb-4">
      <ElButton text @click="emit('back')">
        <ElIcon class="mr-1">
          <ArrowLeft />
        </ElIcon>
        返回
      </ElButton>
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
    <p v-if="description" class="text-gray-600">{{ description }}</p>
  </div>
</template>
