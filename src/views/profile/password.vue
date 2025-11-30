<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElIcon,
} from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { changePasswordApi } from '@/api';
import { PageLayout } from '@/components';

const router = useRouter();

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const formRef = ref();
const submitting = ref(false);

// 确认密码验证
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'));
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

// 表单验证规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
};

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value?.validate();

    submitting.value = true;

    await changePasswordApi({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });

    ElMessage.success('密码修改成功，请重新登录');
    
    // 延迟跳转到登录页
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    if (error?.message) {
      ElMessage.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

// 返回
const goBack = () => {
  router.back();
};
</script>

<template>
  <PageLayout title="修改密码" description="为了您的账户安全，请定期修改密码">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <!-- 表单 -->
      <ElForm ref="formRef" :model="passwordForm" :rules="rules" label-width="120px">
        <ElFormItem label="当前密码" prop="oldPassword">
          <ElInput
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </ElFormItem>

        <ElFormItem label="新密码" prop="newPassword">
          <ElInput
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（6-20个字符）"
            show-password
          />
        </ElFormItem>

        <ElFormItem label="确认新密码" prop="confirmPassword">
          <ElInput
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </ElFormItem>

        <ElFormItem>
          <div class="flex gap-4">
            <ElButton type="primary" :loading="submitting" @click="submitForm">
              确认修改
            </ElButton>
            <ElButton @click="resetForm">重置</ElButton>
          </div>
        </ElFormItem>
      </ElForm>

      <!-- 提示信息 -->
      <div class="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 class="text-sm font-semibold text-yellow-900 mb-2">密码安全提示</h4>
        <ul class="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>密码长度应在 6-20 个字符之间</li>
          <li>建议使用字母、数字和特殊字符的组合</li>
          <li>不要使用过于简单或容易被猜到的密码</li>
          <li>定期更换密码以保护账户安全</li>
          <li>修改密码后需要重新登录</li>
        </ul>
      </div>
    </div>
  </PageLayout>
</template>
