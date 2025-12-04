<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  ElMessage,
  ElMessageBox,
  ElTabs,
  ElTabPane,
  ElTag,
  ElButton,
  ElPagination,
  ElEmpty,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { useAuthStore } from '@/stores';
import {
  getMyLabsApi,
  getMyAppointmentsApi,
  getMyInstrumentApplicationsApi,
  getMyFavoritesApi,
  toggleFavoriteApi,
  getMyRepairsApi,
  cancelAppointmentApi,
} from '@/api';
import { LabCard, ReservationTable, EmptyState, EvaluationDialog, AppointmentDetailDialog } from '@/components';
import { useApi, usePagination } from '@/composables';
import { ApplicationStatus, RepairStatus, ReservationStatus } from '@/types';

const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref('info');
const user = ref(null);
const loading = ref(false);

// 我的实验室
const myLabs = ref([]);
const labsTotal = ref(0);
const { loading: labsLoading, execute: fetchMyLabs } = useApi();
const { pagination: labsPagination, handlePageChange: handleLabsPageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: labsTotal,
});

// 预约历史
const appointments = ref([]);

// 仪器申请
const applications = ref([]);

// 我的收藏
const favorites = ref([]);

// 报修记录
const repairRequests = ref([]);

// 评价弹窗
const evaluationDialogVisible = ref(false);
const currentAppointmentForEvaluation = ref(null);

// 详情弹窗
const detailDialogVisible = ref(false);
const currentAppointmentForDetail = ref(null);

// 将 API 数据格式转换为组件需要的格式
const reservations = computed(() => {
  return appointments.value.map(item => ({
    id: item.id,
    labId: item.lab?.id,
    labName: item.lab?.name,
    userId: item.user?.id,
    userName: item.user?.username,
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
};

// 加载我的实验室
const loadMyLabs = async () => {
  const result = await fetchMyLabs(() =>
    getMyLabsApi({
      page: labsPagination.page,
      pageSize: labsPagination.pageSize,
    })
  );
  if (result) {
    myLabs.value = result.list || [];
    labsTotal.value = result.total || 0;
  }
};

// 加载预约历史
const fetchReservations = async () => {
  loading.value = true;
  try {
    const response = await getMyAppointmentsApi({ page: 1, pageSize: 10 });
    appointments.value = response || [];
  } catch (error) {
    console.error('获取预约记录失败:', error);
    ElMessage.error('获取预约记录失败');
  } finally {
    loading.value = false;
  }
};

// 加载仪器申请
const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await getMyInstrumentApplicationsApi({ page: 1, pageSize: 10 });
    applications.value = response.list || [];
  } catch (error) {
    console.error('获取申请记录失败:', error);
    ElMessage.error('获取申请记录失败');
  } finally {
    loading.value = false;
  }
};

// 加载我的收藏
const fetchFavorites = async () => {
  loading.value = true;
  try {
    const response = await getMyFavoritesApi({ page: 1, pageSize: 10 });
    favorites.value = response.list || [];
  } catch (error) {
    console.error('获取收藏失败:', error);
    ElMessage.error('获取收藏失败');
  } finally {
    loading.value = false;
  }
};

// 加载报修记录
const fetchRepairRequests = async () => {
  loading.value = true;
  try {
    const response = await getMyRepairsApi({ page: 1, pageSize: 10 });
    repairRequests.value = response.list || [];
  } catch (error) {
    console.error('获取报修记录失败:', error);
    ElMessage.error('获取报修记录失败');
  } finally {
    loading.value = false;
  }
};

// Tab切换处理
const handleTabChange = (tab) => {
  switch (tab) {
    case 'myLabs':
      loadMyLabs();
      break;
    case 'reservations':
      fetchReservations();
      break;
    case 'applications':
      fetchApplications();
      break;
    case 'favorites':
      fetchFavorites();
      break;
    case 'repairs':
      fetchRepairRequests();
      break;
  }
};

// 编辑实验室
const handleEditLab = (lab) => {
  router.push(`/labs/${lab.id}/edit`);
};

// 查看实验室详情
const handleViewLab = (lab) => {
  router.push(`/labs/${lab.id}`);
};

// 创建新实验室
const handleCreateLab = () => {
  router.push('/labs/create');
};

// 取消预约
const handleCancelReservation = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await cancelAppointmentApi(id);
    ElMessage.success('取消成功');
    fetchReservations();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败');
    }
  }
};

// 查看预约详情
const handleViewDetail = (row) => {
  const appointment = appointments.value.find(item => item.id === row.id);
  currentAppointmentForDetail.value = appointment || row;
  detailDialogVisible.value = true;
};

// 打开评价弹窗
const handleEvaluate = (row) => {
  const appointment = appointments.value.find(item => item.id === row.id);
  currentAppointmentForEvaluation.value = appointment || row;
  evaluationDialogVisible.value = true;
};

// 评价成功后刷新
const handleEvaluationSuccess = () => {
  fetchReservations();
};

// 取消收藏
const removeFavorite = async (lab) => {
  try {
    await toggleFavoriteApi(lab.id);
    ElMessage.success('已取消收藏');
    fetchFavorites();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

// 查看实验室详情
const goToLabDetail = (lab) => {
  router.push(`/labs/${lab.id}`);
};

// 查看仪器详情
const viewInstrumentDetail = (row) => {
  if (row.instrument?.id) {
    router.push(`/instruments/${row.instrument.id}`);
  } else {
    ElMessage.warning('仪器信息不存在');
  }
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

// 申请状态
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

// 报修状态
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

// 监听分页变化
watch(() => labsPagination.page, loadMyLabs);

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

      <ElTabPane label="我的实验室" name="myLabs">
        <div v-loading="labsLoading">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">我创建的实验室</h3>
            <ElButton type="primary" @click="handleCreateLab">
              添加实验室
            </ElButton>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <LabCard
              v-for="lab in myLabs"
              :key="lab.id"
              :lab="lab"
              :show-favorite="false"
              :show-edit="true"
              :show-tags="true"
              @click="handleViewLab"
              @edit="handleEditLab"
            />
          </div>

          <div v-if="labsTotal > labsPagination.pageSize" class="flex justify-center mt-6">
            <ElPagination
              v-model:current-page="labsPagination.page"
              :page-size="labsPagination.pageSize"
              :total="labsTotal"
              layout="total, prev, pager, next, jumper"
              @current-change="handleLabsPageChange"
            />
          </div>

          <div v-if="myLabs.length === 0 && !labsLoading" class="bg-white rounded-lg shadow-md p-12">
            <ElEmpty description="暂无实验室">
              <ElButton type="primary" @click="handleCreateLab">添加实验室</ElButton>
            </ElEmpty>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="预约历史" name="reservations">
        <div class="bg-white rounded-lg shadow-md p-6">
          <ReservationTable 
            :reservations="reservations" 
            :loading="loading" 
            @cancel="handleCancelReservation"
            @view="handleViewDetail"
            @evaluate="handleEvaluate"
          />
        </div>
      </ElTabPane>

      <ElTabPane label="仪器申请" name="applications">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
          <ElTable :data="applications" stripe style="width: 100%">
            <ElTableColumn prop="id" label="申请ID" width="80" />
            <ElTableColumn prop="name" label="仪器名称" min-width="150">
              <template #default="{ row }">
                {{ row.instrument?.name || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="model" label="型号" min-width="120">
              <template #default="{ row }">
                {{ row.instrument?.model || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="serialNumber" label="序列号" min-width="120">
              <template #default="{ row }">
                {{ row.instrument?.serialNumber || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="lab" label="所属实验室" min-width="150">
              <template #default="{ row }">
                {{ row.instrument?.lab?.name || '未知' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="status" label="状态" width="100">
              <template #default="{ row }">
                <ElTag :type="getApplicationStatusType(row.status)" size="small">
                  {{ getApplicationStatusText(row.status) }}
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
                <ElButton link type="primary" size="small" @click="viewInstrumentDetail(row)">
                  查看详情
                </ElButton>
              </template>
            </ElTableColumn>
          </ElTable>

          <EmptyState 
            v-if="applications.length === 0 && !loading"
            icon="Document"
            description="暂无仪器申请记录"
          />
        </div>
      </ElTabPane>

      <ElTabPane label="我的收藏" name="favorites">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6 min-h-[400px]">
          <div v-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LabCard
              v-for="item in favorites"
              :key="item.id"
              :lab="{ ...item.lab, isFavorite: true }"
              :show-favorite="true"
              @click="goToLabDetail(item.lab)"
              @toggle-favorite="removeFavorite(item.lab)"
            />
          </div>
          
          <EmptyState 
            v-if="favorites.length === 0 && !loading"
            icon="Star"
            description="还没有收藏任何实验室"
            :show-action="true"
            action-text="去浏览实验室"
            @action="$router.push('/labs')"
          />
        </div>
      </ElTabPane>

      <ElTabPane label="报修记录" name="repairs">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
          <ElTable :data="repairRequests" stripe style="width: 100%">
            <ElTableColumn prop="id" label="报修ID" width="80" />
            <ElTableColumn prop="instrument" label="仪器名称" min-width="150">
              <template #default="{ row }">
                {{ row.instrument?.name || '未知仪器' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="description" label="故障描述" min-width="200">
              <template #default="{ row }">
                <span class="line-clamp-2">{{ row.description }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="status" label="状态" width="100">
              <template #default="{ row }">
                <ElTag :type="getRepairStatusType(row.status)" size="small">
                  {{ getRepairStatusText(row.status) }}
                </ElTag>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="createdAt" label="报修时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </ElTableColumn>
          </ElTable>

          <EmptyState 
            v-if="repairRequests.length === 0 && !loading"
            icon="Tools"
            description="暂无报修记录"
          />
        </div>
      </ElTabPane>
    </ElTabs>

    <!-- 预约详情弹窗 -->
    <AppointmentDetailDialog
      v-model="detailDialogVisible"
      :appointment="currentAppointmentForDetail"
    />

    <!-- 评价弹窗 -->
    <EvaluationDialog
      v-model="evaluationDialogVisible"
      :appointment="currentAppointmentForEvaluation"
      @success="handleEvaluationSuccess"
    />
  </div>
</template>
