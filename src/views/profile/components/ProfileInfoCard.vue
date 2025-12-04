

<script setup>
import { computed } from 'vue';
import { ElButton, ElTag } from 'element-plus';

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  role: {
    type: String,
    default: 'student', // 'student' | 'teacher'
  },
});

const roleType = computed(() => {
  return props.role === 'teacher' ? 'primary' : 'success';
});

const roleText = computed(() => {
  return props.role === 'teacher' ? '教师' : '学生';
});
</script>
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">个人信息</h2>
      <div class="flex gap-2">
        <ElButton type="primary" @click="$router.push('/profile/edit')">
          编辑信息
        </ElButton>
        <ElButton @click="$router.push('/profile/password')">
          修改密码
        </ElButton>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center">
        <span class="text-gray-600 w-24">用户名：</span>
        <span class="font-medium">{{ user?.username }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-600 w-24">昵称：</span>
        <span class="font-medium">{{ user?.nickname || '未设置' }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-600 w-24">邮箱：</span>
        <span class="font-medium">{{ user?.email || '未设置' }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-600 w-24">手机号：</span>
        <span class="font-medium">{{ user?.phone || '未设置' }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-gray-600 w-24">角色：</span>
        <ElTag :type="roleType">{{ roleText }}</ElTag>
      </div>
      <div v-if="user?.teachingTags" class="flex items-start">
        <span class="text-gray-600 w-24">教学标签：</span>
        <div class="flex flex-wrap gap-2">
          <ElTag v-for="tag in user.teachingTags" :key="tag" type="success">
            {{ tag }}
          </ElTag>
          <span v-if="!user.teachingTags || user.teachingTags.length === 0" class="text-gray-400">
            未设置
          </span>
        </div>
      </div>
    </div>
  </div>
</template>