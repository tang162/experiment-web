<script setup>
import { ref, computed, watch } from 'vue';
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElRow,
  ElCol,
  ElCheckbox,
  ElRadio,
  ElDatePicker,
  ElInputNumber,
  ElSwitch,
} from 'element-plus';

const props = defineProps({
  // 对话框是否可见
  visible: {
    type: Boolean,
    default: false,
  },
  // 对话框标题
  title: {
    type: String,
    default: '表单',
  },
  // 表单字段定义
  fields: {
    type: Array,
    default: () => [],
    // 每个字段应包含: key, label, type, required, placeholder, options, rules, defaultValue 等
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false,
  },
  // 对话框宽度
  width: {
    type: String,
    default: '500px',
  },
  // 是否显示取消按钮
  showCancel: {
    type: Boolean,
    default: true,
  },
  // 提交按钮文本
  submitText: {
    type: String,
    default: '提交',
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消',
  },
});

const emit = defineEmits(['update:visible', 'update:modelValue', 'submit', 'close']);

// 表单引用
const formRef = ref(null);

// 本地表单数据
const formData = ref({ ...props.modelValue });

// 监听 visible 变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      formData.value = { ...props.modelValue };
    }
  }
);

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    formData.value = { ...newVal };
  },
  { deep: true }
);

// 处理表单字段变化
const handleFieldChange = (key, value) => {
  formData.value[key] = value;
  emit('update:modelValue', formData.value);
};

// 处理提交
const handleSubmit = async () => {
  if (formRef.value) {
    try {
      await formRef.value.validate();
      emit('submit', formData.value);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }
};

// 处理关闭
const handleClose = () => {
  emit('update:visible', false);
  emit('close');
};

// 获取字段类型
const getFieldType = (field) => {
  return field.type || 'input';
};

// 获取字段规则
const getFieldRules = (field) => {
  const rules = field.rules || [];
  if (field.required) {
    rules.unshift({
      required: true,
      message: `请输入${field.label}`,
      trigger: 'blur',
    });
  }
  return rules;
};

// 获取字段默认值
const getFieldDefaultValue = (field) => {
  return field.defaultValue !== undefined ? field.defaultValue : '';
};

// 初始化表单数据
const initFormData = () => {
  const data = {};
  props.fields.forEach((field) => {
    data[field.key] = formData.value[field.key] !== undefined ? formData.value[field.key] : getFieldDefaultValue(field);
  });
  formData.value = data;
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  initFormData();
};
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      label-width="100px"
      @submit.prevent="handleSubmit"
    >
      <ElRow :gutter="16">
        <ElCol v-for="field in fields" :key="field.key" :xs="24" :sm="24" :md="24" :lg="24">
          <ElFormItem
            :label="field.label"
            :prop="field.key"
            :rules="getFieldRules(field)"
          >
            <!-- 输入框 -->
            <ElInput
              v-if="getFieldType(field) === 'input'"
              v-model="formData[field.key]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :type="field.inputType || 'text'"
              :maxlength="field.maxlength"
              :minlength="field.minlength"
              :disabled="loading"
              clearable
              @input="handleFieldChange(field.key, $event)"
            />

            <!-- 文本域 -->
            <ElInput
              v-else-if="getFieldType(field) === 'textarea'"
              v-model="formData[field.key]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              type="textarea"
              :rows="field.rows || 3"
              :maxlength="field.maxlength"
              :disabled="loading"
              clearable
              @input="handleFieldChange(field.key, $event)"
            />

            <!-- 选择框 -->
            <ElSelect
              v-else-if="getFieldType(field) === 'select'"
              v-model="formData[field.key]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :multiple="field.multiple"
              :disabled="loading"
              clearable
              class="w-full"
              @change="handleFieldChange(field.key, $event)"
            >
              <ElOption
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </ElSelect>

            <!-- 日期选择器 -->
            <ElDatePicker
              v-else-if="getFieldType(field) === 'date'"
              v-model="formData[field.key]"
              type="date"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="loading"
              clearable
              class="w-full"
              @change="handleFieldChange(field.key, $event)"
            />

            <!-- 日期时间选择器 -->
            <ElDatePicker
              v-else-if="getFieldType(field) === 'datetime'"
              v-model="formData[field.key]"
              type="datetime"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="loading"
              clearable
              class="w-full"
              @change="handleFieldChange(field.key, $event)"
            />

            <!-- 日期范围选择器 -->
            <ElDatePicker
              v-else-if="getFieldType(field) === 'daterange'"
              v-model="formData[field.key]"
              type="daterange"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="loading"
              clearable
              class="w-full"
              @change="handleFieldChange(field.key, $event)"
            />

            <!-- 数字输入框 -->
            <ElInputNumber
              v-else-if="getFieldType(field) === 'number'"
              v-model="formData[field.key]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :min="field.min"
              :max="field.max"
              :step="field.step || 1"
              :disabled="loading"
              class="w-full"
              @change="handleFieldChange(field.key, $event)"
            />

            <!-- 复选框 -->
            <ElCheckbox
              v-else-if="getFieldType(field) === 'checkbox'"
              v-model="formData[field.key]"
              :disabled="loading"
              @change="handleFieldChange(field.key, $event)"
            >
              {{ field.checkboxLabel || field.label }}
            </ElCheckbox>

            <!-- 单选框 -->
            <div v-else-if="getFieldType(field) === 'radio'" class="flex gap-4">
              <ElRadio
                v-for="option in field.options"
                :key="option.value"
                v-model="formData[field.key]"
                :label="option.value"
                :disabled="loading"
                @change="handleFieldChange(field.key, $event)"
              >
                {{ option.label }}
              </ElRadio>
            </div>

            <!-- 开关 -->
            <ElSwitch
              v-else-if="getFieldType(field) === 'switch'"
              v-model="formData[field.key]"
              :disabled="loading"
              @change="handleFieldChange(field.key, $event)"
            />

            <!-- 自定义插槽 -->
            <slot v-else :name="`field-${field.key}`" :field="field" :value="formData[field.key]" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>

    <!-- 自定义内容插槽 -->
    <slot name="content" :form-data="formData" />

    <template #footer>
      <div class="dialog-footer">
        <ElButton v-if="showCancel" @click="handleClose">
          {{ cancelText }}
        </ElButton>
        <ElButton type="primary" :loading="loading" @click="handleSubmit">
          {{ submitText }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
