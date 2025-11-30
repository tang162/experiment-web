<script setup>
import { computed } from 'vue';
import { ElTag, ElIcon } from 'element-plus';
import {
  Clock,
  Check,
  Close,
  CircleCheckFilled,
  CircleCloseFilled,
  Warning,
  InfoFilled,
} from '@element-plus/icons-vue';

const props = defineProps({
  // 状态值
  status: {
    type: [String, Number],
    required: true,
  },
  // 状态类型（用于自定义样式）
  type: {
    type: String,
    default: 'info',
    // 可选值: success, warning, danger, info
  },
  // 状态映射配置
  statusMap: {
    type: Object,
    default: () => ({}),
    // 格式: { statusValue: { label: '标签文本', type: '类型', icon: '图标名称' } }
  },
  // 是否显示图标
  showIcon: {
    type: Boolean,
    default: true,
  },
  // 标签大小
  size: {
    type: String,
    default: 'default',
    // 可选值: large, default, small
  },
  // 是否显示为纯文本
  plain: {
    type: Boolean,
    default: false,
  },
  // 是否可关闭
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

// 获取状态配置
const statusConfig = computed(() => {
  // 如果提供了自定义映射，使用自定义映射
  if (props.statusMap && props.statusMap[props.status]) {
    return props.statusMap[props.status];
  }

  // 默认状态映射
  const defaultMap = {
    // 预约状态
    0: { label: '待审核', type: 'warning', icon: 'Clock' },
    1: { label: '已通过', type: 'success', icon: 'Check' },
    2: { label: '已拒绝', type: 'danger', icon: 'Close' },
    3: { label: '已完成', type: 'info', icon: 'CircleCheckFilled' },
    4: { label: '已取消', type: 'info', icon: 'CircleCloseFilled' },
    // 申请状态
    pending: { label: '待审核', type: 'warning', icon: 'Clock' },
    approved: { label: '已通过', type: 'success', icon: 'Check' },
    rejected: { label: '已拒绝', type: 'danger', icon: 'Close' },
    // 通用状态
    active: { label: '活跃', type: 'success', icon: 'Check' },
    inactive: { label: '非活跃', type: 'info', icon: 'InfoFilled' },
    error: { label: '错误', type: 'danger', icon: 'Close' },
    warning: { label: '警告', type: 'warning', icon: 'Warning' },
  };

  return defaultMap[props.status] || { label: String(props.status), type: 'info', icon: 'InfoFilled' };
});

// 获取标签类型
const tagType = computed(() => {
  return statusConfig.value.type || props.type;
});

// 获取标签文本
const tagLabel = computed(() => {
  return statusConfig.value.label || String(props.status);
});

// 获取图标组件
const getIconComponent = (iconName) => {
  const iconMap = {
    Clock,
    Check,
    Close,
    CircleCheckFilled,
    CircleCloseFilled,
    Warning,
    InfoFilled,
  };
  return iconMap[iconName] || InfoFilled;
};

// 获取图标
const tagIcon = computed(() => {
  if (!props.showIcon || !statusConfig.value.icon) {
    return null;
  }
  return getIconComponent(statusConfig.value.icon);
});

// 处理关闭
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <ElTag
    :type="tagType"
    :size="size"
    :closable="closable"
    :plain="plain"
    @close="handleClose"
  >
    <template v-if="tagIcon && showIcon">
      <ElIcon class="mr-1">
        <component :is="tagIcon" />
      </ElIcon>
    </template>
    {{ tagLabel }}
  </ElTag>
</template>

<style lang="scss" scoped>
// 自定义样式
:deep(.el-tag) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
