<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElButton, ElTable, ElTableColumn, ElTag, ElMessage, ElMessageBox, ElPagination } from 'element-plus';
import { getLabsApi, deleteLabApi } from '@/api';
import { PageLayout } from '@/components';
import { useApi } from '@/composables';
import type { LabApi } from '@/types';

const router = useRouter();
const labs = ref<LabApi.LabListItem[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const { loading, execute: fetchLabs } = useApi<LabApi.LabListItem[]>();

const loadLabs = async () => {
  const result = await fetchLabs(() =>
    getLabsApi({
      page: currentPage.value,
      pageSize: pageSize.value,
    })
  );

  if (result) {
    labs.value = result || [];
    total.value = result?.length || 0;
  }
};

const handleCreate = () => {
  router.push('/lab/labs/admin/create');
};

const handleEdit = (lab: LabApi.LabListItem) => {
  router.push(`/lab/labs/admin/edit/${lab.id}`);
};

const handleDelete = async (lab: LabApi.LabListItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除实验室"${lab.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
    );

    await deleteLabApi(lab.id);
    ElMessage.success('删除成功');
    loadLabs();
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadLabs();
};

const getStatusTag = (status: number) => {
  const statusMap = {
    0: { type: 'success', text: '正常' },
    1: { type: 'warning', text: '维护中' },
    2: { type: 'danger', text: '停用' },
  };
  return statusMap[status as keyof typeof statusMap] || { type: 'info', text: '未知' };
};

onMounted(() => {
  loadLabs();
});
</script>

<template>
  <PageLayout title="实验室管理" description="管理所有实验室信息">
    <div class="mb-6">
      <ElButton type="primary" @click="handleCreate">
        新建实验室
      </ElButton>
    </div>

    <div class="bg-white rounded-lg shadow">
      <ElTable v-loading="loading" :data="labs" stripe>
        <ElTableColumn prop="id" label="ID" width="80" />

        <ElTableColumn prop="name" label="实验室名称" min-width="150" />

        <ElTableColumn prop="location" label="位置" width="120" />

        <ElTableColumn prop="department" label="所属院系" width="120" />

        <ElTableColumn prop="capacity" label="容量" width="80">
          <template #default="{ row }">
            {{ row.capacity }}人
          </template>
        </ElTableColumn>

        <ElTableColumn prop="status" label="状态" width="100">
          <template #default="{ row }">
            <ElTag :type="getStatusTag(row.status).type">
              {{ getStatusTag(row.status).text }}
            </ElTag>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="tags" label="标签" min-width="150">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <ElTag
                v-for="tag in row.tags?.slice(0, 3)"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </ElTag>
              <span v-if="row.tags && row.tags.length > 3" class="text-gray-500 text-sm">
                +{{ row.tags.length - 3 }}
              </span>
            </div>
          </template>
        </ElTableColumn>

        <ElTableColumn prop="rating" label="评分" width="80">
          <template #default="{ row }">
            {{ row.rating || '-' }}
          </template>
        </ElTableColumn>

        <ElTableColumn prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ row.createdAt || '-' }}
          </template>
        </ElTableColumn>

        <ElTableColumn label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="space-x-2">
              <ElButton type="primary" link @click="handleEdit(row)">
                编辑
              </ElButton>
              <ElButton type="success" link @click="router.push(`/lab/labs/${row.id}`)">
                查看
              </ElButton>
              <ElButton type="danger" link @click="handleDelete(row)">
                删除
              </ElButton>
            </div>
          </template>
        </ElTableColumn>
      </ElTable>

      <div v-if="total > pageSize" class="flex justify-center mt-6">
        <ElPagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper, total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </PageLayout>
</template>