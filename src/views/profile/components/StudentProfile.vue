<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/stores';
import { userApi, reservationApi, equipmentApi, labApi } from '@/api';
import { ReservationTable, LabCard } from '@/components';
import { ApplicationStatus, RepairStatus } from '@/types';
import type { User, Reservation, EquipmentApplication, RepairRequest, Lab } from '@/types';

const authStore = useAuthStore();

const activeTab = ref('info');
const user = ref<User | null>(null);
const editDialogVisible = ref(false);
const reservations = ref<Reservation[]>([]);
const applications = ref<EquipmentApplication[]>([]);
const repairRequests = ref<RepairRequest[]>([]);
const favorites = ref<Lab[]>([]);
const loading = ref(false);

const editForm = reactive({
  nickname: '',
  email: '',
  phone: '',
});

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
    const response = await reservationApi.getMyReservations({ page: 1, pageSize: 10 });
    reservations.value = response.list;
  } catch (error) {
    console.error('获取预约记录失败:', error);
  } finally {
    loading.value = false;
  }
};

const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await equipmentApi.getMyApplications({ page: 1, pageSize: 10 });
    applications.value = response.list;
  } catch (error) {
    console.error('获取申请记录失败:', error);
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
    const response = await labApi.getFavoriteLabs({ page: 1, pageSize: 10 });
    favorites.value = response.list;
  } catch (error) {
    console.error('获取收藏失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleTabChange = (tabName: string) => {
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
    await userApi.updateProfile(editForm);
    await authStore.fetchUserInfo();
    fetchUserInfo();
    editDialogVisible.value = false;
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

const handleCancelReservation = async (id: string | number) => {
  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    await reservationApi.cancelReservation(id);
    ElMessage.success('取消成功');
    fetchReservations();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('取消失败');
    }
  }
};

const removeFavorite = async (lab: Lab) => {
  try {
    await labApi.toggleFavorite(lab.id);
    ElMessage.success('已取消收藏');
    fetchFavorites();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const getApplicationStatusType = (status: ApplicationStatus) => {
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

const getApplicationStatusText = (status: ApplicationStatus) => {
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

const getRepairStatusType = (status: RepairStatus) => {
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

const getRepairStatusText = (status: RepairStatus) => {
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

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="基本信息" name="info">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold">个人信息</h2>
            <el-button type="primary" @click="editDialogVisible = true">
              编辑
            </el-button>
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
              <el-tag type="success">学生</el-tag>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="预约历史" name="reservations">
        <div class="bg-white rounded-lg shadow-md p-6">
          <ReservationTable
            :reservations="reservations"
            :loading="loading"
            @cancel="handleCancelReservation"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="仪器申请" name="applications">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
          <el-table :data="applications" stripe>
            <el-table-column prop="equipmentName" label="仪器名称" />
            <el-table-column prop="purpose" label="用途" />
            <el-table-column prop="timeSlot" label="使用时段" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getApplicationStatusType(row.status)">
                  {{ getApplicationStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="申请时间" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="报修记录" name="repairs">
        <div v-loading="loading" class="bg-white rounded-lg shadow-md p-6">
          <el-table :data="repairRequests" stripe>
            <el-table-column prop="repairNumber" label="报修单号" />
            <el-table-column prop="equipmentName" label="设备名称" />
            <el-table-column prop="faultType" label="故障类型" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getRepairStatusType(row.status)">
                  {{ getRepairStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="报修时间" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="我的收藏" name="favorites">
        <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="lab in favorites"
            :key="lab.id"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold">{{ lab.name }}</h3>
              <el-button
                type="danger"
                size="small"
                text
                @click="removeFavorite(lab)"
              >
                取消收藏
              </el-button>
            </div>
            <p class="text-gray-600 mb-2">{{ lab.department }}</p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>容量：{{ lab.capacity }}人</span>
              <span>评分：{{ lab.rating?.toFixed(1) || '暂无' }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="editDialogVisible" title="编辑个人信息" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" maxlength="11" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProfile">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
