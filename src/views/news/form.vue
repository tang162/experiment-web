<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElIcon,
  ElUpload,
} from 'element-plus';
import { ArrowLeft, Plus } from '@element-plus/icons-vue';
import { createNewsApi, updateNewsApi, getNewsDetailApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';

const router = useRouter();
const route = useRoute();

const newsForm = reactive({
  title: '',
  content: '',
  category: '',
  images: [],
});

const formRef = ref();
const submitting = ref(false);
const fileList = ref([]);

const { loading, execute: fetchDetail } = useApi();

const newsId = computed(() => route.params.id ? Number(route.params.id) : null);
const isEdit = computed(() => !!newsId.value);

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' },
    { min: 20, message: '内容至少 20 个字符', trigger: 'blur' },
  ],
};

// 加载新闻详情（编辑模式）
const loadDetail = async () => {
  if (!isEdit.value) return;

  const result = await fetchDetail(() => getNewsDetailApi(newsId.value));
  if (result) {
    newsForm.title = result.title;
    newsForm.content = result.content;
    newsForm.category = result.category || '';
    
    // 处理已有图片
    if (result.images && result.images.length > 0) {
      fileList.value = result.images.map((url, index) => ({
        name: `image-${index}`,
        url,
      }));
    }
  }
};

// 文件上传前的处理
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  return true;
};

// 文件列表变化
const handleFileChange = (file, files) => {
  fileList.value = files;
};

// 移除文件
const handleRemove = (file, files) => {
  fileList.value = files;
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value?.validate();

    submitting.value = true;

    const formData = new FormData();
    formData.append('title', newsForm.title);
    formData.append('content', newsForm.content);
    if (newsForm.category) {
      formData.append('category', newsForm.category);
    }

    // 添加新上传的图片
    fileList.value.forEach((file) => {
      if (file.raw) {
        formData.append('images', file.raw);
      }
    });

    if (isEdit.value) {
      await updateNewsApi(newsId.value, formData);
      ElMessage.success('更新成功');
    } else {
      await createNewsApi(formData);
      ElMessage.success('发布成功');
    }

    router.push('/news');
  } catch (error) {
    if (error?.message) {
      ElMessage.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
};

// 返回
const goBack = () => {
  router.back();
};

onMounted(() => {
  if (isEdit.value) {
    loadDetail();
  }
});
</script>

<template>
  <PageLayout :title="isEdit ? '编辑新闻' : '发布新闻'" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <!-- 表单 -->
      <ElForm ref="formRef" :model="newsForm" :rules="rules" label-width="100px">
        <ElFormItem label="新闻标题" prop="title">
          <ElInput
            v-model="newsForm.title"
            placeholder="请输入新闻标题（5-100个字符）"
            maxlength="100"
            show-word-limit
          />
        </ElFormItem>

        <ElFormItem label="分类" prop="category">
          <ElInput
            v-model="newsForm.category"
            placeholder="请输入新闻分类（选填）"
            maxlength="20"
          />
        </ElFormItem>

        <ElFormItem label="新闻内容" prop="content">
          <ElInput
            v-model="newsForm.content"
            type="textarea"
            :rows="12"
            placeholder="请输入新闻内容（至少20个字符）"
            maxlength="5000"
            show-word-limit
          />
        </ElFormItem>

        <ElFormItem label="图片">
          <ElUpload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :limit="5"
          >
            <ElIcon><Plus /></ElIcon>
          </ElUpload>
          <div class="text-sm text-gray-500 mt-2">
            支持上传最多5张图片，每张不超过5MB
          </div>
        </ElFormItem>

        <ElFormItem>
          <div class="flex gap-4">
            <ElButton type="primary" :loading="submitting" @click="submitForm">
              {{ isEdit ? '更新' : '发布' }}
            </ElButton>
            <ElButton @click="goBack">取消</ElButton>
          </div>
        </ElFormItem>
      </ElForm>
    </div>
  </PageLayout>
</template>
