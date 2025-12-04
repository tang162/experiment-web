<script setup>
import { computed } from 'vue';
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElTag, ElButton, ElImage, ElMessage, ElMessageBox } from 'element-plus';
import { cancelRepairApi } from '@/api';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  repair: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'cancel-success']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 状态映射: 0-待处理,1-处理中,2-已完成,3-已取消
const statusMap = {
  0: { label: '待处理', type: 'warning' },
  1: { label: '处理中', type: 'primary' },
  2: { label: '已完成', type: 'success' },
  3: { label: '已取消', type: 'info' },
};

// 故障类型映射
const faultTypeMap = {
  0: '硬件故障',
  1: '软件故障',
  2: '性能问题',
  3: '其他',
};

// 紧急程度映射
const urgencyMap = {
  1: { label: '低', type: 'info' },
  2: { label: '中', type: 'warning' },
  3: { label: '高', type: 'danger' },
};

const statusInfo = computed(() => {
  if (!props.repair) return { label: '未知', type: 'info' };
  return statusMap[props.repair.status] || { label: '未知', type: 'info' };
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

// 是否可以取消（待处理状态）
const canCancel = computed(() => {
  return props.repair && props.repair.status === 0;
});

// 取消报修
const handleCancel = async () => {
  if (!props.repair) return;

  try {
    await ElMessageBox.confirm('确定要取消此报修记录吗？', '确认取消', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await cancelRepairApi(props.repair.id);
    ElMessage.success('取消成功');
    
    // 更新本地状态
    if (props.repair) {
      props.repair.status = 3; // 更新为已取消状态
    }
    
    // 触发刷新
    emit('cancel-success');
    handleClose();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || '取消失败');
    }
  }
};
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="repair ? `报修详情 #${repair.id}` : '报修详情'"
    width="800px"
    @close="handleClose"
  >
    <div v-if="repair" class="space-y-4">
      <!-- 基本信息 -->
      <div>
        <h3 class="text-lg font-semibold mb-3 flex items-center justify-between">
          <span>基本信息</span>
          <ElTag :type="statusInfo.type">
            {{ statusInfo.label }}
          </ElTag>
        </h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="报修ID">
            {{ repair.id }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="报修人">
            {{ repair.user?.username || '未知' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="报修状态">
            <ElTag :type="statusInfo.type" size="small">
              {{ statusInfo.label }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="报修时间">
            {{ formatDate(repair.createdAt) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 仪器信息 -->
      <div v-if="repair.instrument">
        <h3 class="text-lg font-semibold mb-3">仪器信息</h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="仪器名称" :span="2">
            {{ repair.instrument.name }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="仪器型号">
            {{ repair.instrument.model || '未知' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="序列号">
            {{ repair.instrument.serialNumber || '未设置' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem v-if="repair.instrument.lab" label="所属实验室" :span="2">
            {{ repair.instrument.lab.name }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 故障详情 -->
      <div>
        <h3 class="text-lg font-semibold mb-3">故障详情</h3>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="故障类型">
            {{ faultTypeMap[repair.faultType] || '未知' }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="紧急程度">
            <ElTag :type="urgencyMap[repair.urgency]?.type" size="small">
              {{ urgencyMap[repair.urgency]?.label || '未知' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="故障描述" :span="2">
            {{ repair.description || '无' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>

      <!-- 故障图片 -->
      <div v-if="repair.images && repair.images.length > 0">
        <h3 class="text-lg font-semibold mb-3">故障图片</h3>
        <div class="grid grid-cols-3 gap-4">
          <ElImage
            v-for="(image, index) in repair.images"
            :key="index"
            :src="image"
            :preview-src-list="repair.images"
            :initial-index="index"
            fit="cover"
            class="w-full h-32 rounded cursor-pointer"
          />
        </div>
      </div>

      <!-- 处理信息 -->
      <div v-if="repair.status !== 0">
        <h3 class="text-lg font-semibold mb-3">处理信息</h3>
        <ElDescriptions :column="1" border>
          <ElDescriptionsItem v-if="repair.summary" label="处理说明">
            {{ repair.summary }}
          </ElDescriptionsItem>
          <ElDescriptionsItem label="更新时间">
            {{ formatDate(repair.updatedAt) }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <ElButton @click="handleClose">关闭</ElButton>
        <ElButton
          v-if="canCancel"
          type="danger"
          @click="handleCancel"
        >
          取消报修
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
