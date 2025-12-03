<script setup>

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElBadge, ElButton, ElIcon, ElDropdown, ElAvatar, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { User, SwitchButton, Bell } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores';
import { getUnreadCountApi } from '@/api';
import { UserRole } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const unreadCount = ref(0);

const userInfo = computed(() => authStore.getUserInfo);
const isStudent = computed(() => authStore.getUserRole === UserRole.STUDENT);

const menuItems = computed(() => {
  const baseMenus = [
    { title: '首页', path: '/home', icon: 'House' },
    { title: '实验室', path: '/labs', icon: 'School' },
    { title: '仪器列表', path: '/instruments', icon: 'Monitor' },
  ];

  if (!isStudent.value) {
    baseMenus.push(
      { title: '预约审核', path: '/teacher/appointments', icon: 'Document' },
      { title: '申请审核', path: '/teacher/applications', icon: 'DocumentChecked' }
    );
  }

  return baseMenus;
});

const fetchUnreadCount = async () => {
  try {
    const { count } = await getUnreadCountApi();
    unreadCount.value = count ?? 0
  } catch (error) {
    console.error('获取未读消息数失败:', error);
  }
};

const goToNotifications = () => {
  router.push('/notification/list');
};

const goToProfile = () => {
  router.push('/profile');
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/welcome');
};

const handleMenuClick = (path) => {
  router.push(path);
};

onMounted(() => {
  if (authStore.getIsLoggedIn) {
    fetchUnreadCount();
  }
})


</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header v-if="authStore.getIsLoggedIn" class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <div class="text-xl font-bold text-indigo-600 cursor-pointer" @click="router.push('/home')">
              实验室预约系统
            </div>

            <nav class="hidden md:flex space-x-6">
              <div v-for="item in menuItems" :key="item.path"
                class="px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
                :class="$route.path.startsWith(item.path) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'"
                @click="handleMenuClick(item.path)">
                {{ item.title }}
              </div>
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <ElBadge :value="unreadCount" :hidden="unreadCount === 0">
              <ElButton text circle @click="goToNotifications">
                <ElIcon :size="20">
                  <Bell />
                </ElIcon>
              </ElButton>
            </ElBadge>

            <ElDropdown trigger="click">
              <div class="flex items-center space-x-2 cursor-pointer">
                <ElAvatar :size="32" :src="userInfo?.avatar" :alt="userInfo?.username">
                  {{ userInfo?.nickname?.[0] || userInfo?.username?.[0] || 'U' }}
                </ElAvatar>
                <span class="text-sm font-medium">{{ userInfo?.nickname || userInfo?.username }}</span>
              </div>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="goToProfile">
                    <ElIcon>
                      <User />
                    </ElIcon>
                    个人中心
                  </ElDropdownItem>
                  <ElDropdownItem divided @click="handleLogout">
                    <ElIcon>
                      <SwitchButton />
                    </ElIcon>
                    退出登录
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped></style>
