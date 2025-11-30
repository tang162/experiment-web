<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElTable, ElTableColumn, ElTag, ElButton, ElPagination, ElEmpty } from 'element-plus';
import { getMyRepairsApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi, usePagination } from '@/composables';

const router = useRouter();

const repairs = ref([]);
const total = ref(0);

const { loading, execute: fetchRepairs } = useApi();
const { pagination, handlePageChange } = usePagination({
  initialPage: 1,
  initialPageSize: 10,
  totalItems: total,
});

// 状态映射
const statusMap = {
  0: { label: '待处理', type: 'warning' },
  1: { label: '处理中', type: 'primary' },
  2: { label: '已完成', type: 'success' },
  3: { label: '已取消', type: 'info' },
};

// 故障类型映射
const faultTypeMap = {
  0: '硬件故障',
  1: '软件故障',
  2: '性能问题',
  3: '其他',
};

// 紧急程度映射
const urgencyMap = {
  1: { label: '低', type: 'info' },
  2: { label: '中', type: 'warning' },
  3: { label: '高', type: 'danger' },
};

// 加载维修记录
const loadRepairs = async () => {
  const result = await fetchRepairs(() =>
    getMyRepairsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
  );

  if (result) {
    repairs.value = result.list || [];
    total.value = result.total || 0;
  }
};

// 格式化时间
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN');
};

// 查看仪器详情
const viewInstrument = (instrumentId) => {
  router.push(`/lab/instruments/${instrumentId}`);
};

onMounted(() => {
  loadRepairs();
});
</script>

<template>
  <PageLayout title="我的维修记录" description="查看您提交的设备维修记录" :loading="loading">
    <div class="bg-white rounded-lg shadow-md p-6">
      <ElTable :data="repairs" stripe style="width: 100%">
        <ElTableColumn prop="id" label="维修ID" width="80" />
        <ElTableColumn prop="instrument" label="仪器名称" min-width="150">
          <template #default="{ row }">
            <ElButton link type="primary" @click="viewInstrument(row.instrument.id)">
              {{ row.instrument.name }}
            </ElButton>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="faultType" label="故障类型" width="120">
          <template #default="{ row }">
            {{ faultTypeMap[row.faultType] || '未知' }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="description" label="故障描述" min-width="200" show-overflow-tooltip />
        <ElTableColumn prop="urgency" label="紧急程度" width="100">
          <template #default="{ row }">
            <ElTag :type="urgencyMap[row.urgency]?.type" size="small">
              {{ urgencyMap[row.urgency]?.label }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="statusMap[row.status]?.type" size="small">
              {{ statusMap[row.status]?.label }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="报修时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </ElTableColumn>
      </ElTable>

      <!-- 分页 -->
      <div v-if="total > pagination.pageSize" class="flex justify-center mt-6">
        <ElPagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 空状态 -->
      <ElEmpty v-if="repairs.length === 0 && !loading" description="暂无维修记录" />
    </div>
  </PageLayout>
</template>
