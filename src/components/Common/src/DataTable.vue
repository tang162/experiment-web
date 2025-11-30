<script setup>
import { computed } from 'vue';
import { ElTable, ElTableColumn, ElPagination, ElEmpty, ElButton, ElIcon } from 'element-plus';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => [],
  },
  // 列定义
  columns: {
    type: Array,
    required: true,
    // 每个列定义应包含: prop, label, width, minWidth, align, sortable, formatter 等
  },
  // 总数据量
  total: {
    type: Number,
    default: 0,
  },
  // 当前页码
  page: {
    type: Number,
    default: 1,
  },
  // 每页数量
  pageSize: {
    type: Number,
    default: 10,
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 是否显示序号列
  showIndex: {
    type: Boolean,
    default: true,
  },
  // 是否显示选择列
  showSelection: {
    type: Boolean,
    default: false,
  },
  // 行高
  rowHeight: {
    type: [String, Number],
    default: 'auto',
  },
  // 是否显示斑马纹
  stripe: {
    type: Boolean,
    default: true,
  },
  // 是否显示边框
  border: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'page-change',
  'sort',
  'row-click',
  'selection-change',
]);

// 计算序号
const getRowIndex = (index) => {
  return (props.page - 1) * props.pageSize + index + 1;
};

// 处理分页变化
const handlePageChange = (newPage) => {
  emit('page-change', newPage);
};

// 处理排序
const handleSort = ({ prop, order }) => {
  emit('sort', { prop, order });
};

// 处理行点击
const handleRowClick = (row) => {
  emit('row-click', row);
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection);
};

// 是否显示分页
const showPaginationBar = computed(() => {
  return props.showPagination && props.total > props.pageSize;
});
</script>

<template>
  <div class="data-table-wrapper">
    <!-- 表格 -->
    <div v-loading="loading" class="table-container">
      <ElTable
        :data="data"
        :stripe="stripe"
        :border="border"
        :row-height="rowHeight"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        @sort-change="handleSort"
      >
        <!-- 选择列 -->
        <ElTableColumn v-if="showSelection" type="selection" width="50" />

        <!-- 序号列 -->
        <ElTableColumn v-if="showIndex" label="序号" width="60" align="center">
          <template #default="{ $index }">
            {{ getRowIndex($index) }}
          </template>
        </ElTableColumn>

        <!-- 数据列 -->
        <ElTableColumn
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth || 100"
          :align="column.align || 'left'"
          :sortable="column.sortable ? 'custom' : false"
          :show-overflow-tooltip="column.showOverflowTooltip !== false"
        >
          <template #default="{ row, $index }">
            <!-- 使用自定义渲染函数 -->
            <template v-if="column.render">
              <component :is="column.render(row, $index)" />
            </template>
            <!-- 使用格式化函数 -->
            <template v-else-if="column.formatter">
              {{ column.formatter(row[column.prop], row, $index) }}
            </template>
            <!-- 默认显示 -->
            <template v-else>
              {{ row[column.prop] }}
            </template>
          </template>
        </ElTableColumn>

        <!-- 操作列 -->
        <slot name="action" />

        <!-- 空状态 -->
        <template #empty>
          <ElEmpty description="暂无数据" />
        </template>
      </ElTable>
    </div>

    <!-- 分页 -->
    <div v-if="showPaginationBar" class="pagination-container">
      <ElPagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .table-container {
    width: 100%;
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }
}
</style>
