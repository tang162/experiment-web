<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ElMessage,
  ElInput,
  ElInputNumber,
  ElButton,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElTag
} from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { createAppointmentApi, getLabDetailApi } from '@/api';
import type { ReservationApi, LabApi } from '@/api';
import { PageLayout } from '@/components';
import type { FormInstance, FormRules } from 'element-plus';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

// 实验室信息
const labDetail = ref<LabApi.LabDetail | null>(null);
const loadingLab = ref(false);

// 表单引用和数据
const formRef = ref<FormInstance>();
const formData = reactive<ReservationApi.CreateAppointmentParams>({
  labId: Number(route.params.id),
  appointmentDate: '',
  timeSlot: '',
  purpose: '',
  description: '',
  participantCount: 1,
});

const submitting = ref(false);

// 时间段选项 - 按照 API 定义：0-上午,1-下午,2-晚上
const timeSlotOptions = [
  { label: '上午（8:00-12:00）', value: '0' },
  { label: '下午（14:00-18:00）', value: '1' },
  { label: '晚上（19:00-22:00）', value: '2' }
];

// 禁用日期：只能预约今天及未来7天
const disabledDate = (time: Date) => {
  const today = dayjs().startOf('day');
  const maxDate = dayjs().add(7, 'day').endOf('day');
  const current = dayjs(time);
  return current.isBefore(today) || current.isAfter(maxDate);
};

// 表单验证规则
const rules: FormRules = {
  appointmentDate: [
    { required: true, message: '请选择预约日期', trigger: 'change' }
  ],
  timeSlot: [
    { required: true, message: '请选择预约时段', trigger: 'change' }
  ],
  purpose: [
    { required: true, message: '请输入预约目的', trigger: 'blur' },
    { min: 2, max: 100, message: '预约目的长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入详细说明', trigger: 'blur' },
    { min: 10, max: 500, message: '详细说明长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  participantCount: [
    { required: true, message: '请输入参与人数', trigger: 'blur' },
    { type: 'number', min: 1, message: '参与人数至少为 1 人', trigger: 'blur' }
  ]
};

// 加载实验室详情
const loadLabDetail = async () => {
  loadingLab.value = true;
  try {
    const result = await getLabDetailApi(Number(route.params.id));
    labDetail.value = result;

    // 检查实验室状态
    if (result.status !== 0) {
      ElMessage.warning('该实验室当前不可预约');
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载实验室信息失败');
  } finally {
    loadingLab.value = false;
  }
};

// 返回
const goBack = () => {
  router.back();
};

// 提交预约
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    // 检查人数是否超出实验室容量
    if (labDetail.value && formData.participantCount > labDetail.value.capacity) {
      ElMessage.warning(`参与人数不能超过实验室容量（${labDetail.value.capacity}人）`);
      return;
    }

    submitting.value = true;
    try {
      await createAppointmentApi(formData);
      ElMessage.success('预约申请已提交，请等待审核');
      router.push('/reservation/list');
    } catch (error: any) {
      ElMessage.error(error.message || '预约失败，请稍后重试');
    } finally {
      submitting.value = false;
    }
  });
};

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields();
};

// 获取状态文本
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '正常';
    case 1:
      return '维护中';
    case 2:
      return '停用';
    default:
      return '未知';
  }
};

// 获取状态类型
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'success';
    case 1:
      return 'warning';
    case 2:
      return 'danger';
    default:
      return 'info';
  }
};

onMounted(() => {
  loadLabDetail();
});
</script>

<template>
  <PageLayout title="预约实验室" :loading="loadingLab">
    <div class="space-y-6">
      <!-- 返回按钮 -->
      <div>
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <!-- 实验室信息卡片 -->
      <ElCard v-if="labDetail" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">实验室信息</span>
            <ElTag :type="getStatusType(labDetail.status)">
              {{ getStatusText(labDetail.status) }}
            </ElTag>
          </div>
        </template>
        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="实验室名称">{{ labDetail.name }}</ElDescriptionsItem>
          <ElDescriptionsItem label="所属院系">{{ labDetail.department }}</ElDescriptionsItem>
          <ElDescriptionsItem label="实验室位置">{{ labDetail.location }}</ElDescriptionsItem>
          <ElDescriptionsItem label="容纳人数">{{ labDetail.capacity }} 人</ElDescriptionsItem>
          <ElDescriptionsItem label="实验室评分">
            {{ labDetail.rating.toFixed(1) }} 分
          </ElDescriptionsItem>
          <ElDescriptionsItem label="实验室标签" :span="2">
            <ElTag
              v-for="tag in labDetail.tags"
              :key="tag"
              type="primary"
              effect="plain"
              class="mr-2"
            >
              {{ tag }}
            </ElTag>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 预约表单 -->
      <ElCard shadow="hover">
        <template #header>
          <span class="text-lg font-semibold">预约信息</span>
        </template>
        <ElForm
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="120px"
          size="large"
        >
          <ElFormItem label="预约日期" prop="appointmentDate">
            <ElDatePicker
              v-model="formData.appointmentDate"
              type="date"
              placeholder="请选择预约日期"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              :disabled="labDetail?.status !== 0"
            />
            <div class="text-sm text-gray-500 mt-1">
              可预约今天及未来7天
            </div>
          </ElFormItem>

          <ElFormItem label="预约时段" prop="timeSlot">
            <ElSelect
              v-model="formData.timeSlot"
              placeholder="请选择预约时段"
              style="width: 100%"
              :disabled="labDetail?.status !== 0"
            >
              <ElOption
                v-for="option in timeSlotOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="预约目的" prop="purpose">
            <ElInput
              v-model="formData.purpose"
              placeholder="请输入预约目的，如：课程实验、科研项目等"
              maxlength="100"
              show-word-limit
              :disabled="labDetail?.status !== 0"
            />
          </ElFormItem>

          <ElFormItem label="详细说明" prop="description">
            <ElInput
              v-model="formData.description"
              type="textarea"
              :rows="5"
              placeholder="请详细说明实验内容、所需设备等信息"
              maxlength="500"
              show-word-limit
              :disabled="labDetail?.status !== 0"
            />
          </ElFormItem>

          <ElFormItem label="参与人数" prop="participantCount">
            <ElInputNumber
              v-model="formData.participantCount"
              :min="1"
              :max="labDetail?.capacity || 100"
              :disabled="labDetail?.status !== 0"
            />
            <span v-if="labDetail" class="ml-3 text-sm text-gray-500">
              实验室容量：{{ labDetail.capacity }} 人
            </span>
          </ElFormItem>

          <ElFormItem>
            <ElButton
              type="primary"
              :loading="submitting"
              :disabled="labDetail?.status !== 0"
              @click="handleSubmit"
            >
              {{ labDetail?.status !== 0 ? '实验室不可预约' : '提交预约申请' }}
            </ElButton>
            <ElButton @click="handleReset" :disabled="submitting">
              重置
            </ElButton>
            <ElButton @click="goBack" :disabled="submitting">
              取消
            </ElButton>
          </ElFormItem>
        </ElForm>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">温馨提示：</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• 预约申请提交后需要等待管理员审核</li>
            <li>• 请确保预约信息准确无误，审核通过后不可修改</li>
            <li>• 如需取消预约，请在预约列表中操作</li>
            <li>• 请按时使用实验室，如有变更请提前取消预约</li>
          </ul>
        </div>
      </ElCard>
    </div>
  </PageLayout>
</template>

<style scoped>
:deep(.el-descriptions__label) {
  font-weight: 600;
}
</style>
