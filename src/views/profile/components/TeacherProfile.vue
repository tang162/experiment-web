<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  ElTabs,
  ElTabPane,
  ElButton,
  ElPagination,
  ElEmpty,
  ElMessage,
  ElMessageBox,
} from 'element-plus';
import { useAuthStore } from '@/stores';
import { getMyLabsApi, returnInstrumentApi } from '@/api';
import { LabCard, ReservationCardGrid, EmptyState, EvaluationDialog, AppointmentDetailDialog, InstrumentApplicationCard, InstrumentApplicationDetailDialog, FeedbackCard, RepairCard, RepairDetailDialog } from '@/components';
import { useApi, usePagination, useProfile } from '@/composables';
import ProfileInfoCard from './ProfileInfoCard.vue';
import NewsLikesTab from './NewsLikesTab.vue';
import NewsFavoritesTab from './NewsFavoritesTab.vue';
import MyNewsTab from './MyNewsTab.vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: 'info',
  },
});

const router = useRouter();
const authStore = useAuthStore();

const activeTab = ref(props.initialTab);
const user = ref(null);

// 使用公共逻辑
const {
  loading,
  applications,
  repairRequests,
  favorites,
  feedbacks,
  reservations,
  evaluationDialogVisible,
  currentAppointmentForEvaluation,
  detailDialogVisible,
  currentAppointmentForDetail,
  applicationDetailDialogVisible,
  currentApplicationForDetail,
  fetchReservations,
  fetchApplications,
  fetchFavorites,
  fetchRepairRequests,
  fetchFeedbacks,
  handleCancelReservation,
  handleViewDetail,
  handleEvaluate,
  handleEvaluationSuccess,
  removeFavorite,
  goToLabDetail,
  viewInstrumentDetail,
  closeApplicationDetail,
  viewFeedbackDetail,
} = useProfile();

// 我的实验室（教师特有）
const myLabs = ref([]);
const labsTotal = ref(0);
const { loading: labsLoading, execute: fetchMyLabs } = useApi();
const { pagination: labsPagination, handlePageChange: handleLabsPageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: labsTotal,
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



// 组件引用
const newsLikesTabRef = ref(null);
const newsFavoritesTabRef = ref(null);
const myNewsTabRef = ref(null);

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
    case 'feedbacks':
      fetchFeedbacks();
      break;
    case 'newsLikes':
      newsLikesTabRef.value?.init();
      break;
    case 'newsFavorites':
      newsFavoritesTabRef.value?.init();
      break;
    case 'myNews':
      myNewsTabRef.value?.init();
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

// 处理归还成功
const handleReturnSuccess = () => {
  fetchApplications();
};

// 报修详情相关
const repairDetailDialogVisible = ref(false);
const currentRepairForDetail = ref(null);

// 查看报修详情
const handleViewRepairDetail = (repair) => {
  currentRepairForDetail.value = repair;
  repairDetailDialogVisible.value = true;
};

// 关闭报修详情对话框
const closeRepairDetail = () => {
  repairDetailDialogVisible.value = false;
  currentRepairForDetail.value = null;
};

// 处理取消报修成功
const handleCancelRepairSuccess = () => {
  fetchRepairRequests();
};

// 监听分页变化
watch(() => labsPagination.page, loadMyLabs);

onMounted(() => {
  fetchUserInfo();
  // 根据初始标签页加载对应数据
  handleTabChange(activeTab.value);
});
</script>

<template>
  <div>
    <ElTabs v-model="activeTab" @tab-change="handleTabChange">
      <ElTabPane label="基本信息" name="info">
        <ProfileInfoCard :user="user" role="teacher" />
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
        <div v-loading="loading" class="min-h-[400px]">
          <ReservationCardGrid 
            v-if="reservations.length > 0"
            :reservations="reservations" 
            :loading="loading" 
            @cancel="handleCancelReservation"
            @view="handleViewDetail"
            @evaluate="handleEvaluate"
          />
          <div v-if="reservations.length === 0 && !loading" class="bg-white rounded-lg shadow-md p-12">
            <EmptyState 
              icon="Calendar"
              description="暂无预约记录"
            />
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="仪器申请" name="applications">
        <div v-loading="loading" class="min-h-[400px]">
          <div v-if="applications.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InstrumentApplicationCard
              v-for="application in applications"
              :key="application.id"
              :application="application"
              @click="viewInstrumentDetail"
            />
          </div>

          <div v-if="applications.length === 0 && !loading" class="bg-white rounded-lg shadow-md p-12">
            <EmptyState 
              icon="Document"
              description="暂无仪器申请记录"
            />
          </div>
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
        <div v-loading="loading" class="min-h-[400px]">
          <div v-if="repairRequests.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RepairCard
              v-for="repair in repairRequests"
              :key="repair.id"
              :repair="repair"
              @click="handleViewRepairDetail"
            />
          </div>

          <div v-if="repairRequests.length === 0 && !loading" class="bg-white rounded-lg shadow-md p-12">
            <EmptyState 
              icon="Tools"
              description="暂无报修记录"
            />
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="我的反馈" name="feedbacks">
        <div v-loading="loading" class="min-h-[400px]">
          <div v-if="feedbacks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeedbackCard
              v-for="feedback in feedbacks"
              :key="feedback.id"
              :feedback="feedback"
              @view-detail="viewFeedbackDetail"
            />
          </div>

          <div v-if="feedbacks.length === 0 && !loading" class="bg-white rounded-lg shadow-md p-12">
            <EmptyState 
              icon="ChatLineSquare"
              description="暂无反馈记录"
              :show-action="true"
              action-text="提交反馈"
              @action="$router.push('/feedbacks/create')"
            />
          </div>
        </div>
      </ElTabPane>

      <ElTabPane label="我的动态" name="myNews">
        <MyNewsTab ref="myNewsTabRef" />
      </ElTabPane>

      <ElTabPane label="点赞的动态" name="newsLikes">
        <NewsLikesTab ref="newsLikesTabRef" />
      </ElTabPane>

      <ElTabPane label="收藏的动态" name="newsFavorites">
        <NewsFavoritesTab ref="newsFavoritesTabRef" />
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

    <!-- 仪器申请详情弹窗 -->
    <InstrumentApplicationDetailDialog
      v-model="applicationDetailDialogVisible"
      :application="currentApplicationForDetail"
      @close="closeApplicationDetail"
      @return-success="handleReturnSuccess"
    />

    <!-- 报修详情弹窗 -->
    <RepairDetailDialog
      v-model="repairDetailDialogVisible"
      :repair="currentRepairForDetail"
      @close="closeRepairDetail"
      @cancel-success="handleCancelRepairSuccess"
    />
  </div>
</template>
