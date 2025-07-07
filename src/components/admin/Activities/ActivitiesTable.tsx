import React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Image,
  Video,
  RefreshCw,
  Loader2,
} from "lucide-react";
import type { Activity, PaginationInfo, FilterOptions, ActivitiesQueryParams } from "../../../types";
import { Pagination } from "../../common/Pagination";
import { AdvancedFilters } from "./AdvancedFilters";

interface ActivitiesTableProps {
  activities: Activity[];
  pagination?: PaginationInfo;
  filters: ActivitiesQueryParams;
  filterOptions?: FilterOptions | null;
  onFiltersChange: (filters: ActivitiesQueryParams) => void;
  onPageChange: (page: number) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onView: (activity: Activity) => void;
  onAdd: () => void;
  onRefresh?: () => void;
  onResetFilters: () => void;
  isDeleting?: string | null;
  isRefreshing?: boolean;
  isLoading?: boolean;
}

export const ActivitiesTable: React.FC<ActivitiesTableProps> = ({
  activities,
  pagination,
  filters,
  filterOptions,
  onFiltersChange,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onRefresh,
  onResetFilters,
  isDeleting = null,
  isRefreshing = false,
  isLoading = false,
}) => {
  // Xử lý trường hợp activities null/undefined
  const safeActivities: Activity[] = Array.isArray(activities) ? activities : [];

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Activity["status"]) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý hoạt động
          </h2>
          <div className="flex gap-2">
            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 px-3 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
              </button>
            )}
            
            {/* Add Button */}
            <button
              onClick={onAdd}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Thêm hoạt động
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        filterOptions={filterOptions}
        onReset={onResetFilters}
        className="border-b"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="relative">
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang tải dữ liệu...</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hoạt động
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người tham gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Media
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeActivities.map((activity) => (
              <tr key={activity._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {activity.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {activity.category}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {getStatusText(activity.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {new Date(activity.date).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="max-w-xs truncate">
                      {activity.location}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    {activity.participants}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-3">
                    {activity.images.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Image className="h-4 w-4" />
                        <span>{activity.images.length}</span>
                      </div>
                    )}
                    {activity.videos.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        <span>{activity.videos.length}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(activity)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(activity)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (activity._id) {
                          onDelete(activity._id);
                        } else {
                          console.error("Activity ID is missing");
                        }
                      }}
                      disabled={isDeleting === activity._id}
                      className={`p-1 rounded transition-colors duration-200 ${
                        isDeleting === activity._id
                          ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                      }`}
                      title={isDeleting === activity._id ? "Đang xóa..." : "Xóa"}
                    >
                      {isDeleting === activity._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {safeActivities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {isLoading ? "Đang tải dữ liệu..." : "Chưa có hoạt động nào được tìm thấy."}
          </div>
        </div>
      ) : null}

      {/* Pagination */}
      {pagination && (
        <div className="border-t bg-gray-50">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            className="p-4"
          />
        </div>
      )}
    </div>
  );
};
