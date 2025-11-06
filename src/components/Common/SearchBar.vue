<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  size?: 'small' | 'default' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索关键词',
  size: 'large',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [keyword: string];
}>();

const localValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

const handleInput = (value: string) => {
  emit('update:modelValue', value);
};

const handleSearch = () => {
  emit('search', localValue.value);
};

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};
</script>

<template>
  <el-input
    v-model="localValue"
    :size="size"
    :placeholder="placeholder"
    clearable
    @input="handleInput"
    @keyup="handleKeyup"
  >
    <template #prefix>
      <el-icon><Search /></el-icon>
    </template>
    <template #append>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </template>
  </el-input>
</template>
