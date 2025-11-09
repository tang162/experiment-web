<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, ElButton, ElCard, ElDescriptions, ElDescriptionsItem, ElIcon } from 'element-plus';
import { ArrowLeft, Calendar, Clock, User, Location, Document, InfoFilled } from '@element-plus/icons-vue';
import { getAppointmentDetailApi, cancelAppointmentApi } from '@/api';
import { PageLayout, ReservationStatusTag } from '@/components ';
import { useApi } from '@/composables';

const route = useRoute();
const router = useRouter();

const detail = ref(null);
const { loading, execute: fetchDetail } = useApi();

// 时间段映射
const timeSlotMap = {
  0: '上午',
  1: '下午',
  2: '晚上',
};

// 状态映射（根据接口文档：0-待审核,1-已通过,2-已拒绝,3-已取消,4-已完成）
const statusMap = {
  0: '待审核',
  1: '已通过',
  2: '已拒绝',
  3: '已取消',
  4: '已完成',
};

// 计算是否可以取消（待审核或已通过的预约可以取消）
const canCancel = computed(() => {
  return detail.value?.status === 0 || detail.value?.status === 1;
});

// 加载详情
const loadDetail = async () => {
  const id = Number(route.params.id);
  if (!id) {
    ElMessage.error('预约ID无效');
    router.back();
    return;
  }

  const result = await fetchDetail(() => getAppointmentDetailApi(id));
  if (result) {
    detail.value = result;
  }
};

// 返回列表
const goBack = () => {
  router.push('/reservations');
};

// 取消预约
const handleCancel = async () => {
  if (!detail.value) return;

  try {
    await ElMessageBox.confirm('确定要取消此预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    await cancelAppointmentApi(Number(detail.value.id));
    ElMessage.success('取消成功');
    loadDetail(); // 重新加载详情
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error?.message || '取消失败');
    }
  }
};

onMounted(() => {
  loadDetail();
});
</script>

<template>
  <PageLayout :title="detail ? `预约详情 #${detail.id}` : '预约详情'" :loading="loading">
    <template #actions>
      <ElButton :icon="ArrowLeft" @click="goBack">返回列表</ElButton>
      <ElButton v-if="canCancel && detail" type="danger" @click="handleCancel">取消预约</ElButton>
    </template>

    <div v-if="detail" class="detail-container">
      <!-- 基本信息卡片 -->
      <ElCard class="mb-4">
        <template #header>
          <div class="  flex items-center justify-between">
            <span class="font-bold">基本信息</span>
            <ReservationStatusTag :status="detail.status" />
          </div>
        </template>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <InfoFilled />
                </ElIcon>
                预约ID
              </div>
            </template>
            {{ detail.id }}
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <User />
                </ElIcon>
                申请人
              </div>
            </template>
            {{ detail.user.username }}
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <Location />
                </ElIcon>
                实验室
              </div>
            </template>
            {{ detail.lab.name }}
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <Location />
                </ElIcon>
                实验室地址
              </div>
            </template>
            {{ detail.lab.location }}
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <Calendar />
                </ElIcon>
                预约日期
              </div>
            </template>
            {{ detail.appointmentDate }}
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <Clock />
                </ElIcon>
                时间段
              </div>
            </template>
            {{ timeSlotMap[detail.timeSlot] || '未知' }}
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <User />
                </ElIcon>
                参与人数
              </div>
            </template>
            {{ detail.participantCount }} 人
          </ElDescriptionsItem>

          <ElDescriptionsItem>
            <template #label>
              <div class="flex items-center">
                <ElIcon class="mr-2">
                  <Document />
                </ElIcon>
                预约状态
              </div>
            </template>
            {{ statusMap[detail.status] || '未知' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 实验室信息卡片 -->
      <ElCard class="mb-4">
        <template #header>
          <span class="font-semibold">实验室信息</span>
        </template>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="实验室名称">
            {{ detail.lab.name }}
          </ElDescriptionsItem>

          <ElDescriptionsItem label="所属部门">
            {{ detail.lab.department }}
          </ElDescriptionsItem>

          <ElDescriptionsItem label="实验室地址">
            {{ detail.lab.location }}
          </ElDescriptionsItem>

          <ElDescriptionsItem label="实验室容量">
            {{ detail.lab.capacity }} 人
          </ElDescriptionsItem>

          <ElDescriptionsItem label="实验室评分">
            <el-rate :model-value="detail.lab.rating" disabled show-score text-color="#ff9900" />
          </ElDescriptionsItem>

          <ElDescriptionsItem label="实验室描述" :span="2">
            {{ detail.lab.description || '暂无描述' }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 预约详情卡片 -->
      <ElCard class="mb-4">
        <template #header>
          <span class="font-semibold">预约详情</span>
        </template>

        <ElDescriptions :column="1" border>
          <ElDescriptionsItem label="预约目的">
            {{ detail.purpose }}
          </ElDescriptionsItem>

          <ElDescriptionsItem label="详细说明">
            {{ detail.description || '暂无详细说明' }}
          </ElDescriptionsItem>

          <ElDescriptionsItem v-if="detail.status === 2 && detail.rejectionReason" label="拒绝原因">
            <el-alert type="error" :closable="false">
              {{ detail.rejectionReason }}
            </el-alert>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 审核信息卡片 -->
      <ElCard v-if="detail.reviewer || detail.reviewTime">
        <template #header>
          <span class="font-semibold">审核信息</span>
        </template>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem v-if="detail.reviewer" label="审核人">
            {{ detail.reviewer }}
          </ElDescriptionsItem>

          <ElDescriptionsItem v-if="detail.reviewTime" label="审核时间">
            {{ detail.reviewTime }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>

      <!-- 时间信息卡片 -->
      <ElCard class="mt-4">
        <template #header>
          <span class="font-semibold">时间信息</span>
        </template>

        <ElDescriptions :column="2" border>
          <ElDescriptionsItem label="创建时间">
            {{ detail.createdAt }}
          </ElDescriptionsItem>

          <ElDescriptionsItem label="更新时间">
            {{ detail.updatedAt }}
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElCard>
    </div>
  </PageLayout>
</template>

<style scoped>
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
