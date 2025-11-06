<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { labApi } from '@/api';
import { LabStatus, type Lab, type LabFilter } from '@/types';

const router = useRouter();
const route = useRoute();

const labs = ref<Lab[]>([]);
const total = ref(0);
const loading = ref(false);

const pagination = reactive({
  page: 1,
  pageSize: 12,
});

const filters = reactive<LabFilter>({
  keyword: (route.query.keyword as string) || '',
  department: (route.query.department as string) || '',
  equipmentType: (route.query.equipmentType as string) || '',
  status: (route.query.status as LabStatus) || undefined,
  minCapacity: undefined,
  maxCapacity: undefined,
});

const departments = ref<string[]>(['计算机学院', '电子工程学院', '机械学院', '化学学院', '物理学院']);
const equipmentTypes = ref<string[]>(['计算机', '示波器', '显微镜', '3D打印机', '激光设备']);

const fetchLabs = async () => {
  loading.value = true;
  try {
    const response = await labApi.getLabList({
      ...filters,
      ...pagination,
    });
    labs.value = response.list;
    total.value = response.total;
  } catch (error) {
    console.error('获取实验室列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.page = page;
  fetchLabs();
};

const handleFilter = () => {
  pagination.page = 1;
  fetchLabs();
};

const resetFilters = () => {
  filters.keyword = '';
  filters.department = '';
  filters.equipmentType = '';
  filters.status = undefined;
  filters.minCapacity = undefined;
  filters.maxCapacity = undefined;
  handleFilter();
};

const goToDetail = (id: string | number) => {
  router.push(`/labs/${id}`);
};

const toggleFavorite = async (lab: Lab, event: Event) => {
  event.stopPropagation();
  try {
    await labApi.toggleFavorite(lab.id);
    lab.isFavorite = !lab.isFavorite;
  } catch (error) {
    console.error('收藏操作失败:', error);
  }
};

onMounted(() => {
  fetchLabs();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">实验室预约</h1>
        <p class="text-gray-600">选择适合您的实验室</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <el-input
            v-model="filters.keyword"
            placeholder="搜索实验室名称"
            clearable
          />
          
          <el-select
            v-model="filters.department"
            placeholder="选择院系"
            clearable
          >
            <el-option
              v-for="dept in departments"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>

          <el-select
            v-model="filters.equipmentType"
            placeholder="设备类型"
            clearable
          >
            <el-option
              v-for="type in equipmentTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>

          <el-select
            v-model="filters.status"
            placeholder="状态"
            clearable
          >
            <el-option label="可用" :value="LabStatus.AVAILABLE" />
            <el-option label="已占用" :value="LabStatus.OCCUPIED" />
            <el-option label="维护中" :value="LabStatus.MAINTENANCE" />
          </el-select>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">容量范围：</span>
            <el-input-number
              v-model="filters.minCapacity"
              :min="0"
              :max="1000"
              placeholder="最小"
              controls-position="right"
              style="width: 120px"
            />
            <span class="text-gray-400">-</span>
            <el-input-number
              v-model="filters.maxCapacity"
              :min="0"
              :max="1000"
              placeholder="最大"
              controls-position="right"
              style="width: 120px"
            />
          </div>

          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>

      <div v-loading="loading" class="min-h-[400px]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          <div
            v-for="lab in labs"
            :key="lab.id"
            class="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            @click="goToDetail(lab.id)"
          >
            <div class="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative">
              <el-icon :size="64" color="white">
                <School />
              </el-icon>
              <div
                class="absolute top-3 right-3 cursor-pointer"
                @click="(e) => toggleFavorite(lab, e)"
              >
                <el-icon :size="24" :color="lab.isFavorite ? '#f56c6c' : 'white'">
                  <Star :filled="lab.isFavorite" />
                </el-icon>
              </div>
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-bold text-gray-900 truncate">{{ lab.name }}</h3>
                <el-tag size="small" :type="lab.status === LabStatus.AVAILABLE ? 'success' : lab.status === LabStatus.OCCUPIED ? 'warning' : 'info'">
                  {{ lab.status === LabStatus.AVAILABLE ? '可用' : lab.status === LabStatus.OCCUPIED ? '占用' : '维护中' }}
                </el-tag>
              </div>
              <p class="text-sm text-gray-600 mb-3 truncate">{{ lab.department }}</p>
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span class="flex items-center">
                  <el-icon class="mr-1"><User /></el-icon>
                  {{ lab.capacity }}人
                </span>
                <span class="flex items-center">
                  <el-icon class="mr-1"><Star /></el-icon>
                  {{ lab.rating?.toFixed(1) || '暂无' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="labs.length === 0 && !loading" class="text-center py-12">
          <el-empty description="暂无实验室" />
        </div>

        <div v-if="total > pagination.pageSize" class="flex justify-center">
          <el-pagination
            v-model:current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="total"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
