import { ref } from "vue";

/**
 * 通用接口请求封装
 * @param {object} [options]
 * @param {(data: any) => void} [options.onSuccess]
 * @param {(error: any) => void} [options.onError]
 * @param {boolean} [options.showLoading=true]
 * @param {boolean} [options.showError=true]
 */
export function useApi(options = {}) {
  const {
    onSuccess,
    onError,
    showLoading = true,
    showError = true,
  } = options;

  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const execute = async (apiCall) => {
    loading.value = showLoading;
    error.value = null;

    try {
      const result = await apiCall();
      data.value = result;
      if (typeof onSuccess === "function") {
        onSuccess(result);
      }
      return result;
    } catch (err) {
      error.value = err;
      if (showError) {
        console.error("API Error:", err);
      }
      if (typeof onError === "function") {
        onError(err);
      }
      return null;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}
