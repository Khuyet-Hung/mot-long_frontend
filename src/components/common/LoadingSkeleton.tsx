import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  rows = 5, 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="border-b border-gray-200 last:border-b-0">
          <div className="px-6 py-4 flex items-center space-x-4">
            {/* Avatar/Icon placeholder */}
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            
            {/* Content placeholder */}
            <div className="flex-1 space-y-2">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            {/* Action buttons placeholder */}
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Table-specific loading skeleton
export const TableLoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header skeleton */}
      <div className="p-6 border-b animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        
        {/* Filters skeleton */}
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: 7 }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
