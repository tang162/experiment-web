<script setup>
import { ref, onMounted } from 'vue';
import { ElTabs, ElTabPane, ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/stores';
import { ReservationCardGrid, LabCard, EmptyState, EvaluationDialog, AppointmentDetailDialog, InstrumentApplicationCard, InstrumentApplicationDetailDialog, FeedbackCard, RepairCard, RepairDetailDialog } from '@/components';
import { returnInstrumentApi } from '@/api';
import { useProfile } from '@/composables';
import ProfileInfoCard from './ProfileInfoCard.vue';
import NewsLikesTab from './NewsLikesTab.vue';
import NewsFavoritesTab from './NewsFavoritesTab.vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: 'info',
  },
});

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
  handleFeedback,
} = useProfile();

const fetchUserInfo = () => {
  user.value = authStore.getUserInfo;
};

// 组件引用
const newsLikesTabRef = ref(null);
const newsFavoritesTabRef = ref(null);

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
    case 'feedbacks':
      fetchFeedbacks();
      break;
    case 'newsLikes':
      newsLikesTabRef.value?.init();
      break;
    case 'newsFavorites':
      newsFavoritesTabRef.value?.init();
      break;
  }
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
        <ProfileInfoCard :user="user" role="student" />
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
            @feedback="handleFeedback"
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
