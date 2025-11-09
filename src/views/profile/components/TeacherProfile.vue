<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElTabs, ElTabPane, ElTag, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';
import { useAuthStore } from '@/stores';
import { userApi, reservationApi, equipmentApi } from '@/api';
import { ReservationTable } from '@/components';
import { ApplicationStatus } from '@/types';

const authStore = useAuthStore();

const activeTab = ref('info');
const user = ref(null);
const editDialogVisible = ref(false);
const pendingReservations = ref([]);
const pendingApplications = ref([]);
const loading = ref(false);

const editForm = reactive({
  nickname: '',
  email: '',
  phone: '',
  teachingTags: [],
});

const fetchUserInfo = () => {
  user.value = authStore.getUserInfo;
  if (user.value) {
    editForm.nickname = user.value.nickname || '';
    editForm.email = user.value.email || '';
    editForm.phone = user.value.phone || '';
    editForm.teachingTags = user.value.teachingTags || [];
  }
};

const fetchPendingReservations = async () => {
  loading.value = true;
  try {
    const response = await reservationApi.getPendingReviews({ page: 1, pageSize: 20 });
    pendingReservations.value = response.list;
  } catch (error) {
    console.error('获取待审核预约失败:', error);
  } finally {
    loading.value = false;
  }
};

const fetchPendingApplications = async () => {
  loading.value = true;
  try {
    const response = await equipmentApi.getPendingApplications({ page: 1, pageSize: 20 });
    pendingApplications.value = response.list;
  } catch (error) {
    console.error('获取待审核申请失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tabName) => {
  switch (tabName) {
    case 'reservations':
      fetchPendingReservations();
      break;
    case 'applications':
      fetchPendingApplications();
      break;
  }
};

const handleSaveProfile = async () => {
  try {
    await userApi.updateProfile(editForm);
    await authStore.fetchUserInfo();
    fetchUserInfo();
    editDialogVisible.value = false;
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

const handleApproveReservation = async (id) => {
  try {
    await reservationApi.approveReservation(id);
    ElMessage.success('已通过');
    fetchPendingReservations();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const handleRejectReservation = async (id) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入驳回原因', '驳回预约', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入驳回原因',
    });

    if (reason) {
      await reservationApi.rejectReservation(id, reason);
      ElMessage.success('已驳回');
      fetchPendingReservations();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

const approveApplication = async (id) => {
  try {
    await equipmentApi.approveApplication(id);
    ElMessage.success('已通过');
    fetchPendingApplications();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const rejectApplication = async (id) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入驳回原因', '驳回申请', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入驳回原因',
    });

    if (reason) {
      await equipmentApi.rejectApplication(id, reason);
      ElMessage.success('已驳回');
      fetchPendingApplications();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

const getApplicationStatusType = (status) => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return 'warning';
    case ApplicationStatus.APPROVED:
      return 'success';
    case ApplicationStatus.REJECTED:
      return 'danger';
    default:
      return 'info';
  }
};

const getApplicationStatusText = (status) => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return '待审核';
    case ApplicationStatus.APPROVED:
      return '已通过';
    case ApplicationStatus.REJECTED:
      return '已驳回';
    default:
      return '未知';
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div>
    <ElTabs v-model="activeTab" @tab-change="handleTabChange">
      <ElTabPane label="基本信息" name="info">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">个人信息</h2>
            <ElButton type="primary" @click="editDialogVisible = true">
              编辑
            </ElButton>
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
              <ElTag type="primary">教师</ElTag>
            </div>
            <div class="flex items-start">
              <span class="text-gray-600 w-24">教学标签：</span>
              <div class="flex flex-wrap gap-2">
                <ElTag v-for="tag in user?.teachingTags" :key="tag" type="success">
                  {{ tag }}
                </ElTag>
                <span v-if="!user?.teachingTags || user.teachingTags.length === 0" class="text-gray-400">
                  未设置
                </span>
              </div>
            </div>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="预约审核" name="reservations">
        <div class="bg-white rounded-lg shadow-md p-6">
          <ReservationTable :reservations="pendingReservations" :loading="loading" :show-user="true"
            @approve="handleApproveReservation" @reject="handleRejectReservation" />
        </div>
      </ElTabPane>

      <ElTabPane label="申请审核" name="applications">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
          <ElTable :data="pendingApplications" stripe>
            <ElTableColumn prop="userName" label="申请人" />
            <ElTableColumn prop="equipmentName" label="仪器名称" />
            <ElTableColumn prop="purpose" label="用途" />
            <ElTableColumn prop="timeSlot" label="使用时段" />
            <ElTableColumn prop="description" label="详细说明" show-overflow-tooltip />
            <ElTableColumn label="操作" width="180">
              <template #default="{ row }">
                <ElButton type="success" size="small" @click="approveApplication(row.id)">
                  通过
                </ElButton>
                <ElButton type="danger" size="small" @click="rejectApplication(row.id)">
                  驳回
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </ElTabPane>
    </ElTabs>

    <ElDialog v-model="editDialogVisible" title="编辑个人信息" width="500px">
      <ElForm :model="editForm" label-width="80px">
        <ElFormItem label="昵称">
          <ElInput v-model="editForm.nickname" />
        </ElFormItem>
        <ElFormItem label="邮箱">
          <ElInput v-model="editForm.email" />
        </ElFormItem>
        <ElFormItem label="手机号">
          <ElInput v-model="editForm.phone" maxlength="11" />
        </ElFormItem>
        <ElFormItem label="教学标签">
          <ElSelect v-model="editForm.teachingTags" multiple allow-create filterable placeholder="输入并回车添加标签"
            style="width: 100%">
            <ElOption v-for="tag in editForm.teachingTags" :key="tag" :label="tag" :value="tag" />
          </ElSelect>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSaveProfile">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>