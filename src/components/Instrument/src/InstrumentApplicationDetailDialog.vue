<script setup>
import { computed } from 'vue';
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElTag, ElButton, ElAlert, ElMessage, ElMessageBox } from 'element-plus';
import { returnInstrumentApi } from '@/api';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'return-success']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 状态映射: 0-待审核,1-已通过,2-已拒绝,3-已归还
const statusMap = {
  0: { label: '待审核', type: 'warning' },
  1: { label: '已通过', type: 'success' },
  2: { label: '已拒绝', type: 'danger' },
  3: { label: '已归还', type: 'info' },
};

const statusInfo = computed(() => {
  if (!props.application) return { label: '未知', type: 'info' };
  return statusMap[props.application.status] || { label: '未知', type: 'info' };
});

// 格式化时间
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  return new Date(dateString).toLocaleString('zh-CN');
};

const handleClose = () => {
  emit('close');
  dialogVisible.value = false;
};

// 归还仪器
const handleReturn = async () => {
  if (!props.application) return;

  try {
    await ElMessageBox.confirm('确定要归还此仪器吗？归还后仪器将恢复为正常状态，其他人可以申请使用。', '确认归还', {
      confirmButtonText: '确定归还',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await returnInstrumentApi(props.application.id);
    ElMessage.success('归还成功');
    
    // 更新本地申请状态
    if (props.application) {
      props.application.status = 3; // 更新为已归还状态
    }
    
    // 触发刷新
    emit('return-success');
    handleClose();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || '归还失败');
    }
  }
};
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="application ? `仪器申请详情 #${application.id}` : '仪器申请详情'"
    width="800px"
    @close="handleClose"
  >
    <div v-if="application" class="space-y-4">
      <!-- 基本信息 -->
      <div>
        <h3 class="text-lg font-semibold mb-3 flex items-center justify-between">
          <span>基本信息</span>
          <ElTag :type="statusInfo.type">
            {{ statusInfo.label }}
          </ElTag>
        </h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="申请ID">
            {{ application.id }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="申请人">
            {{ application.user?.username || '未知' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="申请状态">
            <ElTag :type="statusInfo.type" size="small">
              {{ statusInfo.label }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="申请时间">
            {{ formatDate(application.createdAt) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 仪器信息 -->
      <div v-if="application.instrument">
        <h3 class="text-lg font-semibold mb-3">仪器信息</h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="仪器名称" :span="2">
            {{ application.instrument.name }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="仪器型号">
            {{ application.instrument.model || '未知' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="序列号">
            {{ application.instrument.serialNumber || '未设置' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="application.instrument.lab" label="所属实验室" :span="2">
            {{ application.instrument.lab.name }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="application.instrument.description" label="仪器描述" :span="2">
            {{ application.instrument.description }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 申请详情 -->
      <div>
        <h3 class="text-lg font-semibold mb-3">申请详情</h3>
        <ElDescriptions :column="1" border>
          <ElDescriptionsItem label="使用目的">
            {{ application.purpose || '未填写' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="application.description" label="详细说明">
            {{ application.description }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="使用时间">
            {{ formatDate(application.startTime) }} 至 {{ formatDate(application.endTime) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="application.status === 2 && application.rejectionReason" label="拒绝原因">
            <ElAlert type="error" :closable="false">
              {{ application.rejectionReason }}
            </ElAlert>
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 审核信息 -->
      <div v-if="application.reviewer || application.reviewTime">
        <h3 class="text-lg font-semibold mb-3">审核信息</h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem v-if="application.reviewer" label="审核人">
            {{ application.reviewer?.username }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="application.reviewTime" label="审核时间">
            {{ formatDate(application.reviewTime) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 时间信息 -->
      <div>
        <h3 class="text-lg font-semibold mb-3">时间信息</h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="创建时间">
            {{ formatDate(application.createdAt) }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="更新时间">
            {{ formatDate(application.updatedAt) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <ElButton @click="handleClose">关闭</ElButton>
        <ElButton
          v-if="application && application.status === 1"
          type="success"
          @click="handleReturn"
        >
          归还仪器
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
