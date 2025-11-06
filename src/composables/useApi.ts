import { ref, type Ref } from 'vue';

export interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showLoading?: boolean;
  showError?: boolean;
}

export interface UseApiReturn<T = any> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(options: UseApiOptions = {}): UseApiReturn<T> {
  const {
    onSuccess,
    onError,
    showLoading = true,
    showError = true
  } = options;

  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
    loading.value = showLoading;
    error.value = null;

    try {
      const result = await apiCall();
      data.value = result;
      onSuccess?.(result);
      return result;
    } catch (err) {
      error.value = err as Error;
      if (showError) {
        console.error('API Error:', err);
      }
      onError?.(err);
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