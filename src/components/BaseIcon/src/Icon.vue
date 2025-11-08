<script setup>
import { computed, useAttrs } from "vue";
import { ElIcon } from "element-plus";

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
  color: { type: String, default: undefined },
});

const attrs = useAttrs();

// 组装给 Icon 的 props
const iconProps = computed(() => ({
  icon: props.icon,
  width: props.size,
  height: props.size,
  color: props.color,
  ...attrs,
}));
</script>

<template>
  <ElIcon v-bind="iconProps" />
</template>
