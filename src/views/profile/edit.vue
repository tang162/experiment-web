<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElIcon,
  ElUpload,
  ElAvatar,
} from 'element-plus';
import { ArrowLeft, Plus } from '@element-plus/icons-vue';
import { updateProfileApi } from '@/api';
import { PageLayout } from '@/components';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

const profileForm = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  avatar: '',
});

const formRef = ref();
const submitting = ref(false);
const avatarFile = ref(null);

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
};

// 加载用户信息
const loadUserInfo = () => {
  const userInfo = authStore.getUserInfo;
  if (userInfo) {
    profileForm.username = userInfo.username || '';
    profileForm.nickname = userInfo.nickname || '';
    profileForm.email = userInfo.email || '';
    profileForm.phone = userInfo.phone || '';
    profileForm.avatar = userInfo.avatar || '';
  }
};

// 头像上传前的处理
const beforeAvatarUpload = (file) => {
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

  avatarFile.value = file;
  // 预览图片
  const reader = new FileReader();
  reader.onload = (e) => {
    profileForm.avatar = e.target.result;
  };
  reader.readAsDataURL(file);

  return false; // 阻止自动上传
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value?.validate();

    submitting.value = true;

    // 构建上传数据
    const uploadData = {
      nickname: profileForm.nickname,
      email: profileForm.email,
      phone: profileForm.phone,
    };

    // 如果有新的头像文件，添加到上传数据
    if (avatarFile.value) {
      uploadData.avatar = avatarFile.value;
    }

    await updateProfileApi(uploadData);

    // 更新本地用户信息
    await authStore.fetchUserInfo();

    ElMessage.success('保存成功');
    router.push('/profile');
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
  loadUserInfo();
});
</script>

<template>
  <PageLayout title="编辑个人信息" description="更新您的个人资料">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <!-- 表单 -->
      <ElForm ref="formRef" :model="profileForm" :rules="rules" label-width="120px">
        <ElFormItem label="头像">
          <div class="flex items-center gap-4">
            <ElAvatar :size="80" :src="profileForm.avatar" />
            <ElUpload action="#" :show-file-list="false" :before-upload="beforeAvatarUpload">
              <ElButton :icon="Plus">上传头像</ElButton>
            </ElUpload>
          </div>
          <div class="text-sm text-gray-500 mt-2">
            支持 JPG、PNG 格式，文件大小不超过 5MB
          </div>
        </ElFormItem>

        <ElFormItem label="用户名" prop="username">
          <ElInput v-model="profileForm.username" placeholder="请输入用户名" disabled />
          <div class="text-sm text-gray-500 mt-1">用户名不可修改</div>
        </ElFormItem>

        <ElFormItem label="昵称" prop="nickname">
          <ElInput v-model="profileForm.nickname" placeholder="请输入昵称" maxlength="20" />
        </ElFormItem>

        <ElFormItem label="邮箱" prop="email">
          <ElInput v-model="profileForm.email" placeholder="请输入邮箱地址" />
        </ElFormItem>

        <ElFormItem label="手机号" prop="phone">
          <ElInput v-model="profileForm.phone" placeholder="请输入手机号" maxlength="11" />
        </ElFormItem>

        <ElFormItem>
          <div class="flex gap-4">
            <ElButton type="primary" :loading="submitting" @click="submitForm">
              保存
            </ElButton>
            <ElButton @click="goBack">取消</ElButton>
          </div>
        </ElFormItem>
      </ElForm>
    </div>
  </PageLayout>
</template>
