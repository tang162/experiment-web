<script setup>
import { ref, watch } from "vue";
import { ElButton, ElIcon, ElInput } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请输入搜索关键词",
  },
  size: {
    type: String,
    default: "large",
  },
});

const emit = defineEmits([
  "update:modelValue",
  "search",
]);

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

const handleInput = (value) => {
  emit("update:modelValue", value);
};

const handleSearch = () => {
  emit("search", localValue.value);
};

const handleKeyup = (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
};
</script>

<template>
  <ElInput
    v-model="localValue"
    :size="size"
    :placeholder="placeholder"
    clearable
    @input="handleInput"
    @keyup="handleKeyup"
  >
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
