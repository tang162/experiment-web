<script setup>
import { ElInput, ElSelect, ElOption, ElButton } from "element-plus";

const props = defineProps({
  departments: {
    type: Array,
    default: () => ['计算机学院', '电子工程学院', '机械学院', '化学学院', '物理学院'],
  },
});

const emit = defineEmits(['filter', 'reset']);

const model = defineModel({
  type: Object,
  default: () => ({
    keyword: '',
    department: '',
    status: undefined,
  }),
});

const handleFilter = () => {
  emit('filter');
};

const handleReset = () => {
  model.value = {
    keyword: '',
    department: '',
    status: undefined,
  };
  emit('reset');
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <ElInput v-model="model.keyword" placeholder="搜索实验室名称" clearable />

      <ElSelect v-model="model.department" placeholder="选择院系" clearable>
        <ElOption v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
      </ElSelect>

      <ElSelect v-model="model.status" placeholder="状态" clearable>
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