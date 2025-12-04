<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElTag, ElMessage, ElSwitch } from 'element-plus';
import { getLabDetailApi, createLabApi, updateLabApi, getInstrumentsOptionsApi } from '@/api';
import { PageLayout, ImageUpload } from '@/components';
import { useForm } from '@/composables';


const router = useRouter();
const route = useRoute();
const isEdit = computed(() => !!route.params.id);
const title = computed(() => isEdit.value ? '编辑实验室' : '新建实验室');

// 判断是否从个人中心跳转过来
const fromProfile = computed(() => {
  return route.name === 'LabCreateSimple' || route.name === 'LabEditSimple';
});

// 仪器列表
const instrumentOptions = ref([]);
const instrumentLoading = ref(false);

// 图片上传组件引用
const imageUploadRef = ref(null);

const tagInput = ref('');

const rules = {
  name: [
    { required: true, message: '请输入实验室名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '请输入实验室位置', trigger: 'blur' },
  ],
  department: [
    { required: true, message: '请选择所属院系', trigger: 'change' },
  ],
  capacity: [
    { required: true, message: '请输入实验室容量', trigger: 'blur' },
    { type: 'number', min: 1, message: '容量至少为1', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
};

// 提交成功后的跳转路径
const getRedirectPath = () => {
  if (fromProfile.value) {
    return '/profile';
  }
  return '/labs/admin';
};

const { formRef, form: labForm, loading, handleSubmit } = useForm({
  initialValues: {
    name: '',
    location: '',
    capacity: 1,
    status: 0,
    department: '',
    tags: [],
    description: '',
    images: [],
    instrumentIds: [],
  },
  rules,
  onSubmit: async (values) => {
    // 获取待上传的图片文件
    const pendingFiles = imageUploadRef.value?.getPendingFiles() || [];

    const {tags,...newData}=values
    
    // 构建提交数据
    const submitData = {
      ...newData,
      tags: JSON.stringify(tags ??[]),
      // 只保留已上传的图片URL
      images: values.images.filter(img => typeof img === 'string' && img.startsWith('http')),
      // 添加待上传的文件
      imageFiles: pendingFiles,
    };

    if (isEdit.value) {
      await updateLabApi(Number(route.params.id), submitData);
      ElMessage.success('更新成功');
    } else {
      await createLabApi(submitData);
      ElMessage.success('创建成功');
    }
    router.push(getRedirectPath());
  },
  onError: (error) => {
    ElMessage.error(error.message || '操作失败');
  },
});

const departments = [
  '计算机科学与技术学院',
  '电子信息工程学院',
  '机械工程学院',
  '材料科学与工程学院',
  '化学与化工学院',
  '生命科学学院',
  '物理学院',
  '数学学院',
  '外国语学院',
  '经济管理学院',
];

// 加载仪器列表
const loadInstruments = async (keyword = '') => {
  instrumentLoading.value = true;
  try {
    const result = await getInstrumentsOptionsApi({ keyword, pageSize: 100 });
    instrumentOptions.value = result.list  || [];
  } catch (error) {
    console.error('加载仪器列表失败:', error);
  } finally {
    instrumentLoading.value = false;
  }
};

const loadLabDetail = async () => {
  if (!isEdit.value) return;

  try {
    // 使用详情接口获取实验室信息
    const lab = await getLabDetailApi(Number(route.params.id));
    if (lab) {
      // 获取已关联的仪器ID
      const instrumentIds = lab.instruments?.map(i => i.id) || [];
      
      // 将已关联的仪器添加到选项列表中（避免编辑时看不到已选中的仪器）
      if (lab.instruments && lab.instruments.length > 0) {
        const existingIds = new Set(instrumentOptions.value.map(i => i.id));
        lab.instruments.forEach(instrument => {
          if (!existingIds.has(instrument.id)) {
            instrumentOptions.value.push({ id: instrument.id, name: instrument.name });
          }
        });
      }
      
      Object.assign(labForm, {
        name: lab.name,
        location: lab.location,
        capacity: lab.capacity,
        status: lab.status,
        department: lab.department,
        tags: lab.tags || [],
        description: lab.description || '',
        images: lab.images || [],
        instrumentIds,
      });
    }
  } catch (error) {
    ElMessage.error('加载实验室信息失败');
    router.push(getRedirectPath());
  }
};

// 远程搜索仪器
const remoteSearchInstruments = (query) => {
  loadInstruments(query);
};

const addTag = () => {
  if (tagInput.value.trim() && !labForm.tags?.includes(tagInput.value.trim())) {
    labForm.tags.push(tagInput.value.trim());
    tagInput.value = '';
  }
};

const removeTag = (index) => {
  labForm.tags.splice(index, 1);
};

// 处理图片变化（包括删除）
const handleImageChange = (images) => {
  labForm.images = images;
};

onMounted(() => {
  loadInstruments();
  loadLabDetail();
});
</script>

<template>
  <PageLayout :title="title" max-width="2xl">
    <div class="bg-white rounded-lg shadow-md p-8">
      <ElForm ref="formRef" :model="labForm" :rules="rules" label-width="120px" size="large">
        <ElFormItem label="实验室名称" prop="name">
          <ElInput v-model="labForm.name" placeholder="请输入实验室名称" />
        </ElFormItem>

        <ElFormItem label="实验室位置" prop="location">
          <ElInput v-model="labForm.location" placeholder="请输入实验室位置" />
        </ElFormItem>

        <ElFormItem label="所属院系" prop="department">
          <ElSelect v-model="labForm.department" placeholder="请选择所属院系" style="width: 100%">
            <ElOption v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="实验室容量" prop="capacity">
          <ElInput-number v-model="labForm.capacity" :min="1" :max="200" />
        </ElFormItem>

        <ElFormItem label="状态" prop="status">
          <ElSelect v-model="labForm.status" placeholder="请选择状态" style="width: 100%">
            <ElOption :label="'正常'" :value="0" />
            <ElOption :label="'维护中'" :value="1" />
            <ElOption :label="'停用'" :value="2" />
          </ElSelect>
        </ElFormItem>

        <ElFormItem label="关联仪器">
          <ElSelect
            v-model="labForm.instrumentIds"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="搜索并选择仪器"
            :remote-method="remoteSearchInstruments"
            :loading="instrumentLoading"
            style="width: 100%"
          >
            <ElOption
              v-for="item in instrumentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
          <div class="text-gray-400 text-sm mt-1">可搜索并选择多个仪器关联到此实验室</div>
        </ElFormItem>

        <ElFormItem label="标签">
          <div class="space-y-2">
            <div class="flex space-x-2">
              <ElInput v-model="tagInput" placeholder="输入标签" @keyup.enter="addTag" />
              <ElButton @click="addTag">添加</ElButton>
            </div>
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="(tag, index) in labForm.tags" :key="index" closable @close="removeTag(index)">
                {{ tag }}
              </ElTag>
            </div>
          </div>
        </ElFormItem>

        <ElFormItem label="实验室描述">
          <ElInput v-model="labForm.description" type="textarea" :rows="4" placeholder="请输入实验室描述" />
        </ElFormItem>

        <ElFormItem label="实验室图片">
          <ImageUpload 
            ref="imageUploadRef"
            v-model="labForm.images" 
            :limit="10" 
            :multiple="true" 
            @change="handleImageChange"
          />
          <div class="text-gray-400 text-sm mt-1">最多上传10张图片，支持jpg、png格式</div>
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '更新' : '创建' }}
          </ElButton>
          <ElButton @click="router.back()">取消</ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </PageLayout>
</template>