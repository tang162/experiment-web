<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { ElSelect, ElOption, ElButton } from "element-plus";
import { getLabsOptionsApi } from "@/api";

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

const emit = defineEmits(["update:modelValue", "filter", "reset"]);

// 实验室下拉选项
const labOptions = ref([]);
const labLoading = ref(false);

// 获取实验室下拉选项
const fetchLabOptions = async (keyword = "") => {
  labLoading.value = true;
  try {
    const res = await getLabsOptionsApi({ keyword, pageSize: 50 });
    labOptions.value = res.list || [];
  } catch (error) {
    console.error("获取实验室列表失败:", error);
    labOptions.value = [];
  } finally {
    labLoading.value = false;
  }
};

// 实验室远程搜索
const handleLabSearch = (keyword) => {
  fetchLabOptions(keyword);
};

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

onMounted(() => {
  if (props.showLabFilter) {
    fetchLabOptions();
  }
});

// 监听 showLabFilter 变化
watch(
  () => props.showLabFilter,
  (val) => {
    if (val && labOptions.value.length === 0) {
      fetchLabOptions();
    }
  }
);
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
      <ElSelect
        v-if="showLabFilter"
        v-model="localLabId"
        placeholder="选择实验室"
        clearable
        filterable
        remote
        :remote-method="handleLabSearch"
        :loading="labLoading"
      >
        <ElOption
          v-for="lab in labOptions"
          :key="lab.id"
          :label="lab.name"
          :value="lab.id"
        />
      </ElSelect>

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
