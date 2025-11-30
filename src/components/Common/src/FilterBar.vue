<script setup>
import { ref, computed } from 'vue';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElRow, ElCol, ElIcon } from 'element-plus';
import { Delete, Search } from '@element-plus/icons-vue';

const props = defineProps({
  // 筛选条件对象
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  // 筛选选项配置
  filterOptions: {
    type: Array,
    default: () => [],
    // 每个选项应包含: key, label, type, options, placeholder 等
  },
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: true,
  },
  // 搜索框占位符
  searchPlaceholder: {
    type: String,
    default: '搜索...',
  },
  // 搜索字段名
  searchField: {
    type: String,
    default: 'keyword',
  },
  // 是否显示重置按钮
  showReset: {
    type: Boolean,
    default: true,
  },
  // 是否显示搜索按钮
  showSearch: {
    type: Boolean,
    default: true,
  },
  // 按钮大小
  buttonSize: {
    type: String,
    default: 'default',
  },
});

const emit = defineEmits(['update:modelValue', 'filter', 'reset', 'search']);

// 本地筛选条件副本
const filters = ref({ ...props.modelValue });

// 监听 modelValue 变化
const updateFilters = (newValue) => {
  filters.value = { ...newValue };
};

// 处理筛选条件变化
const handleFilterChange = (key, value) => {
  filters.value[key] = value;
  emit('update:modelValue', filters.value);
};

// 处理搜索
const handleSearch = () => {
  emit('filter', filters.value);
  emit('search', filters.value[props.searchField]);
};

// 处理重置
const handleReset = () => {
  filters.value = {};
  emit('update:modelValue', {});
  emit('reset');
};

// 处理回车搜索
const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};

// 获取筛选选项的显示值
const getFilterLabel = (option) => {
  return option.label || option.key;
};

// 获取筛选选项的类型
const getFilterType = (option) => {
  return option.type || 'input';
};
</script>

<template>
  <div class="filter-bar-wrapper">
    <ElForm :model="filters" layout="inline" class="filter-form">
      <ElRow :gutter="16" class="w-full">
        <!-- 搜索框 -->
        <ElCol v-if="showSearch" :xs="24" :sm="12" :md="8" :lg="6" class="mb-4">
          <ElFormItem class="w-full">
            <ElInput
              v-model="filters[searchField]"
              :placeholder="searchPlaceholder"
              clearable
              @keydown="handleKeydown"
            >
              <template #prefix>
                <ElIcon>
                  <Search />
                </ElIcon>
              </template>
            </ElInput>
          </ElFormItem>
        </ElCol>

        <!-- 筛选条件 -->
        <ElCol
          v-for="option in filterOptions"
          :key="option.key"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="mb-4"
        >
          <ElFormItem :label="getFilterLabel(option)" class="w-full">
            <!-- 输入框 -->
            <ElInput
              v-if="getFilterType(option) === 'input'"
              v-model="filters[option.key]"
              :placeholder="option.placeholder || `请输入${option.label}`"
              clearable
              @keydown="handleKeydown"
            />

            <!-- 选择框 -->
            <ElSelect
              v-else-if="getFilterType(option) === 'select'"
              v-model="filters[option.key]"
              :placeholder="option.placeholder || `请选择${option.label}`"
              clearable
              class="w-full"
            >
              <ElOption
                v-for="item in option.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>

            <!-- 日期选择器 -->
            <ElInput
              v-else-if="getFilterType(option) === 'date'"
              v-model="filters[option.key]"
              type="date"
              :placeholder="option.placeholder || `请选择${option.label}`"
              clearable
            />

            <!-- 日期范围选择器 -->
            <ElInput
              v-else-if="getFilterType(option) === 'daterange'"
              v-model="filters[option.key]"
              type="daterange"
              :placeholder="option.placeholder || `请选择${option.label}`"
              clearable
            />

            <!-- 自定义插槽 -->
            <slot v-else :name="`filter-${option.key}`" :option="option" :value="filters[option.key]" />
          </ElFormItem>
        </ElCol>

        <!-- 操作按钮 -->
        <ElCol :xs="24" :sm="24" :md="24" :lg="24" class="mb-4">
          <div class="flex gap-2 justify-end">
            <ElButton
              v-if="showSearch"
              type="primary"
              :size="buttonSize"
              @click="handleSearch"
            >
              搜索
            </ElButton>
            <ElButton
              v-if="showReset"
              :size="buttonSize"
              @click="handleReset"
            >
              <ElIcon class="mr-1">
                <Delete />
              </ElIcon>
              重置
            </ElButton>
          </div>
        </ElCol>
      </ElRow>

      <!-- 自定义筛选条件插槽 -->
      <slot name="custom-filter" :filters="filters" />
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
.filter-bar-wrapper {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  .filter-form {
    width: 100%;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
}
</style>
