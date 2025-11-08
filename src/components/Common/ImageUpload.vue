<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage, ElUpload, ElIcon } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxCount: {
    type: Number,
    default: 3,
  },
  limit: {
    type: Number,
    default: 3,
  },
  maxSize: {
    type: Number,
    default: 5,
  },
  accept: {
    type: String,
    default: "image/*",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "change",
  "upload",
]);

const fileList = ref([]);

watch(
  () => props.modelValue,
  (value) => {
    if (!Array.isArray(value)) {
      fileList.value = [];
      return;
    }
    fileList.value = value.map((url, index) => ({
      name: `${index}`,
      url,
    }));
  },
  { immediate: true }
);

const isLimitExceeded = computed(() => {
  const limit = props.limit ?? props.maxCount;
  return fileList.value.length >= limit;
});

const handleExceed = () => {
  const limit = props.limit ?? props.maxCount;
  ElMessage.warning(`最多只能上传${limit}张图片`);
};

const handleBeforeUpload = (file) => {
  const isImage = file.type ? file.type.startsWith("image/") : false;
  const isLtSize = file.size ? file.size / 1024 / 1024 < props.maxSize : false;

  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    return false;
  }
  if (!isLtSize) {
    ElMessage.error(`图片大小不能超过${props.maxSize}MB`);
    return false;
  }

  emit("upload", file);
  return false;
};

const handleRemove = (file, uploadFiles = []) => {
  const urls = uploadFiles
    .map((item) => item.url)
    .filter((url) => Boolean(url));

  emit("update:modelValue", urls);
  emit("change", urls);
};

const handlePreview = (uploadFile) => {
  console.log(uploadFile);
};
</script>

<template>
  <ElUpload
    v-model:file-list="fileList"
    action="#"
    list-type="picture-card"
    :accept="accept"
    :limit="limit || maxCount"
    :multiple="multiple"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
  >
    <ElIcon v-if="!isLimitExceeded">
      <Plus />
    </ElIcon>
  </ElUpload>
</template>
