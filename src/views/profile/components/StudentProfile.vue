<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElTabs, ElTabPane, ElTag, ElDialog, ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn } from 'element-plus';
import { useAuthStore } from '@/stores';
import { equipmentApi, getAppointmentsApi, getMyInstrumentApplicationsApi, getMyFavoritesApi, toggleFavoriteApi } from '@/api';
import { ReservationTable, LabCard, EmptyState } from '@/components';
import { ApplicationStatus, RepairStatus, ReservationStatus, INSTRUMENT_STATUS_MAP } from '@/types';
const authStore = useAuthStore();


const router = useRouter();

const activeTab = ref('info');
const user = ref(null);
const editDialogVisible = ref(false);
const appointments = ref([]);
const applications = ref([]);
const repairRequests = ref([]);
const favorites = ref([]);
const loading = ref(false);

const editForm = reactive({
  nickname: '',
  email: '',
  phone: '',
});

// 将 API 数据格式转换为组件需要的格式
const reservations = computed(() => {
  return appointments.value.map(item => ({
    id: item.id,
    labId: item.lab.id,
    labName: item.lab.name,
    userId: item.user.id,
    userName: item.user.username,
    date: item.appointmentDate,
    timeSlot: item.timeSlot,
    purpose: item.purpose,
    description: item.description,
    participantCount: item.participantCount,
    status: mapStatusToEnum(item.status),
    createdAt: item.createdAt,
  }));
});

// 将数字状态码映射为枚举
const mapStatusToEnum = (status) => {
  const statusMap = {
    0: ReservationStatus.PENDING,
    1: ReservationStatus.APPROVED,
    2: ReservationStatus.REJECTED,
    3: ReservationStatus.COMPLETED,
    4: ReservationStatus.CANCELLED,
  };
  return statusMap[status] || ReservationStatus.PENDING;
};


const fetchUserInfo = () => {
  user.value = authStore.getUserInfo;
  if (user.value) {
    editForm.nickname = user.value.nickname || '';
    editForm.email = user.value.email || '';
    editForm.phone = user.value.phone || '';
  }
};

const fetchReservations = async () => {
  loading.value = true;
  try {
    const response = await getAppointmentsApi({ page: 1, pageSize: 10 });
    appointments.value = response.list || response.data || [];
  } catch (error) {
    console.error('获取预约记录失败:', error);
    ElMessage.error('获取预约记录失败');
  } finally {
    loading.value = false;
  }
};

const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await getMyInstrumentApplicationsApi({ page: 1, pageSize: 10 });
    applications.value = response.list || response.data || [];
  } catch (error) {
    console.error('获取申请记录失败:', error);
    ElMessage.error('获取申请记录失败');
  } finally {
    loading.value = false;
  }
};

const fetchRepairRequests = async () => {
  loading.value = true;
  try {
    const response = await equipmentApi.getMyRepairRequests({ page: 1, pageSize: 10 });
    repairRequests.value = response.list;
  } catch (error) {
    console.error('获取报修记录失败:', error);
  } finally {
    loading.value = false;
  }
};

const fetchFavorites = async () => {
  loading.value = true;
  try {
    const response = await getMyFavoritesApi({ page: 1, pageSize: 10 });
    favorites.value = response.list || response.data || [];
  } catch (error) {
    console.error('获取收藏失败:', error);
    ElMessage.error('获取收藏失败');
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tabName) => {
  switch (tabName) {
    case 'reservations':
      fetchReservations();
      break;
    case 'applications':
      fetchApplications();
      break;
    case 'repairs':
      fetchRepairRequests();
      break;
    case 'favorites':
      fetchFavorites();
      break;
  }
};

const handleSaveProfile = async () => {
  try {
    // await userApi.updateProfile(editForm);
    await authStore.fetchUserInfo();
    fetchUserInfo();
    editDialogVisible.value = false;
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

const handleCancelReservation = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    // await reservationApi.cancelReservation(id);
    ElMessage.success('取消成功');
    fetchReservations();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败');
    }
  }
};

const removeFavorite = async (lab) => {
  try {
    await toggleFavoriteApi(lab.id);
    ElMessage.success('已取消收藏');
    fetchFavorites();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 获取状态信息
const getStatusInfo = (status) => {
  return INSTRUMENT_STATUS_MAP[status];
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
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

const getRepairStatusType = (status) => {
  switch (status) {
    case RepairStatus.PENDING:
      return 'warning';
    case RepairStatus.IN_PROGRESS:
      return 'primary';
    case RepairStatus.COMPLETED:
      return 'success';
    default:
      return 'info';
  }
};

const getRepairStatusText = (status) => {
  switch (status) {
    case RepairStatus.PENDING:
      return '待处理';
    case RepairStatus.IN_PROGRESS:
      return '维修中';
    case RepairStatus.COMPLETED:
      return '已完成';
    default:
      return '未知';
  }
};

// 查看仪器详情
const viewDetail = (row) => {
  router.push(`/lab/instruments/${row.instrument.id}`);
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
              <ElTag type="success">学生</ElTag>
            </div>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="预约历史" name="reservations">
        <div class="bg-white rounded-lg shadow-md p-6">
          <ReservationTable :reservations="reservations" :loading="loading" @cancel="handleCancelReservation" />
        </div>
      </ElTabPane>

      <ElTabPane label="仪器申请" name="applications">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
          <!-- 表格 -->
          <ElTable :data="applications" stripe style="width: 100%">
            <ElTableColumn prop="id" label="申请ID" width="80" />
            <ElTableColumn prop="name" label="仪器名称" min-width="150">
              <template #default="{ row }">
                {{ row.instrument.name || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="model" label="型号" min-width="120">
              <template #default="{ row }">
                {{ row.instrument.model || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="serialNumber" label="序列号" min-width="120">
              <template #default="{ row }">
                {{ row.instrument.serialNumber || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="lab" label="所属实验室" min-width="150">
              <template #default="{ row }">
                {{ row.lab.name }}- {{ row.lab.location }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="status" label="状态" width="100">
              <template #default="{ row }">
                <ElTag :type="getStatusInfo(row.status).color" size="small">
                  {{ getStatusInfo(row.status).label }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="createdAt" label="申请时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <ElButton link type="primary" size="small" @click="viewDetail(row)">
                  查看详情
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>
        </div>
      </ElTabPane>


      <ElTabPane label="我的收藏" name="favorites">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
          <div v-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="lab in favorites" :key="lab.id" class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">{{ lab.lab.name }}</h3>
                <ElButton type="danger" size="small" text @click="removeFavorite(lab.lab)">
                  取消收藏
                </ElButton>
              </div>
              <p class="text-gray-600 mb-2">{{ lab.department }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>容量：{{ lab.lab.capacity }}人</span>
                <span>评分：{{ lab.lab.rating || '暂无' }}</span>
              </div>
            </div>
          </div>
          
          <EmptyState 
            v-if="favorites.length === 0 && !loading"
            icon="Star"
            description="还没有收藏任何实验室"
            :show-action="true"
            action-text="去浏览实验室"
            @action="$router.push('/lab/labs')"
          />
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
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSaveProfile">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>
