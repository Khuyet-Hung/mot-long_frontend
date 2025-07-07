import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, CalendarDays, Users, SortAsc, SortDesc } from 'lucide-react';
import type { FilterOptions, ActivitiesQueryParams } from '../../../types';

interface AdvancedFiltersProps {
  filters: ActivitiesQueryParams;
  onFiltersChange: (filters: ActivitiesQueryParams) => void;
  filterOptions?: FilterOptions | null;
  onReset: () => void;
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  filterOptions,
  onReset,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<ActivitiesQueryParams>(filters);
  const [searchKeyword, setSearchKeyword] = useState(filters.keyword || ''); // Local state for search input

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
    setSearchKeyword(filters.keyword || '');
  }, [filters]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchKeyword !== (localFilters.keyword || '')) {
        handleFilterChange('keyword', searchKeyword || undefined);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchKeyword]); // Only run when searchKeyword changes

  const handleFilterChange = useCallback((key: keyof ActivitiesQueryParams, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    // Reset page to 1 when filters change (except page change itself)
    if (key !== 'page') {
      newFilters.page = 1;
    }
    
    onFiltersChange(newFilters);
  }, [localFilters, onFiltersChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value); // Update local state immediately for UI responsiveness
  };

  const handleReset = () => {
    const resetFilters: ActivitiesQueryParams = {
      page: 1,
      limit: 10,
      sortBy: 'date',
      sortOrder: 'desc',
    };
    setLocalFilters(resetFilters);
    setSearchKeyword(''); // Reset search keyword
    onFiltersChange(resetFilters);
    onReset();
  };

  const hasActiveFilters = Boolean(
    searchKeyword ||
    localFilters.status ||
    localFilters.category ||
    localFilters.dateFrom ||
    localFilters.dateTo ||
    localFilters.participantsMin ||
    localFilters.participantsMax
  );

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Basic filters - always visible */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả, địa điểm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
          </div>

          {/* Status filter */}
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            className="px-5 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 min-w-[140px]"
          >
            <option value="">Tất cả trạng thái</option>
            {filterOptions?.statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label} ({status.count})
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="px-8 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 min-w-[140px]"
          >
            <option value="">Tất cả danh mục</option>
            {filterOptions?.categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>

          {/* Advanced filters toggle */}
          {/* <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 border rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
              isExpanded || hasActiveFilters
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Filter className="h-4 w-4" />
            Lọc nâng cao
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                •
              </span>
            )}
          </button> */}

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters - collapsible */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date range */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-gray-700 items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Khoảng thời gian
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  placeholder="Từ ngày"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                  max={localFilters.dateTo || undefined}
                />
                <input
                  type="date"
                  placeholder="Đến ngày"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                  min={localFilters.dateFrom || undefined}
                />
              </div>
            </div>

            {/* Participants range */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-gray-700 items-center gap-2">
                <Users className="h-4 w-4" />
                Số người tham gia
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                  value={localFilters.participantsMin || ''}
                  onChange={(e) => handleFilterChange('participantsMin', e.target.value ? Number(e.target.value) : undefined)}
                  min="0"
                  max={localFilters.participantsMax || filterOptions?.participantsRange?.max}
                />
                <input
                  type="number"
                  placeholder="Đến"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                  value={localFilters.participantsMax || ''}
                  onChange={(e) => handleFilterChange('participantsMax', e.target.value ? Number(e.target.value) : undefined)}
                  min={localFilters.participantsMin || filterOptions?.participantsRange?.min || 0}
                />
              </div>
            </div>

            {/* Sort options */}
            <div className="space-y-2">
              <label className="flex text-sm font-medium text-gray-700 items-center gap-2">
                {localFilters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                Sắp xếp
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={localFilters.sortBy || 'date'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  {filterOptions?.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={localFilters.sortOrder || 'desc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  {filterOptions?.sortOrders.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter summary */}
          {filterOptions && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Phạm vi dữ liệu: {filterOptions.dateRange && (
                  <>
                    {new Date(filterOptions.dateRange.min).toLocaleDateString('vi-VN')} - {new Date(filterOptions.dateRange.max).toLocaleDateString('vi-VN')}
                  </>
                )}
                {filterOptions.participantsRange && (
                  <> | Người tham gia: {filterOptions.participantsRange.min} - {filterOptions.participantsRange.max}</>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
