<script setup>
import { ref, reactive } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElRow, ElCol, ElMessage, ElMessageBox } from 'element-plus';
import { StatusTag } from '@/components';

const props = defineProps({
  // 审核数据（预约或申请）
  data: {
    type: Object,
    required: true,
  },
  // 审核类型
  type: {
    type: String,
    default: 'reservation',
    // 可选值: reservation, application
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否显示详情
  showDetails: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['approve', 'reject']);

// 审核表单
const reviewForm = reactive({
  reason: '',
});

// 处理通过
const handleApprove = async () => {
  try {
    await ElMessageBox.confirm('确定要通过此审核吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success',
    });
    emit('approve', props.data);
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 处理驳回
const handleReject = async () => {
  if (!reviewForm.reason.trim()) {
    ElMessage.warning('请输入驳回原因');
    return;
  }

  try {
    await ElMessageBox.confirm('确定要驳回此审核吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    emit('reject', props.data, reviewForm.reason);
    reviewForm.reason = '';
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
};

// 获取详情标签
const getDetailLabels = () => {
  if (props.type === 'reservation') {
    return [
      { label: '实验室', key: 'labName' },
      { label: '申请人', key: 'userName' },
      { label: '预约日期', key: 'appointmentDate' },
      { label: '时间段', key: 'timeSlot' },
      { label: '人数', key: 'participantCount' },
      { label: '预约目的', key: 'purpose' },
    ];
  } else {
    return [
      { label: '申请类型', key: 'type' },
      { label: '申请项目', key: 'itemName' },
      { label: '申请人', key: 'userName' },
      { label: '用途', key: 'purpose' },
      { label: '使用时段', key: 'timeSlot' },
      { label: '详细说明', key: 'description' },
    ];
  }
};

// 格式化值
const formatValue = (key, value) => {
  if (key === 'appointmentDate') {
    return new Date(value).toLocaleDateString('zh-CN');
  }
  if (key === 'type') {
    const typeMap = { equipment: '设备申请', instrument: '仪器申请' };
    return typeMap[value] || value;
  }
  return value;
};
</script>

<template>
  <div class="review-panel">
    <!-- 审核数据详情 -->
    <div v-if="showDetails" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-bold text-gray-900 mb-4">审核信息</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="detail in getDetailLabels()" :key="detail.key" class="flex flex-col">
          <span class="text-sm text-gray-600 font-semibold">{{ detail.label }}</span>
          <span class="text-gray-900 mt-1">
            {{ formatValue(detail.key, data[detail.key]) || '未设置' }}
          </span>
        </div>
      </div>

      <!-- 状态 -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <span class="text-sm text-gray-600 font-semibold">当前状态</span>
        <div class="mt-1">
          <StatusTag :status="data.status" />
        </div>
      </div>
    </div>

    <!-- 审核表单 -->
    <div class="review-form p-4 bg-white rounded-lg border border-gray-200">
      <h3 class="text-lg font-bold text-gray-900 mb-4">审核意见</h3>
      <ElForm :model="reviewForm" label-width="80px">
        <ElFormItem label="驳回原因" prop="reason">
          <ElInput
            v-model="reviewForm.reason"
            type="textarea"
            :rows="3"
            placeholder="如果驳回，请输入驳回原因"
            :disabled="loading"
          />
        </ElFormItem>
      </ElForm>

      <!-- 操作按钮 -->
      <div class="flex gap-2 justify-end mt-4">
        <ElButton
          type="success"
          :loading="loading"
          @click="handleApprove"
        >
          通过审核
        </ElButton>
        <ElButton
          type="danger"
          :loading="loading"
          @click="handleReject"
        >
          驳回
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.review-panel {
  width: 100%;
}
</style>
