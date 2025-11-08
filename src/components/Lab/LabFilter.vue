<script setup lang="ts">
import { computed } from 'vue';
import { ElInput, ElSelect, ElOption, ElButton } from "element-plus";
import type { LabApi } from '@/api';

interface Props {
  modelValue: Partial<LabApi.GetLabsParams>;
  departments?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  departments: () => ['计算机学院', '电子工程学院', '机械学院', '化学学院', '物理学院'],
});

const emit = defineEmits<{
  'update:modelValue': [value: Partial<LabApi.GetLabsParams>];
  filter: [];
  reset: [];
}>();

const localKeyword = computed({
  get: () => props.modelValue.keyword,
  set: (value) => emit('update:modelValue', { ...props.modelValue, keyword: value }),
});

const localDepartment = computed({
  get: () => props.modelValue.department,
  set: (value) => emit('update:modelValue', { ...props.modelValue, department: value }),
});



const localStatus = computed({
  get: () => props.modelValue.status,
  set: (value) => emit('update:modelValue', { ...props.modelValue, status: value }),
});

const handleFilter = () => {
  emit('filter');
};

const handleReset = () => {
  emit('update:modelValue', {
    keyword: '',
    department: '',
    status: undefined,
  });
  emit('reset');
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <ElInput v-model="localKeyword" placeholder="搜索实验室名称" clearable />

      <ElSelect v-model="localDepartment" placeholder="选择院系" clearable>
        <ElOption v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
      </ElSelect>

      <ElSelect v-model="localStatus" placeholder="状态" clearable>
        <ElOption label="正常" :value="0" />
        <ElOption label="维护中" :value="1" />
        <ElOption label="停用" :value="2" />
      </ElSelect>
    </div>

    <div class="flex items-center gap-4">
      <ElButton type="primary" @click="handleFilter">筛选</ElButton>
      <ElButton @click="handleReset">重置</ElButton>
    </div>
  </div>
</template>
