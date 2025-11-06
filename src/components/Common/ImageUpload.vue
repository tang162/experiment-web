<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps, UploadUserFile } from 'element-plus';

interface Props {
  modelValue: string[];
  maxCount?: number;
  maxSize?: number;
  accept?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: 3,
  maxSize: 5,
  accept: 'image/*',
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  upload: [file: File];
}>();

const fileList = ref<UploadUserFile[]>([]);

const isLimitExceeded = computed(() => {
  return fileList.value.length >= props.maxCount;
});

const handleExceed: UploadProps['onExceed'] = (files) => {
  ElMessage.warning(`最多只能上传${props.maxCount}张图片`);
};

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLtSize = file.size / 1024 / 1024 < props.maxSize;

  if (!isImage) {
    ElMessage.error('只能上传图片文件');
    return false;
  }
  if (!isLtSize) {
    ElMessage.error(`图片大小不能超过${props.maxSize}MB`);
    return false;
  }
  
  emit('upload', file);
  return false;
};

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  const urls = uploadFiles.map(f => f.url).filter(Boolean) as string[];
  emit('update:modelValue', urls);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile);
};
</script>

<template>
  <el-upload
    v-model:file-list="fileList"
    action="#"
    list-type="picture-card"
    :accept="accept"
    :limit="maxCount"
    :on-exceed="handleExceed"
    :before-upload="handleBeforeUpload"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
  >
    <el-icon v-if="!isLimitExceeded"><Plus /></el-icon>
  </el-upload>
</template>
