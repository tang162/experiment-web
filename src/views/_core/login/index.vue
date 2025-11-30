<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElForm, ElFormItem, ElInput, ElCheckbox, ElButton } from 'element-plus';
import { useAuthStore } from '@/stores';


const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formRef = ref();
const loading = ref(false);

const loginForm = reactive({
  username: 'auv1',
  password: '258956Li',
  rememberPassword: false,
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度为4-20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20个字符', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  if (!formRef.value) return;

  try {
    // 验证表单
    await formRef.value.validate();

    loading.value = true;
    
    // 执行登录
    await authStore.login(loginForm);
    ElMessage.success('登录成功');

    // 获取重定向地址
    const redirect = route.query.redirect || authStore.getDefaultHomePath;

    // 跳转到首页或重定向地址
    await router.push(redirect);
  } catch (error) {
    ElMessage.error(error.message || '登录失败');
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
          <p class="text-gray-600">登录实验室预约系统</p>
        </div>

        <ElForm ref="formRef" :model="loginForm" :rules="rules" label-position="top" size="large">
          <ElFormItem label="用户名" prop="username">
            <ElInput v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="'user'" clearable />
          </ElFormItem>

          <ElFormItem label="密码" prop="password">
            <ElInput v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="'lock'"
              show-password @keyup.enter="handleLogin" />
          </ElFormItem>

          <ElFormItem>
            <ElCheckbox v-model="loginForm.rememberPassword">
              记住密码（7天）
            </ElCheckbox>
          </ElFormItem>

          <ElFormItem>
            <ElButton type="primary" :loading="loading" class="w-full" @click="handleLogin">
              登录
            </ElButton>
          </ElFormItem>
        </ElForm>

        <div class="text-center mt-6">
          <span class="text-gray-600">还没有账号？</span>
          <ElButton link @click="goToRegister">
            立即注册
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ElFormItem__label) {
  font-weight: 500;
  color: #374151;
}
</style>
