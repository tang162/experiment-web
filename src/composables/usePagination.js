import { reactive, ref, watch } from "vue";

export function usePagination(options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems = ref(0),
  } = options;

  const pagination = reactive({
    page: initialPage,
    pageSize: initialPageSize,
  });

  const totalPages = ref(0);
  const hasNextPage = ref(false);
  const hasPrevPage = ref(false);

  const updateDerivedValues = () => {
    totalPages.value = Math.ceil((totalItems.value || 0) / pagination.pageSize);
    hasNextPage.value = pagination.page < totalPages.value;
    hasPrevPage.value = pagination.page > 1;
  };

  const handlePageChange = (page) => {
    pagination.page = page;
    updateDerivedValues();
  };

  const resetPage = () => {
    pagination.page = initialPage;
    updateDerivedValues();
  };

  watch(totalItems, () => {
    updateDerivedValues();
  });

  watch(
    () => [pagination.page, pagination.pageSize],
    () => {
      updateDerivedValues();
    }
  );

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
