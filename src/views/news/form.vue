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
  ElTag,
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
  tags: [], // 标签数组
  cover: null, // 封面图
  images: [], // 图片组
});

const tagInput = ref(''); // 标签输入框

const formRef = ref();
const submitting = ref(false);
const coverFileList = ref([]); // 封面图文件列表
const imageFileList = ref([]); // 图片组文件列表

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
    newsForm.tags = result.tags || [];
    
    // 处理封面图（后端返回字段可能是 coverImage）
    if (result.coverImage || result.cover) {
      coverFileList.value = [{
        name: 'cover',
        url: result.coverImage || result.cover,
      }];
    }
    
    // 处理图片组
    if (result.images && result.images.length > 0) {
      imageFileList.value = result.images.map((url, index) => ({
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

// 封面图变化
const handleCoverChange = (file, files) => {
  coverFileList.value = files;
};

// 移除封面图
const handleCoverRemove = (file, files) => {
  coverFileList.value = files;
};

// 图片组变化
const handleImagesChange = (file, files) => {
  imageFileList.value = files;
};

// 移除图片组
const handleImagesRemove = (file, files) => {
  imageFileList.value = files;
};

// 添加标签
const handleAddTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !newsForm.tags.includes(tag)) {
    if (newsForm.tags.length >= 5) {
      ElMessage.warning('最多只能添加5个标签');
      return;
    }
    newsForm.tags.push(tag);
    tagInput.value = '';
  }
};

// 删除标签
const handleRemoveTag = (tag) => {
  const index = newsForm.tags.indexOf(tag);
  if (index > -1) {
    newsForm.tags.splice(index, 1);
  }
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value?.validate();

    submitting.value = true;

    const data = {
      title: newsForm.title,
      content: newsForm.content,
      tags: JSON.stringify( newsForm.tags || [])
    };

    // 添加封面图（字段名改为 coverImage 匹配后端）
    if (coverFileList.value.length > 0 && coverFileList.value[0].raw) {
      data.coverImage = coverFileList.value[0].raw;
    }

    // 添加图片组（支持多选）
    const images = imageFileList.value
      .filter(file => file.raw)
      .map(file => file.raw);
    if (images.length > 0) {
      data.images = images;
    }

    if (isEdit.value) {
      await updateNewsApi(newsId.value, data);
      ElMessage.success('更新成功');
    } else {
      await createNewsApi(data);
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

        <ElFormItem label="标签">
          <div class="w-full">
            <div class="flex gap-2 mb-2 flex-wrap">
              <ElTag
                v-for="tag in newsForm.tags"
                :key="tag"
                closable
                @close="handleRemoveTag(tag)"
              >
                {{ tag }}
              </ElTag>
            </div>
            <div class="flex gap-2">
              <ElInput
                v-model="tagInput"
                placeholder="输入标签后按回车添加（最多5个）"
                maxlength="20"
                @keyup.enter="handleAddTag"
              />
              <ElButton @click="handleAddTag">添加</ElButton>
            </div>
          </div>
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

        <ElFormItem label="封面图">
          <ElUpload
            v-model:file-list="coverFileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleCoverChange"
            :on-remove="handleCoverRemove"
            :limit="1"
          >
            <ElIcon><Plus /></ElIcon>
          </ElUpload>
          <div class="text-sm text-gray-500 mt-2">
            上传封面图，不超过5MB
          </div>
        </ElFormItem>

        <ElFormItem label="图片组">
          <ElUpload
            v-model:file-list="imageFileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleImagesChange"
            :on-remove="handleImagesRemove"
            :limit="9"
            multiple
          >
            <ElIcon><Plus /></ElIcon>
          </ElUpload>
          <div class="text-sm text-gray-500 mt-2">
            支持多选，最多上传9张图片，每张不超过5MB
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
