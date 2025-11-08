import { reactive, ref } from "vue";

/**
 * 表单处理逻辑
 * @param {object} options
 * @param {Record<string, any>} options.initialValues
 * @param {import("element-plus").FormRules} [options.rules]
 * @param {(values: Record<string, any>) => (Promise<void> | void)} [options.onSubmit]
 * @param {() => void} [options.onSuccess]
 * @param {(error: any) => void} [options.onError]
 */
export function useForm(options) {
  const { initialValues, onSubmit, onSuccess, onError } = options;

  const formRef = ref();
  const loading = ref(false);
  const errors = ref({});
  const form = reactive({ ...initialValues });

  const validate = async () => {
    if (!formRef.value) return false;

    try {
      await formRef.value.validate();
      errors.value = {};
      return true;
    } catch (validationErrors) {
      errors.value = validationErrors || {};
      return false;
    }
  };

  const resetForm = () => {
    Object.assign(form, initialValues);
    errors.value = {};
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  const setFieldValue = (field, value) => {
    form[field] = value;
  };

  const setFieldsValue = (values) => {
    Object.assign(form, values);
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid || typeof onSubmit !== "function") {
      return;
    }

    loading.value = true;
    try {
      await onSubmit(form);
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      if (typeof onError === "function") {
        onError(error);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    formRef,
    form,
    loading,
    errors,
    validate,
    resetForm,
    setFieldValue,
    setFieldsValue,
    handleSubmit,
  };
}
