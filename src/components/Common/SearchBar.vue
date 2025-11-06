<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElButton, ElIcon, ElInput } from 'element-plus';
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
  <ElInput v-model="localValue" :size="size" :placeholder="placeholder" clearable @input="handleInput"
    @keyup="handleKeyup">
    <template #prefix>
      <ElIcon>
        <Search />
      </ElIcon>
    </template>
    <template #append>
      <ElButton type="primary" @click="handleSearch">搜索</ElButton>
    </template>
  </ElInput>
</template>
