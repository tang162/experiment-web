<script setup lang="ts">

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElBadge, ElButton, ElIcon, ElDropdown, ElAvatar, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { User, SwitchButton } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores';
import { notificationApi } from '@/api';
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
    { title: '仪器申请', path: '/equipment/apply', icon: 'Tools' },
    { title: '设备报修', path: '/equipment/repair', icon: 'Warning' },
  ];

  if (isStudent.value) {
    baseMenus.push({ title: '我的预约', path: '/reservations', icon: 'Calendar' });
  } else {
    baseMenus.push({ title: '审核管理', path: '/teacher/reservations', icon: 'Document' });
  }

  return baseMenus;
});

const fetchUnreadCount = async () => {
  try {
    const response = await notificationApi.getUnreadCount();
    unreadCount.value = response.count;
  } catch (error) {
    console.error('获取未读消息数失败:', error);
  }
};

const goToNotifications = () => {
  router.push('/notifications');
};

const goToProfile = () => {
  router.push('/profile');
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const handleMenuClick = (path: string) => {
  router.push(path);
};

if (authStore.getIsLoggedIn) {
  fetchUnreadCount();
  setInterval(fetchUnreadCount, 60000);
}
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
                <ElAvatar :size="32">
                  {{ userInfo?.nickname?.[0] || userInfo?.username?.[0] || 'U' }}
                </ElAvatar>
                <span class="text-sm font-medium">{{ userInfo?.nickname || userInfo?.username }}</span>
              </div>
              <template #dropdown>
                <ElDropdown-menu>
                  <ElDropdown-item @click="goToProfile">
                    <ElIcon>
                      <User />
                    </ElIcon>
                    个人中心
                  </ElDropdown-item>
                  <ElDropdown-item divided @click="handleLogout">
                    <ElIcon>
                      <SwitchButton />
                    </ElIcon>
                    退出登录
                  </ElDropdown-item>
                </ElDropdown-menu>
              </template>
            </ElDropdown>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <router-view />
    </main>

    <footer v-if="authStore.getIsLoggedIn" class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2024 实验室预约系统. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped></style>
