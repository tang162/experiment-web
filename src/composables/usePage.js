import { onMounted, ref } from "vue";

export function usePage() {
  const isReady = ref(false);
  const loading = ref(true);
  const error = ref(null);

  onMounted(() => {
    // 模拟页面初始化
    setTimeout(() => {
      isReady.value = true;
      loading.value = false;
    }, 0);
  });

  return {
    isReady,
    loading,
    error,
  };
}
