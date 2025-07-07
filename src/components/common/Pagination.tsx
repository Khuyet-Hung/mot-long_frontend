import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { PaginationInfo } from '../../types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  className = '',
}) => {
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  } = pagination;

  // Generate page numbers to display
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end page numbers
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Add pages to range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (start > 1) {
      if (start > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }
    }

    // Add main range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const buttonClass = (isActive = false, isDisabled = false) => `
    px-3 py-2 text-sm font-medium border transition-colors duration-200
    ${isActive
      ? 'bg-primary-600 text-white border-primary-600'
      : isDisabled
      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
    }
  `;

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-700">
        Hiển thị <span className="font-medium">{startIndex}</span> đến{' '}
        <span className="font-medium">{endIndex}</span> trong tổng số{' '}
        <span className="font-medium">{totalItems}</span> kết quả
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={!hasPrevPage}
          className={`${buttonClass(false, !hasPrevPage)} rounded-l-md`}
          title="Trang đầu"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={!hasPrevPage}
          className={buttonClass(false, !hasPrevPage)}
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
            className={`${buttonClass(
              page === currentPage,
              page === '...'
            )} min-w-[40px]`}
          >
            {page}
          </button>
        ))}

        {/* Next page */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={!hasNextPage}
          className={buttonClass(false, !hasNextPage)}
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={!hasNextPage}
          className={`${buttonClass(false, !hasNextPage)} rounded-r-md`}
          title="Trang cuối"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      {/* Page size info (optional) */}
      <div className="text-sm text-gray-500">
        {itemsPerPage} mục/trang
      </div>
    </div>
  );
};
