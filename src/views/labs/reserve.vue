<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElInput, ElInputNumber, ElButton, ElForm, ElFormItem, ElRadioGroup, ElRadio, ElDatePicker, ElSelect, ElOption } from 'element-plus';
import { reservationApi } from '@/api';
import { TimeSlot, type CreateReservationForm } from '@/types';
import type { FormInstance, FormRules } from 'element-plus';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);

const reservationForm = reactive<CreateReservationForm>({
  labId: route.params.id as string,
  date: '',
  timeSlot: TimeSlot.MORNING,
  purpose: '',
  description: '',
  participantCount: 1,
});

const disabledDate = (time: Date) => {
  const today = dayjs().startOf('day');
  const maxDate = dayjs().add(7, 'day').endOf('day');
  const current = dayjs(time);
  return current.isBefore(today) || current.isAfter(maxDate);
};

const rules: FormRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  timeSlot: [{ required: true, message: '请选择时段', trigger: 'change' }],
  purpose: [{ required: true, message: '请输入实验用途', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入内容描述', trigger: 'blur' },
    { min: 10, message: '描述至少10个字符', trigger: 'blur' },
  ],
  participantCount: [
    { required: true, message: '请输入使用人数', trigger: 'blur' },
    { type: 'number', min: 1, message: '人数至少为1', trigger: 'blur' },
  ],
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    try {
      const availability = await reservationApi.checkTimeSlotAvailability(
        reservationForm.labId,
        reservationForm.date,
        reservationForm.timeSlot
      );

      if (!availability.available) {
        ElMessage.warning('该时段已被预约，请选择其他时段');
        return;
      }

      await reservationApi.createReservation(reservationForm);
      ElMessage.success('预约成功，请等待审核');
      router.push('/reservations');
    } catch (error: any) {
      ElMessage.error(error.message || '预约失败');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">预约实验室</h1>

        <ElForm ref="formRef" :model="reservationForm" :rules="rules" label-width="100px" size="large">
          <ElForm-item label="预约日期" prop="date">
            <ElDatePicker v-model="reservationForm.date" type="date" placeholder="选择日期" :disabled-date="disabledDate"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
          </ElForm-item>

          <ElForm-item label="预约时段" prop="timeSlot">
            <ElRadio-group v-model="reservationForm.timeSlot">
              <ElRadio :label="TimeSlot.MORNING">上午（8:00-12:00）</ElRadio>
              <ElRadio :label="TimeSlot.AFTERNOON">下午（14:00-18:00）</ElRadio>
              <ElRadio :label="TimeSlot.EVENING">晚上（19:00-22:00）</ElRadio>
            </ElRadio-group>
          </ElForm-item>

          <ElForm-item label="实验用途" prop="purpose">
            <ElInput v-model="reservationForm.purpose" placeholder="请输入实验用途" />
          </ElForm-item>

          <ElForm-item label="内容描述" prop="description">
            <ElInput v-model="reservationForm.description" type="textarea" :rows="4" placeholder="请详细描述实验内容" />
          </ElForm-item>

          <ElForm-item label="使用人数" prop="participantCount">
            <ElInput-number v-model="reservationForm.participantCount" :min="1" :max="100" />
          </ElForm-item>

          <ElForm-item>
            <ElButton type="primary" :loading="loading" @click="handleSubmit">
              提交预约
            </ElButton>
            <ElButton @click="router.back()">取消</ElButton>
          </ElForm-item>
        </ElForm>
      </div>
    </div>
  </div>
</template>
