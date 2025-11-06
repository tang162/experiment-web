import { ref, reactive, watch, type Ref } from 'vue';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: Ref<number>;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  handlePageChange: (page: number) => void;
  resetPage: () => void;
  totalPages: Ref<number>;
  hasNextPage: Ref<boolean>;
  hasPrevPage: Ref<boolean>;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems = ref(0)
  } = options;

  const pagination = reactive<PaginationState>({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const totalPages = ref(0);
  const hasNextPage = ref(false);
  const hasPrevPage = ref(false);

  // Update derived values when total or pagination changes
  const updateDerivedValues = () => {
    totalPages.value = Math.ceil(totalItems.value / pagination.pageSize);
    hasNextPage.value = pagination.page < totalPages.value;
    hasPrevPage.value = pagination.page > 1;
  };

  const handlePageChange = (page: number) => {
    pagination.page = page;
    updateDerivedValues();
  };

  const resetPage = () => {
    pagination.page = initialPage;
    updateDerivedValues();
  };

  // Watch total items changes
  watch(totalItems, () => {
    updateDerivedValues();
  });

  // Watch pagination changes
  watch(() => [pagination.page, pagination.pageSize], () => {
    updateDerivedValues();
  });

  updateDerivedValues();

  return {
    pagination,
    handlePageChange,
    resetPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}