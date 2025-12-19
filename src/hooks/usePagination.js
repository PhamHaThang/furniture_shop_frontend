import { useState, useCallback } from "react";

/**
 * Hook quản lý pagination
 * @param {Object} options - Các tùy chọn
 * @param {number} options.initialPage - Trang ban đầu
 * @param {number} options.initialLimit - Số items mỗi trang
 * @param {number} options.total - Tổng số items
 * @returns {Object} Pagination state và methods
 */
const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
  total = 0,
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(total);
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback(
    (newPage) => {
      const pageNumber = Math.max(1, Math.min(newPage, totalPages));
      setPage(pageNumber);
    },
    [totalPages]
  );
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
  }, []);

  const updateTotal = useCallback((newTotal) => {
    setTotalItems(newTotal);
  }, []);
  const offset = (page - 1) * limit;
  return {
    // State
    page,
    limit,
    totalItems,
    totalPages,
    offset,

    // Computed
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,

    // Methods
    setPage: goToPage,
    setLimit: changeLimit,
    setTotalItems: updateTotal,
    nextPage,
    prevPage,

    // For API params
    paginationParams: {
      page,
      limit,
    },
  };
};

export default usePagination;
