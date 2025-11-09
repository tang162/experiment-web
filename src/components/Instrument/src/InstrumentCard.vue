<script setup>
import { computed } from "vue";
import { Monitor, Location, Calendar } from "@element-plus/icons-vue";
import { ElIcon, ElTag } from "element-plus";
import { INSTRUMENT_STATUS_MAP } from "@/types";

const props = defineProps({
  instrument: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const statusInfo = computed(() => {
  return INSTRUMENT_STATUS_MAP[props.instrument.status || 0] || {
    label: "未知",
    color: "info",
  };
});

const handleClick = () => {
  emit("click", props.instrument);
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    @click="handleClick">
    <div class="h-48 bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center relative">
      <ElIcon :size="64" color="white">
        <Monitor />
      </ElIcon>
    </div>
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900 truncate flex-1 mr-2">{{ instrument.name }}</h3>
        <ElTag size="small" :type="statusInfo.color">
          {{ statusInfo.label }}
        </ElTag>
      </div>
      <p class="text-sm text-gray-600 mb-1 truncate">型号: {{ instrument.model }}</p>
      <p class="text-sm text-gray-500 mb-3 truncate">序列号: {{ instrument.serialNumber || "未设置" }}</p>
      <div class="space-y-1 text-sm text-gray-500">
        <div class="flex items-center">
          <ElIcon class="mr-1">
            <Location />
          </ElIcon>
          <span class="truncate">{{ instrument.lab.department }} - {{ instrument.lab.name }}</span>
        </div>
        <div class="flex items-center">
          <ElIcon class="mr-1">
            <Calendar />
          </ElIcon>
          <span>创建时间: {{ new Date(instrument.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
