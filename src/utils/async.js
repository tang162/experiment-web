import { ElMessage } from 'element-plus';

export interface MessageOptions {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
}

export function useMessage() {
  const success = (message: string) => {
    ElMessage.success(message);
  };

  const error = (message: string) => {
    ElMessage.error(message);
  };

  const warning = (message: string) => {
    ElMessage.warning(message);
  };

  const info = (message: string) => {
    ElMessage.info(message);
  };

  return {
    success,
    error,
    warning,
    info,
  };
}

export function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options: MessageOptions = {}
): Promise<T | null> {
  return operation()
    .then((result) => {
      if (options.success) {
        ElMessage.success(options.success);
      }
      return result;
    })
    .catch((error) => {
      console.error('Async operation failed:', error);
      if (options.error) {
        ElMessage.error(options.error);
      }
      return null;
    });
}