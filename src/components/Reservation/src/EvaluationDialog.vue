<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElDialog, ElForm, ElFormItem, ElRate, ElInput, ElButton, ElMessage } from 'element-plus';
import { ImageUpload } from '@/components';
import { createEvaluationApi } from '@/api';

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

const emit = defineEmits(['update:modelValue', 'success']);

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const formRef = ref(null);
const imageUploadRef = ref(null);
const loading = ref(false);

const form = reactive({
  overallRating: 5,
  equipmentRating: 5,
  environmentRating: 5,
  serviceRating: 5,
  comment: '',
  images: [],
});

const rules = {
  overallRating: [{ required: true, message: '请选择总体评分', trigger: 'change' }],
  comment: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
};

// 重置表单
const resetForm = () => {
  form.overallRating = 5;
  form.equipmentRating = 5;
  form.environmentRating = 5;
  form.serviceRating = 5;
  form.comment = '';
  form.images = [];
  if (imageUploadRef.value) {
    imageUploadRef.value.clearPendingFiles();
  }
};

watch(visible, (val) => {
  if (!val) {
    resetForm();
  }
});

// 提交评价
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;
    
    // 获取待上传的图片文件
    const pendingFiles = imageUploadRef.value?.getPendingFiles() || [];
    
    // 构建提交数据对象（不是FormData，upload方法会自动创建）
    const submitData = {
      appointmentId: props.appointment?.id,
      overallRating: form.overallRating,
      equipmentRating: form.equipmentRating,
      environmentRating: form.environmentRating,
      serviceRating: form.serviceRating,
      comment: form.comment,
      images: pendingFiles.map(file => file.raw || file),
    };
    
    await createEvaluationApi(submitData);
    ElMessage.success('评价提交成功');
    visible.value = false;
    emit('success');
  } catch (error) {
    if (error !== 'cancel' && error?.message) {
      ElMessage.error(error.message || '提交失败');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <ElDialog
    v-model="visible"
    title="评价实验室"
    width="600px"
    :close-on-click-modal="false"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="100px">
      <ElFormItem label="实验室">
        <span class="font-medium">{{ appointment?.lab?.name || appointment?.labName }}</span>
      </ElFormItem>
      
      <ElFormItem label="总体评分" prop="overallRating">
        <ElRate v-model="form.overallRating" show-text :texts="['很差', '较差', '一般', '较好', '很好']" />
      </ElFormItem>
      
      <ElFormItem label="设备评分">
        <ElRate v-model="form.equipmentRating" />
      </ElFormItem>
      
      <ElFormItem label="环境评分">
        <ElRate v-model="form.environmentRating" />
      </ElFormItem>
      
      <ElFormItem label="服务评分">
        <ElRate v-model="form.serviceRating" />
      </ElFormItem>
      
      <ElFormItem label="评价内容" prop="comment">
        <ElInput
          v-model="form.comment"
          type="textarea"
          :rows="4"
          placeholder="请输入您对实验室的评价..."
          maxlength="500"
          show-word-limit
        />
      </ElFormItem>
      
      <ElFormItem label="上传图片">
        <ImageUpload
          ref="imageUploadRef"
          v-model="form.images"
          :limit="5"
          :max-size="5"
        />
        <div class="text-gray-400 text-xs mt-1">最多上传5张图片，每张不超过5MB</div>
      </ElFormItem>
    </ElForm>
    
    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" :loading="loading" @click="handleSubmit">
        提交评价
      </ElButton>
    </template>
  </ElDialog>
</template>
