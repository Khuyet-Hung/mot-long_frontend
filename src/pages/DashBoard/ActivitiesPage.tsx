import { useEffect, useState } from "react";
import type { 
  Activity, 
  ActivitiesQueryParams, 
  FilterOptions, 
  PaginationInfo 
} from "../../types";
import { ActivitiesTable } from "../../components/admin/Activities/ActivitiesTable";
import { ActivityForm } from "../../components/admin/Activities/ActivityForm";
import ViewingActivity from "../../components/admin/Activities/ViewingActivity";
import { apiService } from "../../services/activitiesService";
import { messageUtils } from "../../utils/messageUtils";
import { TableLoadingSkeleton } from "../../components/common/LoadingSkeleton";

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Enhanced filters state
  const [filters, setFilters] = useState<ActivitiesQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  // Loading states for different CRUD operations
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);


  const handleDeleteActivity = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hoạt động này?")) {
      try {
        setIsDeleting(id); // Set loading state for specific activity
        messageUtils.info("Đang xóa hoạt động...", { duration: 2000 });
        
        await apiService.deleteActivity(id);
        messageUtils.success("Xóa hoạt động thành công!");
        fetchActivities();
      } catch (error) {
        console.log('🚀 ~ handleDeleteActivity ~ error:', error);
        messageUtils.error("Không thể xóa hoạt động. Vui lòng thử lại.");
      } finally {
        setIsDeleting(null); // Clear loading state
      }
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowForm(true);
  };

  const handleAddActivity = () => {
    console.log('🆕 Adding new activity - clearing selectedActivity');
    setSelectedActivity(null);
    setShowForm(true);
  };

  const handleViewActivity = (activity: Activity) => {
    setViewingActivity(activity);
  };

  const fetchActivities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
        messageUtils.info("Đang làm mới danh sách...", { duration: 1500 });
      } else {
        setLoading(true);
      }
      
      const response = await apiService.getActivities(filters);
      
      if (response.success && response.data) {
        setActivities(response.data.activities || []);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch activities');
      }
      
      if (isRefresh) {
        messageUtils.success("Đã làm mới danh sách thành công!", { duration: 2000 });
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      messageUtils.error("Không thể tải danh sách hoạt động. Vui lòng thử lại sau.");
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchFilterOptions = async () => {
    try {
      setIsLoadingFilters(true);
      const response = await apiService.getFilterOptions();
      
      if (response.success && response.data) {
        setFilterOptions(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
      // Don't show error message for filter options as it's not critical
    } finally {
      setIsLoadingFilters(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: ActivitiesQueryParams) => {
    setFilters(newFilters);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters: ActivitiesQueryParams = {
      page: 1,
      limit: 10,
      sortBy: 'date',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
  };


  // Lưu activity qua API
  const handleSaveActivity = async (activityData: Partial<Activity>) => {
    try {
      setIsSaving(true);
      
      if (selectedActivity) {
        // Update activity qua API
        if (!selectedActivity._id) {
          throw new Error("Selected activity does not have a valid ID.");
        }
        messageUtils.info("Đang cập nhật hoạt động...", { duration: 2000 });
        const response = await apiService.updateActivity(selectedActivity._id, activityData);
        fetchActivities();
        messageUtils.success(response.data.message || 'Cập nhật hoạt động thành công!');
      } else {
        // Create activity qua API
        messageUtils.info("Đang tạo hoạt động mới...", { duration: 2000 });
        const response = await apiService.createActivity(activityData);
        fetchActivities();
        messageUtils.success(response.data.message || 'Tạo hoạt động thành công!');
      }
      
      setSelectedActivity(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save activity:", error);
      messageUtils.error("Không thể lưu hoạt động. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [filters]); // Re-fetch when filters change

  useEffect(() => {
    fetchFilterOptions();
  }, []); // Fetch filter options once on mount

  // Refresh function
  const handleRefresh = () => {
    fetchActivities(true);
  };

  // Enhanced close handler để đảm bảo form được reset
  const handleCloseForm = () => {
    setSelectedActivity(null); // Clear trước
    setShowForm(false); // Đóng sau
  };

  return (
    <>
      {loading ? (
        <TableLoadingSkeleton rows={6} />
      ) : (
        <ActivitiesTable
          activities={activities}
          pagination={pagination || undefined}
          filters={filters}
          filterOptions={filterOptions}
          onFiltersChange={handleFiltersChange}
          onPageChange={handlePageChange}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
          onView={handleViewActivity}
          onAdd={handleAddActivity}
          onRefresh={handleRefresh}
          onResetFilters={handleResetFilters}
          isDeleting={isDeleting}
          isRefreshing={isRefreshing}
          isLoading={isLoadingFilters}
        />
      )}
      
      <ActivityForm
        activity={selectedActivity}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSaveActivity}
        isSaving={isSaving}
      />
      <ViewingActivity
        activity={viewingActivity}
        onClose={() => setViewingActivity(null)}
      />
    </>
  );
}
