<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElMessage,
  ElRadioGroup,
  ElRadio,
} from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { reportInstrumentRepairApi } from '@/api/modules/instrument.api';
import { PageLayout } from '@/components';
import { FAULT_TYPE_MAP, URGENCY_LEVEL_MAP } from '@/types/instrument';

const router = useRouter();
const route = useRoute();

// 报修表单
const repairForm = reactive({
  faultType: 0,
  description: '',
  urgency: 1,
});

const formRef = ref();
const submitting = ref(false);

// 表单验证规则
const rules = {
  faultType: [{ required: true, message: '请选择故障类型', trigger: 'change' }],
  description: [
    { required: true, message: '请输入故障描述', trigger: 'blur' },
    { min: 10, message: '故障描述至少10个字符', trigger: 'blur' },
  ],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
};

// 提交报修
const submitRepair = async () => {
  try {
    await formRef.value?.validate();

    const instrumentId = route.query.instrumentId;
    if (!instrumentId) {
      ElMessage.error('缺少仪器ID参数');
      return;
    }

    submitting.value = true;
    await reportInstrumentRepairApi(Number(instrumentId), repairForm);
    ElMessage.success('报修成功');
    router.back();
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
};

// 获取故障类型选项
const faultTypeOptions = Object.entries(FAULT_TYPE_MAP).map(([value, info]) => ({
  value: Number(value),
  label: info.label,
}));

// 获取紧急程度选项
const urgencyOptions = Object.entries(URGENCY_LEVEL_MAP).map(([value, info]) => ({
  value: Number(value),
  label: info.label,
}));
</script>

<template>
  <PageLayout title="设备报修" description="报告仪器故障，我们会尽快处理">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
      </div>

      <!-- 报修表单 -->
      <ElForm ref="formRef" :model="repairForm" :rules="rules" label-width="120px" label-position="right">
        <ElFormItem label="故障类型" prop="faultType">
          <ElSelect v-model="repairForm.faultType" placeholder="请选择故障类型" style="width: 100%">
            <ElOption v-for="option in faultTypeOptions" :key="option.value" :label="option.label"
              :value="option.value" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="故障描述" prop="description">
          <ElInput v-model="repairForm.description" type="textarea" :rows="6"
            placeholder="请详细描述故障情况，包括故障现象、发生时间等信息（至少10个字符）" maxlength="500" show-word-limit />
        </ElFormItem>

        <ElFormItem label="紧急程度" prop="urgency">
          <ElRadioGroup v-model="repairForm.urgency">
            <ElRadio v-for="option in urgencyOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </ElRadio>
          </ElRadioGroup>
        </ElFormItem>

        <ElFormItem>
          <div class="flex gap-4">
            <ElButton type="primary" :loading="submitting" @click="submitRepair">
              提交报修
            </ElButton>
            <ElButton @click="resetForm">重置</ElButton>
          </div>
        </ElFormItem>
      </ElForm>

      <!-- 提示信息 -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 class="text-sm font-semibold text-blue-900 mb-2">报修说明</h4>
        <ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>请详细描述故障现象，以便维修人员快速定位问题</li>
          <li>紧急故障会优先处理，请根据实际情况选择紧急程度</li>
          <li>提交后可在"我的报修"中查看处理进度</li>
          <li>如有疑问，请联系实验室管理员</li>
        </ul>
      </div>
    </div>
  </PageLayout>
</template>
