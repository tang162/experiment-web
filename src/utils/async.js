import {
  ElMessage
} from 'element-plus';

export function useMessage() {
  const success = (message) => {
    ElMessage.success(message);
  };

  const error = (message) => {
    ElMessage.error(message);
  };

  const warning = (message) => {
    ElMessage.warning(message);
  };

  const info = (message) => {
    ElMessage.info(message);
  };

  return {
    success,
    error,
    warning,
    info,
  };
}

export function handleAsyncOperation(
  operation,
  options
) {
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