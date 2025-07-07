import apiCall from "./api";


export const apiService = {
  // Activities with enhanced filtering and pagination
  getActivities: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    keyword?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    dateFrom?: string;
    dateTo?: string;
    participantsMin?: number;
    participantsMax?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const query = queryParams.toString();
    return apiCall(`/activities${query ? `?${query}` : ''}`);
  },

  // Get filter options for dropdowns and ranges
  getFilterOptions: async () => {
    return apiCall('/activities/filters');
  },

  getActivityById: async (id: string) => {
    return apiCall(`/activities/${id}`);
  },

  createActivity: async (activityData: any) => {
    return apiCall('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },

  updateActivity: async (id: string, activityData: any) => {
    return apiCall(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  },

  deleteActivity: async (id: string) => {
    return apiCall(`/activities/${id}`, {
      method: 'DELETE',
    });
  },

  uploadFiles: async (files: FileList | File[]) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    return apiCall('/activities/upload', {
      method: 'POST',
      body: formData,
    });
  },

  uploadSingleFile: async (file: File) => {
    const formData = new FormData();
    formData.append('files', file);

    return apiCall('/activities/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getActivityStats: async () => {
    return apiCall('/activities/stats');
  },

  deleteTempFile: async (publicId: string, resourceType: string = 'image') => {
    return apiCall('/activities/upload/temp', {
      method: 'DELETE',
      body: JSON.stringify({ publicId, resourceType }),
    });
  },
};