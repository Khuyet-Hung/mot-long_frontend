export interface Activity {
  _id?: string;
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  images: string[];
  videos: string[];
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  publicId?: string; // Cloudinary public ID để có thể delete
  resourceType?: string; // 'image' | 'video'
}

export interface VolunteerGroup {
  name: string;
  description: string;
  mission: string;
  founded: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
    facebook?: string;
  };
  stats: {
    totalMembers: number;
    totalActivities: number;
    totalBeneficiaries: number;
    yearsActive: number;
  };
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  joinedDate: string;
}

// Enhanced API response types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface FilterInfo {
  status?: string;
  category?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  participantsMin?: number;
  participantsMax?: number;
  sortBy: string;
  sortOrder: string;
}

export interface ActivityMetadata {
  totalActivities: number;
  queryTime: string;
}

export interface ActivitiesResponse {
  success: boolean;
  data: {
    activities: Activity[];
    pagination: PaginationInfo;
    filters: FilterInfo;
    metadata: ActivityMetadata;
  };
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface DateRange {
  min: Date;
  max: Date;
}

export interface ParticipantsRange {
  min: number;
  max: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  categories: FilterOption[];
  statuses: FilterOption[];
  dateRange: DateRange | null;
  participantsRange: ParticipantsRange | null;
  sortOptions: SortOption[];
  sortOrders: SortOption[];
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptions;
}

// Query parameters for activities API
export interface ActivitiesQueryParams {
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
}
