<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElButton, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElTag, ElMessage, ElSwitch } from 'element-plus';
import { getLabsApi, createLabApi, updateLabApi } from '@/api';
import { PageLayout, ImageUpload } from '@/components';
import { useForm } from '@/composables';


const router = useRouter();
const route = useRoute();
const isEdit = computed(() => !!route.params.id);
const title = computed(() => isEdit.value ? '编辑实验室' : '新建实验室');

const equipmentInput = ref('');
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
    equipmentList: [],
  },
  rules,
  onSubmit: async (values) => {
    if (isEdit.value) {
      await updateLabApi(Number(route.params.id), values);
      ElMessage.success('更新成功');
    } else {
      await createLabApi(values);
      ElMessage.success('创建成功');
    }
    router.push('/lab/labs/admin');
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

const loadLabDetail = async () => {
  if (!isEdit.value) return;

  try {
    // Get all labs and find the specific one
    const labs = await getLabsApi({});
    const lab = labs.find(l => l.id === Number(route.params.id));
    if (lab) {
      Object.assign(labForm, {
        name: lab.name,
        location: lab.location,
        capacity: lab.capacity,
        status: lab.status,
        department: lab.department,
        tags: lab.tags || [],
        description: lab.description || '',
        images: lab.images || [],
        equipmentList: lab.equipmentList || [],
      });
    }
  } catch (error) {
    ElMessage.error('加载实验室信息失败');
    router.push('/lab/labs/admin');
  }
};

const addEquipment = () => {
  if (equipmentInput.value.trim() && !labForm.equipmentList?.includes(equipmentInput.value.trim())) {
    labForm.equipmentList.push(equipmentInput.value.trim());
    equipmentInput.value = '';
  }
};

const removeEquipment = (index) => {
  labForm.equipmentList.splice(index, 1);
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

const handleImageChange = (images) => {
  labForm.images = images;
};

onMounted(() => {
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

        <ElFormItem label="设备列表">
          <div class="space-y-2">
            <div class="flex space-x-2">
              <ElInput v-model="equipmentInput" placeholder="输入设备名称" @keyup.enter="addEquipment" />
              <ElButton @click="addEquipment">添加</ElButton>
            </div>
            <div class="flex flex-wrap gap-2">
              <ElTag v-for="(equipment, index) in labForm.equipmentList" :key="index" closable
                @close="removeEquipment(index)">
                {{ equipment }}
              </ElTag>
            </div>
          </div>
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
          <ImageUpload v-model="labForm.images" :limit="5" :multiple="true" @change="handleImageChange" />
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