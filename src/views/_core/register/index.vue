<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores';
import { authApi } from '@/api';
import { UserRole, type RegisterForm } from '@/types';
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const checkingUsername = ref(false);

const registerForm = reactive<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
  role: UserRole.STUDENT,
  email: '',
  phone: '',
});

const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      callback(new Error('密码必须包含大小写字母和数字'));
    } else if (registerForm.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword');
    }
    callback();
  }
};

const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'));
  } else {
    const isValid = /^[a-zA-Z0-9]+$/.test(value);
    if (!isValid) {
      callback(new Error('用户名只能包含字母和数字'));
    } else {
      callback();
    }
  }
};

let usernameCheckTimer: NodeJS.Timeout | null = null;

const checkUsernameAvailability = async () => {
  if (!registerForm.username || registerForm.username.length < 4) return;
  
  if (usernameCheckTimer) {
    clearTimeout(usernameCheckTimer);
  }
  
  usernameCheckTimer = setTimeout(async () => {
    checkingUsername.value = true;
    try {
      const result = await authApi.checkUsername(registerForm.username);
      if (!result.available) {
        ElMessage.warning('用户名已被占用');
      }
    } catch (error) {
      console.error('检查用户名失败:', error);
    } finally {
      checkingUsername.value = false;
    }
  }, 500);
};

const rules: FormRules = {
  username: [
    { required: true, validator: validateUsername, trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度为4-20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
};

const handleRegister = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    loading.value = true;
    try {
      await authStore.register(registerForm);
      ElMessage.success('注册成功');
      
      router.push(authStore.getDefaultHomePath);
    } catch (error: any) {
      ElMessage.error(error.message || '注册失败');
    } finally {
      loading.value = false;
    }
  });
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">注册账号</h1>
          <p class="text-gray-600">加入实验室预约系统</p>
        </div>

        <el-form
          ref="formRef"
          :model="registerForm"
          :rules="rules"
          label-position="top"
          size="large"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="4-20个字符，字母+数字"
              clearable
              @input="checkUsernameAvailability"
            >
              <template #suffix>
                <el-icon v-if="checkingUsername" class="is-loading">
                  <Loading />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="8-20个字符，含大小写+数字"
              show-password
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              show-password
            />
          </el-form-item>

          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="registerForm.role" class="w-full">
              <el-radio :label="UserRole.STUDENT" class="w-full mb-2">学生</el-radio>
              <el-radio :label="UserRole.TEACHER" class="w-full">教师</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="邮箱（选填）" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              clearable
            />
          </el-form-item>

          <el-form-item label="手机号（选填）" prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入11位手机号"
              clearable
              maxlength="11"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="w-full"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="text-center mt-6">
          <span class="text-gray-600">已有账号？</span>
          <el-button type="text" @click="goToLogin">
            立即登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

:deep(.el-radio) {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-right: 0;
  
  &.is-checked {
    border-color: #409eff;
    background-color: #f0f8ff;
  }
}
</style>
