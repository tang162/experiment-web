<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElDatePicker,
  ElCard,
} from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { getInstrumentDetailApi, createInstrumentApplicationApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';

const router = useRouter();
const route = useRoute();

const instrumentId = computed(() => Number(route.params.id));
const { data: instrument, loading, execute: fetchInstrument } = useApi();

// 申请表单
const applicationForm = reactive({
  purpose: '',
  description: '',
  startTime: '',
  endTime: '',
});

const formRef = ref();
const submitting = ref(false);

// 时间范围 - 使用 Date 对象而不是字符串
const timeRange = ref();

// 表单验证规则
const rules = {
  purpose: [
    { required: true, message: '请输入使用目的', trigger: 'blur' },
    { min: 5, message: '使用目的至少5个字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '请输入详细说明', trigger: 'blur' },
    { min: 20, message: '详细说明至少20个字符', trigger: 'blur' },
  ],
};

// 时间范围验证
const validateTimeRange = () => {
  if (!timeRange.value || timeRange.value.length !== 2) {
    ElMessage.error('请选择使用时间范围');
    return false;
  }
  return true;
};

// 加载仪器详情
const loadInstrument = async () => {
  const result = await fetchInstrument(() =>
    getInstrumentDetailApi(instrumentId.value)
  );
  if (result) {
    instrument.value = result;
  }
};

// 提交申请
const submitApplication = async () => {
  try {
    await formRef.value?.validate();

    if (!validateTimeRange()) {
      return;
    }

    // 转换时间格式为 ISO 8601 格式 (2024-01-15T09:00:00.000Z)
    if (timeRange.value) {
      const startDate = typeof timeRange.value[0] === 'string'
        ? new Date(timeRange.value[0])
        : timeRange.value[0];
      const endDate = typeof timeRange.value[1] === 'string'
        ? new Date(timeRange.value[1])
        : timeRange.value[1];
      applicationForm.startTime = startDate.toISOString();
      applicationForm.endTime = endDate.toISOString();
    }

    submitting.value = true;
    await createInstrumentApplicationApi(instrumentId.value, applicationForm);
    ElMessage.success('申请成功，请等待审核');
    router.push('/equipment/apply');
  } catch (error) {
    if (error?.message) {
      ElMessage.error(error.message);
    }
  } finally {
    submitting.value = false;
  }
};

// 返回
const goBack = () => {
  router.back();
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  // 重置为默认2小时
  selectTimeRange(2);
};

// 快捷选择时间
const selectTimeRange = (hours) => {
  const now = new Date();
  const end = new Date(now.getTime() + hours * 60 * 60 * 1000);
  timeRange.value = [now, end];
};

onMounted(() => {
  loadInstrument();
  // 默认选择2小时
  selectTimeRange(2);
});
</script>

<template>
  <PageLayout title="申请使用仪器" :description="instrument?.name" :loading="loading">
    <div class="max-w-4xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <!-- 仪器信息卡片 -->
      <ElCard v-if="instrument" class="mb-6" shadow="hover">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">仪器信息</span>
          </div>
        </template>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-gray-600">仪器名称：</span>
            <span class="font-medium">{{ instrument.name }}</span>
          </div>
          <div>
            <span class="text-gray-600">型号：</span>
            <span class="font-medium">{{ instrument.model }}</span>
          </div>
          <div>
            <span class="text-gray-600">所属实验室：</span>
            <span class="font-medium">{{ instrument.lab.name }}</span>
          </div>
          <div>
            <span class="text-gray-600">所属院系：</span>
            <span class="font-medium">{{ instrument.lab.department }}</span>
          </div>
        </div>
      </ElCard>

      <!-- 申请表单 -->
      <ElCard shadow="hover">
        <template #header>
          <span class="text-lg font-semibold">填写申请信息</span>
        </template>

        <ElForm ref="formRef" :model="applicationForm" :rules="rules" label-width="120px" label-position="right">
          <ElFormItem label="使用时间" required>
            <div class="w-full">
              <ElDatePicker v-model="timeRange" type="datetimerange" range-separator="至" start-placeholder="开始时间"
                end-placeholder="结束时间" format="YYYY-MM-DD HH:mm"
                :disabled-date="(time) => time.getTime() < Date.now() - 86400000" style="width: 100%" />
              <div class="mt-2 flex gap-2">
                <ElButton size="small" @click="selectTimeRange(2)">2小时</ElButton>
                <ElButton size="small" @click="selectTimeRange(4)">4小时</ElButton>
                <ElButton size="small" @click="selectTimeRange(8)">8小时</ElButton>
                <ElButton size="small" @click="selectTimeRange(24)">1天</ElButton>
              </div>
            </div>
          </ElFormItem>

          <ElFormItem label="使用目的" prop="purpose">
            <ElInput v-model="applicationForm.purpose" placeholder="请输入使用目的（至少5个字符）" maxlength="100" show-word-limit />
          </ElFormItem>

          <ElFormItem label="详细说明" prop="description">
            <ElInput v-model="applicationForm.description" type="textarea" :rows="6"
              placeholder="请详细说明使用计划、实验内容等信息（至少10个字符）" maxlength="500" show-word-limit />
          </ElFormItem>

          <ElFormItem>
            <div class="flex gap-4">
              <ElButton type="primary" :loading="submitting" @click="submitApplication">
                提交申请
              </ElButton>
              <ElButton @click="resetForm">重置</ElButton>
              <ElButton @click="goBack">取消</ElButton>
            </div>
          </ElFormItem>
        </ElForm>

        <!-- 提示信息 -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 class="text-sm font-semibold text-blue-900 mb-2">申请说明</h4>
          <ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>请合理安排使用时间，避免资源浪费</li>
            <li>详细填写使用目的和说明，有助于提高审核通过率</li>
            <li>提交后可在"我的申请"中查看审核进度</li>
            <li>如需修改申请，请先取消当前申请后重新提交</li>
            <li>如有疑问，请联系实验室管理员</li>
          </ul>
        </div>
      </ElCard>
    </div>
  </PageLayout>
</template>
