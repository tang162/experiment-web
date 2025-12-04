<script setup>
import { ref, onMounted } from 'vue';
import { ElCard, ElButton, ElTag, ElPagination, ElEmpty, ElMessage, ElMessageBox } from 'element-plus';
import {
  getNotificationsApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
} from '@/api';
import { PageLayout } from '@/components';
import { useApi, usePagination } from '@/composables';

const notifications = ref([]);
const total = ref(0);

const { loading, execute: fetchNotifications } = useApi();
const { pagination, handlePageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 通知类型映射
const typeMap = {
  SYSTEM: { label: '系统通知', color: 'primary' },
  APPOINTMENT: { label: '预约通知', color: 'success' },
  INSTRUMENT: { label: '仪器通知', color: 'warning' },
  REPAIR: { label: '维修通知', color: 'danger' },
  NEWS: { label: '新闻通知', color: 'info' },
};

// 加载通知列表
const loadNotifications = async () => {
  const result = await fetchNotifications(() =>
    getNotificationsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
  );

  if (result) {
    notifications.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 标记为已读
const markAsRead = async (id) => {
  try {
    await markAsReadApi(id);
    await loadNotifications();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 全部标记为已读
const markAllRead = async () => {
  try {
    await markAllAsReadApi();
    ElMessage.success('已全部标记为已读');
    loadNotifications();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 删除通知
const deleteNotification = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await deleteNotificationApi(id);
    ElMessage.success('删除成功');
    loadNotifications();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

onMounted(() => {
  loadNotifications();
});
</script>

<template>
  <PageLayout title="消息通知" description="查看您的所有通知消息" :loading="loading">
    <!-- 操作栏 -->
    <div class="mb-6 flex justify-end">
      <ElButton type="primary" @click="markAllRead">全部标记为已读</ElButton>
    </div>

    <!-- 通知列表 -->
    <div class="space-y-4">
      <ElCard
        v-for="notification in notifications"
        :key="notification.id"
        shadow="hover"
        :class="{ 'bg-blue-50': !notification.isRead }"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <ElTag :type="typeMap[notification.type]?.color" size="small">
                {{ typeMap[notification.type]?.label || '通知' }}
              </ElTag>
              <span v-if="!notification.isRead" class="text-xs text-blue-600 font-semibold">
                [未读]
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ notification.title }}</h3>
            <p class="text-gray-600 mb-3">{{ notification.content }}</p>
            <div class="text-sm text-gray-500">
              {{ formatDate(notification.createdAt) }}
            </div>
          </div>
          <div class="ml-4 flex flex-col gap-2">
            <ElButton
              v-if="!notification.isRead"
              size="small"
              type="primary"
              @click="markAsRead(notification.id)"
            >
              标记已读
            </ElButton>
            <ElButton
              size="small"
              type="danger"
              @click="deleteNotification(notification.id)"
            >
              删除
            </ElButton>
          </div>
        </div>
      </ElCard>

      <!-- 空状态 -->
      <ElEmpty v-if="notifications.length === 0 && !loading" description="暂无通知" />

      <!-- 分页 -->
      <div v-if="total > pagination.pageSize" class="flex justify-center mt-6">
        <ElPagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </PageLayout>
</template>
