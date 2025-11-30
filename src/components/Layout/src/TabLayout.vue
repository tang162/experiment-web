<script setup>
import { ref, computed } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';

const props = defineProps({
  // 标签页配置
  tabs: {
    type: Array,
    required: true,
    // 每个标签页应包含: name, label, content, lazy, disabled 等
  },
  // 当前活跃标签页
  activeTab: {
    type: String,
    default: '',
  },
  // 是否启用懒加载
  lazy: {
    type: Boolean,
    default: true,
  },
  // 标签页位置
  tabPosition: {
    type: String,
    default: 'top',
    // 可选值: top, right, bottom, left
  },
  // 是否显示标签页关闭按钮
  closable: {
    type: Boolean,
    default: false,
  },
  // 是否显示添加标签页按钮
  addable: {
    type: Boolean,
    default: false,
  },
  // 是否显示标签页滚动按钮
  scrollable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  'tab-change',
  'tab-click',
  'tab-remove',
  'tab-add',
]);

// 当前活跃标签页
const currentTab = ref(props.activeTab || (props.tabs.length > 0 ? props.tabs[0].name : ''));

// 已加载的标签页
const loadedTabs = ref(new Set());

// 处理标签页变化
const handleTabChange = (tabName) => {
  currentTab.value = tabName;
  emit('tab-change', tabName);

  // 标记标签页为已加载
  if (props.lazy) {
    loadedTabs.value.add(tabName);
  }
};

// 处理标签页点击
const handleTabClick = (tabName) => {
  emit('tab-click', tabName);
};

// 处理标签页关闭
const handleTabRemove = (tabName) => {
  emit('tab-remove', tabName);
};

// 处理添加标签页
const handleTabAdd = () => {
  emit('tab-add');
};

// 检查标签页是否应该显示
const shouldShowTab = (tabName) => {
  if (!props.lazy) {
    return true;
  }
  return loadedTabs.value.has(tabName) || tabName === currentTab.value;
};

// 初始化已加载的标签页
if (props.lazy && currentTab.value) {
  loadedTabs.value.add(currentTab.value);
}
</script>

<template>
  <div class="tab-layout-wrapper">
    <ElTabs
      :model-value="currentTab"
      :tab-position="tabPosition"
      :closable="closable"
      :addable="addable"
      :scrollable="scrollable"
      @tab-change="handleTabChange"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
      @tab-add="handleTabAdd"
    >
      <ElTabPane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
        :disabled="tab.disabled"
        :lazy="lazy"
      >
        <!-- 标签页内容 -->
        <div v-if="shouldShowTab(tab.name)" class="tab-content">
          <!-- 使用自定义内容渲染函数 -->
          <component v-if="tab.render" :is="tab.render()" />

          <!-- 使用内容插槽 -->
          <slot v-else :name="`tab-${tab.name}`" :tab="tab">
            <!-- 默认内容 -->
            <div v-if="tab.content" class="default-content">
              {{ tab.content }}
            </div>
          </slot>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style lang="scss" scoped>
.tab-layout-wrapper {
  width: 100%;

  :deep(.el-tabs) {
    width: 100%;
  }

  .tab-content {
    padding: 1rem 0;
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
