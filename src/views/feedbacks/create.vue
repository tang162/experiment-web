<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElButton, ElCard, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import { createFeedbackApi, getMyAppointmentsApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';

const router = useRouter();
const route = useRoute();

const formRef = ref(null);
const appointments = ref([]);
const { loading: submitLoading, execute: submitFeedback } = useApi();
const { loading: appointmentsLoading, execute: fetchAppointments } = useApi();

// 表单数据
const form = reactive({
  appointmentId: route.query.appointmentId ? Number(route.query.appointmentId) : undefined,
  title: '',
  content: '',
});

// 表单验证规则
const rules = {
  appointmentId: [{ required: true, message: '请选择关联预约', trigger: 'change' }],
  title: [
    { required: true, message: '请输入反馈标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    { min: 10, message: '内容至少 10 个字符', trigger: 'blur' },
  ],
};

// 时间段映射
const timeSlotMap = { 0: '上午', 1: '下午', 2: '晚上' };

// 加载我的预约（只显示已通过和已完成的）
const loadAppointments = async () => {
  const {list} = await fetchAppointments(() => getMyAppointmentsApi());
  if (list && Array.isArray(list)) {
    // 只显示已通过(1)和已完成(4)的预约
    appointments.value = list.filter(item => item.status === 1 || item.status === 4);
  } else {
    appointments.value = [];
  }
};

// 格式化预约选项
const formatAppointmentLabel = (appointment) => {
  const date = appointment.appointmentDate;
  const timeSlot = timeSlotMap[appointment.timeSlot];
  const labName = appointment.lab?.name || '未知实验室';
  return `${labName} - ${date} ${timeSlot}`;
};

// 返回
const goBack = () => {
  router.back();
};

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;

  const result = await submitFeedback(() => createFeedbackApi(form));
  if (result) {
    ElMessage.success('反馈提交成功');
    router.push('/feedbacks');
  }
};

onMounted(() => {
  loadAppointments();
});
</script>

<template>
  <PageLayout title="提交反馈" description="对已通过的实验室预约提交问题反馈">
    <template #actions>
      <ElButton :icon="ArrowLeft" @click="goBack">返回</ElButton>
    </template>

    <div class="form-container">
      <ElCard>
        <ElForm
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="top"
        >
          <ElFormItem label="关联预约" prop="appointmentId">
            <ElSelect
              v-model="form.appointmentId"
              placeholder="请选择关联的预约"
              :loading="appointmentsLoading"
              class="w-full"
            >
              <ElOption
                v-for="appointment in appointments"
                :key="appointment.id"
                :label="formatAppointmentLabel(appointment)"
                :value="appointment.id"
              />
            </ElSelect>
            <div class="text-sm text-gray-500 mt-1">
              只能对已通过或已完成的预约提交反馈
            </div>
          </ElFormItem>

          <ElFormItem label="反馈标题" prop="title">
            <ElInput
              v-model="form.title"
              placeholder="请简要描述您遇到的问题"
              maxlength="100"
              show-word-limit
            />
          </ElFormItem>

          <ElFormItem label="反馈内容" prop="content">
            <ElInput
              v-model="form.content"
              type="textarea"
              :rows="6"
              placeholder="请详细描述您遇到的问题，包括时间、地点、具体情况等"
              maxlength="2000"
              show-word-limit
            />
          </ElFormItem>

          <ElFormItem>
            <div class="flex gap-3">
              <ElButton type="primary" :loading="submitLoading" @click="handleSubmit">
                提交反馈
              </ElButton>
              <ElButton @click="goBack">取消</ElButton>
            </div>
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </PageLayout>
</template>

<style scoped>
.form-container {
  max-width: 700px;
  margin: 0 auto;
}
</style>
