import { ref, reactive, type Ref, type UnwrapRef } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  rules?: FormRules;
  onSubmit?: (values: UnwrapRef<T>) => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export interface UseFormReturn<T extends Record<string, any>> {
  formRef: Ref<FormInstance | undefined>;
  form: UnwrapRef<T>;
  loading: Ref<boolean>;
  errors: Ref<Record<string, string[]>>;
  validate: () => Promise<boolean>;
  resetForm: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldsValue: (values: Partial<T>) => void;
  handleSubmit: () => Promise<void>;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, rules, onSubmit, onSuccess, onError } = options;

  const formRef = ref<FormInstance>();
  const loading = ref(false);
  const errors = ref<Record<string, string[]>>({});

  const form = reactive<T>({ ...initialValues });

  const validate = async (): Promise<boolean> => {
    if (!formRef.value) return false;

    try {
      await formRef.value.validate();
      errors.value = {};
      return true;
    } catch (validationErrors: any) {
      errors.value = validationErrors || {};
      return false;
    }
  };

  const resetForm = () => {
    Object.assign(form, initialValues);
    errors.value = {};
    formRef.value?.resetFields();
  };

  const setFieldValue = (field: keyof T, value: any) => {
    (form as any)[field] = value;
  };

  const setFieldsValue = (values: Partial<T>) => {
    Object.assign(form, values);
  };

  const handleSubmit = async () => {
    const isValid = await validate();
    if (!isValid || !onSubmit) return;

    loading.value = true;
    try {
      await onSubmit(form);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
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