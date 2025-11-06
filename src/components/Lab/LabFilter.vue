<script setup lang="ts">
import { computed } from 'vue';
import { ElInput, ElSelect, ElOption, ElInputNumber, ElButton } from "element-plus";
import type { LabFilter } from '@/types';
import { LabStatus as LabStatusEnum } from '@/types';

interface Props {
  modelValue: LabFilter;
  departments?: string[];
  equipmentTypes?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  departments: () => ['计算机学院', '电子工程学院', '机械学院', '化学学院', '物理学院'],
  equipmentTypes: () => ['计算机', '示波器', '显微镜', '3D打印机', '激光设备'],
});

const emit = defineEmits<{
  'update:modelValue': [value: LabFilter];
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

const localEquipmentType = computed({
  get: () => props.modelValue.equipmentType,
  set: (value) => emit('update:modelValue', { ...props.modelValue, equipmentType: value }),
});

const localStatus = computed({
  get: () => props.modelValue.status,
  set: (value) => emit('update:modelValue', { ...props.modelValue, status: value }),
});

const localMinCapacity = computed({
  get: () => props.modelValue.minCapacity,
  set: (value) => emit('update:modelValue', { ...props.modelValue, minCapacity: value }),
});

const localMaxCapacity = computed({
  get: () => props.modelValue.maxCapacity,
  set: (value) => emit('update:modelValue', { ...props.modelValue, maxCapacity: value }),
});

const handleFilter = () => {
  emit('filter');
};

const handleReset = () => {
  emit('update:modelValue', {
    keyword: '',
    department: '',
    equipmentType: '',
    status: undefined,
    minCapacity: undefined,
    maxCapacity: undefined,
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

      <ElSelect v-model="localEquipmentType" placeholder="设备类型" clearable>
        <ElOption v-for="type in equipmentTypes" :key="type" :label="type" :value="type" />
      </ElSelect>

      <ElSelect v-model="localStatus" placeholder="状态" clearable>
        <ElOption label="可用" :value="LabStatusEnum.AVAILABLE" />
        <ElOption label="已占用" :value="LabStatusEnum.OCCUPIED" />
        <ElOption label="维护中" :value="LabStatusEnum.MAINTENANCE" />
      </ElSelect>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">容量范围：</span>
        <ElInputNumber v-model="localMinCapacity" :min="0" :max="1000" placeholder="最小" controls-position="right"
          style="width: 120px" />
        <span class="text-gray-400">-</span>
        <ElInputNumber v-model="localMaxCapacity" :min="0" :max="1000" placeholder="最大" controls-position="right"
          style="width: 120px" />
      </div>

      <ElButton type="primary" @click="handleFilter">筛选</ElButton>
      <ElButton @click="handleReset">重置</ElButton>
    </div>
  </div>
</template>
