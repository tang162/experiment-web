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
  "remove",
]);

const fileList = ref([]);
// 存储待上传的文件（本地选择的）
const pendingFiles = ref([]);

// 只在初始化时处理外部传入的已有图片URL
watch(
  () => props.modelValue,
  (value, oldValue) => {
    if (!Array.isArray(value)) {
      // 保留本地文件
      fileList.value = fileList.value.filter(item => item.raw);
      return;
    }
    
    // 只处理http开头的URL（已上传的图片）
    const httpUrls = value.filter(url => typeof url === 'string' && url.startsWith('http'));
    const oldHttpUrls = (oldValue || []).filter(url => typeof url === 'string' && url.startsWith('http'));
    
    // 如果http URL没有变化，不更新（避免覆盖本地文件）
    if (JSON.stringify(httpUrls) === JSON.stringify(oldHttpUrls) && fileList.value.length > 0) {
      return;
    }
    
    // 保留本地预览的文件
    const localFiles = fileList.value.filter(item => item.raw);
    
    // 合并：已有的http图片 + 本地预览的文件
    fileList.value = [
      ...httpUrls.map((url, index) => ({
        name: `image_${index}`,
        url,
        status: 'success',
      })),
      ...localFiles,
    ];
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

// 处理文件变化（选择文件时）
const handleChange = (uploadFile, uploadFiles) => {
  const file = uploadFile.raw;
  
  if (!file) return;
  
  const isImage = file.type ? file.type.startsWith("image/") : false;
  const isLtSize = file.size ? file.size / 1024 / 1024 < props.maxSize : false;

  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    // 移除不合法的文件
    const index = uploadFiles.indexOf(uploadFile);
    if (index > -1) {
      uploadFiles.splice(index, 1);
    }
    return;
  }
  if (!isLtSize) {
    ElMessage.error(`图片大小不能超过${props.maxSize}MB`);
    const index = uploadFiles.indexOf(uploadFile);
    if (index > -1) {
      uploadFiles.splice(index, 1);
    }
    return;
  }

  // 更新fileList
  fileList.value = uploadFiles;
  
  // 添加到待上传文件列表（如果还没添加）
  if (!pendingFiles.value.includes(file)) {
    pendingFiles.value.push(file);
  }
  
  // 触发upload事件，传递文件对象
  emit("upload", file);
};

const handleRemove = (file, uploadFiles = []) => {
  // 如果是本地文件，从pendingFiles中移除
  if (file.raw) {
    const index = pendingFiles.value.indexOf(file.raw);
    if (index > -1) {
      pendingFiles.value.splice(index, 1);
    }
    // 触发remove事件
    emit("remove", file.raw);
  }
  
  // 更新fileList
  fileList.value = uploadFiles;
  
  // 获取剩余的http URL（已上传的图片）
  const remainingUrls = uploadFiles
    .filter(item => !item.raw && item.url && item.url.startsWith('http'))
    .map(item => item.url);

  emit("update:modelValue", remainingUrls);
  emit("change", remainingUrls, file);
};

const handlePreview = (uploadFile) => {
  if (uploadFile.url) {
    window.open(uploadFile.url);
  }
};

// 暴露方法给父组件获取待上传的文件
defineExpose({
  getPendingFiles: () => pendingFiles.value,
  clearPendingFiles: () => {
    pendingFiles.value = [];
  },
});
</script>

<template>
  <ElUpload
    :file-list="fileList"
    action="#"
    list-type="picture-card"
    :accept="accept"
    :limit="limit || maxCount"
    :multiple="multiple"
    :auto-upload="false"
    :on-exceed="handleExceed"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
  >
    <ElIcon v-if="!isLimitExceeded">
      <Plus />
    </ElIcon>
  </ElUpload>
</template>
