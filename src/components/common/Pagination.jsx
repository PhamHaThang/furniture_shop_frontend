import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirst = true,
  showLast = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-char-600 hover:bg-beige-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page">
        <ChevronLeft size={20} />
      </button>

      {/* First Page */}
      {showFirst && pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg text-char-600 hover:bg-beige-100 transition-colors">
            1
          </button>
          {pages[0] > 2 && <span className="px-2 text-char-400">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
            currentPage === page
              ? "bg-primary-500 text-white"
              : "text-char-600 hover:bg-beige-100"
          }`}>
          {page}
        </button>
      ))}

      {/* Last Page */}
      {showLast && pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-char-400">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg text-char-600 hover:bg-beige-100 transition-colors">
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-char-600 hover:bg-beige-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
