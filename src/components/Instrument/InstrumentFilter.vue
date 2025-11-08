<script setup>
import { computed } from "vue";
import { ElInput, ElSelect, ElOption, ElButton } from "element-plus";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  showLabFilter: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "filter",
  "reset",
]);

const localLabId = computed({
  get: () => props.modelValue.labId,
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, labId: value });
  },
});

const localStatus = computed({
  get: () => props.modelValue.status,
  set: (value) => {
    emit("update:modelValue", { ...props.modelValue, status: value });
  },
});

const handleFilter = () => {
  emit("filter");
};

const handleReset = () => {
  emit("update:modelValue", {
    labId: undefined,
    status: undefined,
  });
  emit("reset");
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
      <ElInput
        v-if="showLabFilter"
        v-model.number="localLabId"
        placeholder="搜索实验室ID"
        type="number"
        clearable
      />

      <ElSelect v-model="localStatus" placeholder="设备状态" clearable>
        <ElOption label="正常" :value="0" />
        <ElOption label="停用" :value="1" />
        <ElOption label="维护中" :value="2" />
        <ElOption label="故障" :value="3" />
        <ElOption label="借出" :value="4" />
      </ElSelect>
    </div>

    <div class="flex items-center gap-4">
      <ElButton type="primary" @click="handleFilter">筛选</ElButton>
      <ElButton @click="handleReset">重置</ElButton>
    </div>
  </div>
</template>
