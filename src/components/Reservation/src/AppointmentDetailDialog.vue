<script setup>
import { ref, computed, watch } from 'vue';
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElTag, ElRate, ElImage, ElEmpty, ElDivider, ElButton } from 'element-plus';
import ReservationStatusTag from './ReservationStatusTag.vue';
import { getEvaluationByAppointmentApi } from '@/api';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  appointment: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const evaluation = ref(null);
const loadingEvaluation = ref(false);

// 时间段映射
const timeSlotMap = {
  0: '上午',
  1: '下午',
  2: '晚上',
  MORNING: '上午',
  AFTERNOON: '下午',
  EVENING: '晚上',
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('zh-CN');
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 获取评价信息
const fetchEvaluation = async () => {
  if (!props.appointment?.id) return;
  
  loadingEvaluation.value = true;
  try {
    const result = await getEvaluationByAppointmentApi(props.appointment.id);
    evaluation.value = result;
  } catch (error) {
    evaluation.value = null;
  } finally {
    loadingEvaluation.value = false;
  }
};

watch(visible, (val) => {
  if (val && props.appointment) {
    fetchEvaluation();
  } else {
    evaluation.value = null;
  }
});

// 获取完整图片URL
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // 静态文件直接使用相对路径，vite代理会处理
  return url;
};
</script>

<template>
  <ElDialog
    v-model="visible"
    title="预约详情"
    width="700px"
  >
    <div v-if="appointment">
      <!-- 基本信息 -->
      <ElDescriptions :column="2" border>
        <ElDescriptionsItem label="预约ID">{{ appointment.id }}</ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ReservationStatusTag :status="appointment.status" />
        </ElDescriptionsItem>
        <ElDescriptionsItem label="实验室">
          {{ appointment.lab?.name || appointment.labName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="位置">
          {{ appointment.lab?.location || '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预约日期">
          {{ formatDate(appointment.appointmentDate || appointment.date) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="时间段">
          {{ timeSlotMap[appointment.timeSlot] || appointment.timeSlot }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="参与人数">
          {{ appointment.participantCount }}人
        </ElDescriptionsItem>
        <ElDescriptionsItem label="申请时间">
          {{ formatDateTime(appointment.createdAt) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="预约目的" :span="2">
          {{ appointment.purpose }}
        </ElDescriptionsItem>
        <ElDescriptionsItem v-if="appointment.description" label="详细描述" :span="2">
          {{ appointment.description }}
        </ElDescriptionsItem>
        <ElDescriptionsItem v-if="appointment.rejectionReason" label="拒绝原因" :span="2">
          <span class="text-red-500">{{ appointment.rejectionReason }}</span>
        </ElDescriptionsItem>
      </ElDescriptions>

      <!-- 评价信息 -->
      <ElDivider content-position="left">评价信息</ElDivider>
      
      <div v-loading="loadingEvaluation">
        <div v-if="evaluation" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <span class="text-gray-600 w-20">总体评分：</span>
              <ElRate v-model="evaluation.overallRating" disabled />
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-20">设备评分：</span>
              <ElRate v-model="evaluation.equipmentRating" disabled />
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-20">环境评分：</span>
              <ElRate v-model="evaluation.environmentRating" disabled />
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-20">服务评分：</span>
              <ElRate v-model="evaluation.serviceRating" disabled />
            </div>
          </div>
          
          <div>
            <span class="text-gray-600">评价内容：</span>
            <p class="mt-2 text-gray-800 bg-gray-50 p-3 rounded">{{ evaluation.comment || '无' }}</p>
          </div>
          
          <div v-if="evaluation.images && evaluation.images.length > 0">
            <span class="text-gray-600">评价图片：</span>
            <div class="flex flex-wrap gap-2 mt-2">
              <ElImage
                v-for="(img, index) in evaluation.images"
                :key="index"
                :src="getImageUrl(img)"
                :preview-src-list="evaluation.images.map(getImageUrl)"
                :initial-index="index"
                fit="cover"
                class="w-24 h-24 rounded"
              />
            </div>
          </div>
          
          <div class="text-gray-400 text-sm">
            评价时间：{{ formatDateTime(evaluation.createdAt) }}
          </div>
        </div>
        
        <ElEmpty v-else description="暂无评价" />
      </div>
    </div>
    
    <template #footer>
      <ElButton @click="visible = false">关闭</ElButton>
    </template>
  </ElDialog>
</template>
