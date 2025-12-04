<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage, ElUpload } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { PageLayout } from '@/components';
import { reportInstrumentFaultApi, getInstrumentDetailApi } from '@/api';
import { useApi } from '@/composables';

const route = useRoute();
const router = useRouter();

const formRef = ref(null);
const fileList = ref([]);

// 表单数据
const formData = ref({
  faultType: 0,
  description: '',
  urgency: 2,
});

// 表单验证规则
const rules = {
  faultType: [{ required: true, message: '请选择故障类型', trigger: 'change' }],
  description: [
    { required: true, message: '请输入故障描述', trigger: 'blur' },
    { min: 10, message: '故障描述至少10个字符', trigger: 'blur' },
  ],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
};

// 故障类型选项
const faultTypeOptions = [
  { value: 0, label: '硬件故障' },
  { value: 1, label: '软件故障' },
  { value: 2, label: '性能问题' },
  { value: 3, label: '其他' },
];

// 紧急程度选项
const urgencyOptions = [
  { value: 1, label: '低' },
  { value: 2, label: '中' },
  { value: 3, label: '高' },
];

const { data: instrument, loading: loadingInstrument, execute: fetchInstrument } = useApi();
const { loading: submitting, execute: submitReport } = useApi();

// 获取仪器ID
const instrumentId = computed(() => {
  return Number(route.query.instrumentId);
});

// 加载仪器信息
const loadInstrument = async () => {
  if (!instrumentId.value) {
    ElMessage.error('缺少仪器ID参数');
    router.back();
    return;
  }

  const result = await fetchInstrument(() => getInstrumentDetailApi(instrumentId.value));
  if (result) {
    instrument.value = result;
  }
};

// 文件上传前的验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  if (fileList.value.length >= 5) {
    ElMessage.error('最多只能上传 5 张图片!');
    return false;
  }
  return true;
};

// 文件变化处理
const handleFileChange = (file, files) => {
  fileList.value = files;
};

// 移除文件
const handleRemove = (file, files) => {
  fileList.value = files;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    // 创建 FormData
    const formDataToSend = new FormData();
    formDataToSend.append('faultType', formData.value.faultType);
    formDataToSend.append('description', formData.value.description);
    formDataToSend.append('urgency', formData.value.urgency);

    // 添加图片文件
    fileList.value.forEach((file) => {
      if (file.raw) {
        formDataToSend.append('images', file.raw);
      }
    });

    const result = await submitReport(() =>
      reportInstrumentFaultApi(instrumentId.value, formDataToSend)
    );

    if (result) {
      ElMessage.success('故障报告提交成功');
      router.push('/profile?tab=repairs');
    }
  });
};

// 取消
const handleCancel = () => {
  router.back();
};

onMounted(() => {
  loadInstrument();
});
</script>

<template>
  <PageLayout
    title="报告设备故障"
    :description="instrument ? `仪器: ${instrument.name}` : ''"
    :loading="loadingInstrument"
  >
    <div class="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
      <ElForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <!-- 仪器信息 -->
        <div v-if="instrument" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">仪器信息</h3>
          <p class="text-gray-700">名称: {{ instrument.name }}</p>
          <p class="text-gray-700">型号: {{ instrument.model }}</p>
          <p class="text-gray-700">序列号: {{ instrument.serialNumber || '未设置' }}</p>
        </div>

        <!-- 故障类型 -->
        <ElFormItem label="故障类型" prop="faultType">
          <ElSelect v-model="formData.faultType" placeholder="请选择故障类型" class="w-full">
            <ElOption
              v-for="option in faultTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>

        <!-- 紧急程度 -->
        <ElFormItem label="紧急程度" prop="urgency">
          <ElSelect v-model="formData.urgency" placeholder="请选择紧急程度" class="w-full">
            <ElOption
              v-for="option in urgencyOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>

        <!-- 故障描述 -->
        <ElFormItem label="故障描述" prop="description">
          <ElInput
            v-model="formData.description"
            type="textarea"
            :rows="6"
            placeholder="请详细描述设备故障情况，至少10个字符"
            maxlength="500"
            show-word-limit
          />
        </ElFormItem>

        <!-- 上传图片 -->
        <ElFormItem label="故障图片">
          <ElUpload
            v-model:file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :limit="5"
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
          </ElUpload>
          <div class="text-sm text-gray-500 mt-2">
            支持上传最多5张图片，每张不超过5MB
          </div>
        </ElFormItem>

        <!-- 操作按钮 -->
        <ElFormItem>
          <div class="flex gap-4">
            <ElButton type="primary" :loading="submitting" @click="handleSubmit">
              提交报告
            </ElButton>
            <ElButton @click="handleCancel">取消</ElButton>
          </div>
        </ElFormItem>
      </ElForm>
    </div>
  </PageLayout>
</template>
