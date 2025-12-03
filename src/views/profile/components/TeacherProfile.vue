<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  ElMessage,
  ElMessageBox,
  ElTabs,
  ElTabPane,
  ElTag,
  ElButton,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElEmpty,
} from 'element-plus';
import { useAuthStore } from '@/stores';
import {
  getMyLabsApi,
  getPendingAppointmentsApi,
  reviewAppointmentApi,
  getInstrumentApplicationsApi,
  reviewInstrumentApplicationApi,
} from '@/api';
import { LabCard } from '@/components';
import { useApi, usePagination } from '@/composables';

const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref('info');
const user = ref(null);

// 我的实验室
const myLabs = ref([]);
const labsTotal = ref(0);
const { loading: labsLoading, execute: fetchMyLabs } = useApi();
const { pagination: labsPagination, handlePageChange: handleLabsPageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: labsTotal,
});

// 待审核预约
const pendingAppointments = ref([]);
const appointmentsTotal = ref(0);
const { loading: appointmentsLoading, execute: fetchAppointments } = useApi();
const { pagination: appointmentsPagination, handlePageChange: handleAppointmentsPageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: appointmentsTotal,
});

// 仪器申请
const pendingApplications = ref([]);
const applicationsTotal = ref(0);
const { loading: applicationsLoading, execute: fetchApplications } = useApi();
const { pagination: applicationsPagination, handlePageChange: handleApplicationsPageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: applicationsTotal,
});





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

// 加载待审核预约
const loadPendingAppointments = async () => {
  const result = await fetchAppointments(() =>
    getPendingAppointmentsApi({
      page: appointmentsPagination.page,
      pageSize: appointmentsPagination.pageSize,
    })
  );
  if (result) {
    pendingAppointments.value = result.list || [];
    appointmentsTotal.value = result.total || 0;
  }
};

// 加载仪器申请
const loadPendingApplications = async () => {
  const result = await fetchApplications(() =>
    getInstrumentApplicationsApi({
      page: applicationsPagination.page,
      pageSize: applicationsPagination.pageSize,
      status: 0,
    })
  );
  if (result) {
    pendingApplications.value = result.list || [];
    applicationsTotal.value = result.total || 0;
  }
};

// Tab切换处理
const handleTabChange = (tab) => {
  if (tab === 'myLabs') {
    loadMyLabs();
  } else if (tab === 'appointmentReview') {
    loadPendingAppointments();
  } else if (tab === 'applications') {
    loadPendingApplications();
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

// 审核预约 - 通过
const approvePendingAppointment = async (id) => {
  try {
    await ElMessageBox.confirm('确定通过此预约申请？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    await reviewAppointmentApi(id, { status: 1 });
    ElMessage.success('已通过');
    loadPendingAppointments();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 审核预约 - 拒绝
const rejectPendingAppointment = async (id) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝预约', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入拒绝原因',
    });

    if (reason) {
      await reviewAppointmentApi(id, { status: 2, reason });
      ElMessage.success('已拒绝');
      loadPendingAppointments();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 审核仪器申请 - 通过
const approveApplication = async (id) => {
  try {
    await ElMessageBox.confirm('确定通过此仪器申请？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    });
    await reviewInstrumentApplicationApi(id, { status: 1 });
    ElMessage.success('已通过');
    loadPendingApplications();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 审核仪器申请 - 拒绝
const rejectApplication = async (id) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '请输入拒绝原因',
    });

    if (reason) {
      await reviewInstrumentApplicationApi(id, { status: 2, rejectionReason: reason });
      ElMessage.success('已拒绝');
      loadPendingApplications();
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 格式化时间
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 时间段映射
const timeSlotMap = {
  0: '上午',
  1: '下午',
  2: '晚上',
};

// 监听分页变化
watch(() => labsPagination.page, loadMyLabs);
watch(() => appointmentsPagination.page, loadPendingAppointments);
watch(() => applicationsPagination.page, loadPendingApplications);

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

          <!-- 卡片列表 -->
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

          <!-- 分页 -->
          <div v-if="labsTotal > labsPagination.pageSize" class="flex justify-center mt-6">
            <ElPagination
              v-model:current-page="labsPagination.page"
              :page-size="labsPagination.pageSize"
              :total="labsTotal"
              layout="total, prev, pager, next, jumper"
              @current-change="handleLabsPageChange"
            />
          </div>

          <!-- 空状态 -->
          <div v-if="myLabs.length === 0 && !labsLoading" class="bg-white rounded-lg shadow-md p-12">
            <ElEmpty description="暂无实验室">
              <ElButton type="primary" @click="handleCreateLab">添加实验室</ElButton>
            </ElEmpty>
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="预约审核" name="appointmentReview">
        <div v-loading="appointmentsLoading" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4">待审核的实验室预约</h3>

          <ElTable :data="pendingAppointments" stripe style="width: 100%">
            <ElTableColumn prop="id" label="预约ID" width="80" />
            <ElTableColumn prop="lab" label="实验室" min-width="150">
              <template #default="{ row }">
                {{ row.lab?.name || '未知' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="user" label="申请人" width="120">
              <template #default="{ row }">
                {{ row.user?.nickname || row.user?.username || '未知' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="appointmentDate" label="预约日期" width="120">
              <template #default="{ row }">
                {{ formatDate(row.appointmentDate) }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="timeSlot" label="时间段" width="100">
              <template #default="{ row }">
                {{ timeSlotMap[row.timeSlot] || row.timeSlot }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="purpose" label="预约目的" min-width="150" show-overflow-tooltip />
            <ElTableColumn prop="participantCount" label="人数" width="80" />
            <ElTableColumn prop="createdAt" label="申请时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.createdAt) }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <div class="flex gap-2">
                  <ElButton type="success" size="small" @click="approvePendingAppointment(row.id)">
                    通过
                  </ElButton>
                  <ElButton type="danger" size="small" @click="rejectPendingAppointment(row.id)">
                    拒绝
                  </ElButton>
                </div>
              </template>
            </ElTableColumn>
          </ElTable>

          <div v-if="appointmentsTotal > appointmentsPagination.pageSize" class="flex justify-center mt-6">
            <ElPagination
              v-model:current-page="appointmentsPagination.page"
              :page-size="appointmentsPagination.pageSize"
              :total="appointmentsTotal"
              layout="total, prev, pager, next, jumper"
              @current-change="handleAppointmentsPageChange"
            />
          </div>

          <ElEmpty v-if="pendingAppointments.length === 0 && !appointmentsLoading" description="暂无待审核预约" />
        </div>
      </ElTabPane>

      <ElTabPane label="仪器申请审核" name="applications">
        <div v-loading="applicationsLoading" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4">待审核的仪器申请</h3>

          <ElTable :data="pendingApplications" stripe style="width: 100%">
            <ElTableColumn prop="id" label="申请ID" width="80" />
            <ElTableColumn prop="instrument" label="仪器名称" min-width="150">
              <template #default="{ row }">
                {{ row.instrument?.name || '未知' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="model" label="型号" width="120">
              <template #default="{ row }">
                {{ row.instrument?.model || '未设置' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="lab" label="所属实验室" min-width="120">
              <template #default="{ row }">
                {{ row.instrument?.lab?.name || '未知' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="applicant" label="申请人" width="120">
              <template #default="{ row }">
                {{ row.applicant?.nickname || row.applicant?.username || '未知' }}
              </template>
            </ElTableColumn>
            <ElTableColumn prop="purpose" label="使用目的" min-width="150" show-overflow-tooltip />
            <ElTableColumn prop="createdAt" label="申请时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.createdAt) }}
              </template>
            </ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <div class="flex gap-2">
                  <ElButton type="success" size="small" @click="approveApplication(row.id)">
                    通过
                  </ElButton>
                  <ElButton type="danger" size="small" @click="rejectApplication(row.id)">
                    拒绝
                  </ElButton>
                </div>
              </template>
            </ElTableColumn>
          </ElTable>

          <div v-if="applicationsTotal > applicationsPagination.pageSize" class="flex justify-center mt-6">
            <ElPagination
              v-model:current-page="applicationsPagination.page"
              :page-size="applicationsPagination.pageSize"
              :total="applicationsTotal"
              layout="total, prev, pager, next, jumper"
              @current-change="handleApplicationsPageChange"
            />
          </div>

          <ElEmpty v-if="pendingApplications.length === 0 && !applicationsLoading" description="暂无待审核申请" />
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>
