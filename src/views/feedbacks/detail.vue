<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElButton, ElCard, ElDescriptions, ElDescriptionsItem,ElIcon, ElTag, ElAvatar, ElInput, ElEmpty } from 'element-plus';
import { ArrowLeft, ChatDotRound, Clock, Location, User } from '@element-plus/icons-vue';
import { getFeedbackDetailApi, replyFeedbackApi, closeFeedbackApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import { useUserStore } from '@/stores';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const detail = ref(null);
const replyContent = ref('');
const { loading, execute: fetchDetail } = useApi();
const { loading: replyLoading, execute: executeReply } = useApi();
const { loading: closeLoading, execute: executeClose } = useApi();

// 状态映射
const statusMap = {
  0: { label: '待处理', type: 'warning' },
  1: { label: '已回复', type: 'success' },
  2: { label: '已关闭', type: 'info' },
};

// 时间段映射
const timeSlotMap = { 0: '上午', 1: '下午', 2: '晚上' };

// 是否可以回复（教师/管理员）
const canReply = computed(() => {
  const role = userStore.userInfo?.role;
  return ['teacher', 'admin', 'super_admin'].includes(role) && detail.value?.status !== 2;
});

// 是否可以关闭
const canClose = computed(() => {
  const role = userStore.userInfo?.role;
  return ['teacher', 'admin', 'super_admin'].includes(role) && detail.value?.status !== 2;
});

// 加载详情
const loadDetail = async () => {
  const id = Number(route.params.id);
  if (!id) {
    ElMessage.error('反馈ID无效');
    router.back();
    return;
  }

  const result = await fetchDetail(() => getFeedbackDetailApi(id));
  if (result) {
    detail.value = result;
  }
};

// 返回列表
const goBack = () => {
  router.push('/feedbacks');
};

// 提交回复
const handleReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容');
    return;
  }

  await executeReply(() => replyFeedbackApi(detail.value.id, { content: replyContent.value }));
  ElMessage.success('回复成功');
  replyContent.value = '';
  loadDetail();
};

// 关闭反馈
const handleClose = async () => {
  try {
    await ElMessageBox.confirm('确定要关闭此反馈吗？关闭后将无法继续回复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const result = await executeClose(() => closeFeedbackApi(detail.value.id));
    if (result) {
      ElMessage.success('反馈已关闭');
      loadDetail();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || '操作失败');
    }
  }
};

// 格式化时间
const formatTime = (time) => new Date(time).toLocaleString('zh-CN');

// 获取角色标签
const getRoleTag = (role) => {
  const roleMap = {
    student: { label: '学生', type: '' },
    teacher: { label: '教师', type: 'success' },
    admin: { label: '管理员', type: 'warning' },
    super_admin: { label: '超级管理员', type: 'danger' },
  };
  return roleMap[role] || { label: '用户', type: '' };
};

onMounted(() => {
  loadDetail();
});
</script>

<template>
  <PageLayout :title="detail ? `反馈详情 #${detail.id}` : '反馈详情'" :loading="loading">
    <template #actions>
      <ElButton :icon="ArrowLeft" @click="goBack">返回列表</ElButton>
      <ElButton v-if="canClose && detail" type="warning" :loading="closeLoading" @click="handleClose">
        关闭反馈
      </ElButton>
    </template>

    <div v-if="detail" class="detail-container">
      <!-- 反馈信息 -->
      <ElCard class="mb-4">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-bold">反馈信息</span>
            <ElTag :type="statusMap[detail.status]?.type">
              {{ statusMap[detail.status]?.label }}
            </ElTag>
          </div>
        </template>

        <div class="flex items-center gap-3 mb-4">
          <ElAvatar :size="40" :src="detail.user?.avatar">
            {{ detail.user?.nickname?.[0] || detail.user?.username?.[0] }}
          </ElAvatar>
          <div>
            <div class="font-medium">{{ detail.user?.nickname || detail.user?.username }}</div>
            <div class="text-sm text-gray-500">{{ formatTime(detail.createdAt) }}</div>
          </div>
        </div>

        <h2 class="text-xl font-semibold mb-3">{{ detail.title }}</h2>
        <p class="text-gray-700 whitespace-pre-wrap">{{ detail.content }}</p>
      </ElCard>

      <!-- 关联信息 -->
      <ElCard class="mb-4">
        <template #header>
          <span class="font-semibold">关联信息</span>
        </template>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="实验室">
            {{ detail.lab?.name }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="实验室位置">
            {{ detail.lab?.location }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="预约日期">
            {{ detail.appointment?.appointmentDate }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="时间段">
            {{ timeSlotMap[detail.appointment?.timeSlot] }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 回复列表 -->
      <ElCard class="mb-4">
        <template #header>
          <div class="flex items-center gap-2">
            <ElIcon><ChatDotRound /></ElIcon>
            <span class="font-semibold">回复记录 ({{ detail.replies?.length || 0 }})</span>
          </div>
        </template>

        <div v-if="detail.replies?.length" class="space-y-4">
          <div
            v-for="reply in detail.replies"
            :key="reply.id"
            class="flex gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <ElAvatar :size="36" :src="reply.user?.avatar">
              {{ reply.user?.nickname?.[0] || reply.user?.username?.[0] }}
            </ElAvatar>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium">{{ reply.user?.nickname || reply.user?.username }}</span>
                <ElTag v-if="reply.user?.role" :type="getRoleTag(reply.user.role).type" size="small">
                  {{ getRoleTag(reply.user.role).label }}
                </ElTag>
                <span class="text-sm text-gray-500">{{ formatTime(reply.createdAt) }}</span>
              </div>
              <p class="text-gray-700 whitespace-pre-wrap">{{ reply.content }}</p>
            </div>
          </div>
        </div>
        <ElEmpty v-else description="暂无回复" />
      </ElCard>

      <!-- 回复输入框 -->
      <ElCard v-if="canReply">
        <template #header>
          <span class="font-semibold">发表回复</span>
        </template>

        <ElInput
          v-model="replyContent"
          type="textarea"
          :rows="4"
          placeholder="请输入回复内容..."
          class="mb-4"
        />
        <div class="flex justify-end">
          <ElButton type="primary" :loading="replyLoading" @click="handleReply">
            提交回复
          </ElButton>
        </div>
      </ElCard>
    </div>
  </PageLayout>
</template>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
