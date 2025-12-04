import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getMyAppointmentsApi,
  getMyInstrumentApplicationsApi,
  getMyFavoritesApi,
  toggleFavoriteApi,
  getMyRepairsApi,
  cancelAppointmentApi,
  getFeedbacksApi,
} from '@/api';
import { ReservationStatus } from '@/types';

/**
 * 个人中心公共逻辑
 */
export function useProfile() {
  const router = useRouter();
  const loading = ref(false);

  // 预约历史
  const appointments = ref([]);
  // 仪器申请
  const applications = ref([]);
  // 报修记录
  const repairRequests = ref([]);
  // 我的收藏
  const favorites = ref([]);
  // 我的反馈
  const feedbacks = ref([]);

  // 评价弹窗
  const evaluationDialogVisible = ref(false);
  const currentAppointmentForEvaluation = ref(null);

  // 详情弹窗
  const detailDialogVisible = ref(false);
  const currentAppointmentForDetail = ref(null);

  // 将 API 数据格式转换为组件需要的格式
  const reservations = computed(() => {
    return appointments.value?.map(item => ({
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
    })) || [];
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

  // 加载预约历史
  const fetchReservations = async () => {
    loading.value = true;
    try {
      const response = await getMyAppointmentsApi({ page: 1, pageSize: 100 });
      appointments.value = response.list || [];
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
      const response = await getMyInstrumentApplicationsApi({ page: 1, pageSize: 100 });
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
      const response = await getMyFavoritesApi({ page: 1, pageSize: 100 });
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
      const response = await getMyRepairsApi({ page: 1, pageSize: 100 });
      repairRequests.value = response.list || [];
    } catch (error) {
      console.error('获取报修记录失败:', error);
      ElMessage.error('获取报修记录失败');
    } finally {
      loading.value = false;
    }
  };

  // 加载我的反馈
  const fetchFeedbacks = async () => {
    loading.value = true;
    try {
      const response = await getFeedbacksApi({ page: 1, pageSize: 100 });
      feedbacks.value = response.list || [];
    } catch (error) {
      console.error('获取反馈记录失败:', error);
      ElMessage.error('获取反馈记录失败');
    } finally {
      loading.value = false;
    }
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

  // 查看反馈详情
  const viewFeedbackDetail = (row) => {
    router.push(`/feedbacks/${row.id}`);
  };

  // 提交反馈
  const handleFeedback = (row) => {
    router.push({
      name: 'FeedbackCreate',
      query: { appointmentId: row.id },
    });
  };

  return {
    loading,
    appointments,
    applications,
    repairRequests,
    favorites,
    feedbacks,
    reservations,
    evaluationDialogVisible,
    currentAppointmentForEvaluation,
    detailDialogVisible,
    currentAppointmentForDetail,
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
    viewFeedbackDetail,
    handleFeedback,
  };
}
