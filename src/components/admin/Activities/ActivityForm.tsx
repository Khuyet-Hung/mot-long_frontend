import React, { useState, useEffect } from "react";
import { X, Image, Video, Loader2 } from "lucide-react";
import type { Activity } from "../../../types";
import { useMediaUpload } from "../../../hooks/useMediaUpload";
import { apiService } from "../../../services/activitiesService";
import { messageUtils } from "../../../utils/messageUtils";

interface ActivityFormProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: Partial<Activity>) => void | Promise<void>;
  isSaving?: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({
  activity,
  isOpen,
  onClose,
  onSubmit,
  isSaving = false,
}) => {
  const { uploading, uploadProgress, uploadFile } = useMediaUpload();

  // Helper function để convert ISO date thành YYYY-MM-DD format
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Track temp uploads để cleanup khi cần
  const [tempUploads, setTempUploads] = useState<{publicId: string, resourceType: string}[]>([]);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    location: string;
    participants: number;
    status: Activity["status"];
    category: string;
    images: string[];
    videos: string[];
  }>({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: 0,
    status: "upcoming",
    category: "",
    images: [],
    videos: [],
  });

   console.log('🚀 ~ activity:', activity);
  // Effect để cập nhật formData khi activity prop thay đổi
  useEffect(() => {
    console.log('🚀 ~ activity đã đổi:', activity);
    
    if (activity) {
      // Editing existing activity
      setFormData({
        title: activity.title || "",
        description: activity.description || "",
        date: formatDateForInput(activity.date || ""),
        location: activity.location || "",
        participants: activity.participants || 0,
        status: activity.status || "upcoming",
        category: activity.category || "",
        images: activity.images || [],
        videos: activity.videos || [],
      });
      // Clear temp uploads when switching to different activity
      setTempUploads([]);
    } else {
      // Adding new activity - always reset form completely
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        participants: 0,
        status: "upcoming",
        category: "",
        images: [],
        videos: [],
      });
      // Clear temp uploads when creating new activity
      setTempUploads([]);
    }
  }, [activity]);

  // Additional effect to ensure form is reset when opening for new activity
  useEffect(() => {
    if (isOpen && !activity) {
      // Force reset form when opening modal for new activity
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        participants: 0,
        status: "upcoming",
        category: "",
        images: [],
        videos: [],
      });
      setTempUploads([]);
      console.log('🔄 Form reset for new activity');
    }
  }, [isOpen, activity]);

  // Cleanup khi component unmount hoặc form đóng
  useEffect(() => {
    return () => {
      // Cleanup temp uploads when component unmounts
      if (tempUploads.length > 0) {
        tempUploads.forEach(upload => {
          apiService.deleteTempFile(upload.publicId, upload.resourceType)
            .catch(error => console.error("Cleanup failed:", error));
        });
      }
    };
  }, [tempUploads]);

  const handleFileUpload = async (
    files: FileList,
    type: "images" | "videos"
  ) => {
    const fileArray = Array.from(files);

    try {
      for (const file of fileArray) {
        const uploadedFile = await uploadFile(file);

        // Track temp upload để có thể cleanup
        if (uploadedFile.publicId) {
          setTempUploads(prev => [...prev, {
            publicId: uploadedFile.publicId!,
            resourceType: uploadedFile.resourceType || type.slice(0, -1) // 'images' -> 'image'
          }]);
        }

        setFormData((prev) => ({
          ...prev,
          [type]: [...prev[type], uploadedFile.url],
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Lỗi upload không xác định';
      messageUtils.error(`Upload thất bại: ${errorMessage}`);
    }
  };

  const removeMedia = async (index: number, type: "images" | "videos") => {
    // Tìm publicId của file cần xóa từ tempUploads
    // Logic đơn giản: match theo thứ tự index
    const tempUploadIndex = index < tempUploads.length ? index : -1;

    // Xóa khỏi form
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    // Nếu là temp upload, xóa khỏi Cloudinary
    if (tempUploadIndex !== -1 && tempUploads[tempUploadIndex]) {
      const tempUpload = tempUploads[tempUploadIndex];
      try {
        messageUtils.info("Đang xóa file...", { duration: 1500 });
        await apiService.deleteTempFile(tempUpload.publicId, tempUpload.resourceType);
        setTempUploads(prev => prev.filter((_, i) => i !== tempUploadIndex));
        messageUtils.success("Đã xóa file thành công!", { duration: 2000 });
      } catch (error) {
        console.error("Failed to delete temp file:", error);
        messageUtils.warning("Không thể xóa file khỏi server, nhưng đã loại bỏ khỏi form.", { duration: 3000 });
      }
    } else {
      messageUtils.success("Đã loại bỏ file khỏi danh sách!", { duration: 2000 });
    }
  };

  // Cleanup temp uploads khi cancel
  const handleCancel = async () => {
    if (tempUploads.length > 0) {
      messageUtils.info("Đang dọn dẹp các file tạm thời...", { duration: 2000 });
      
      try {
        // Delete all temp uploads
        await Promise.all(
          tempUploads.map(upload => 
            apiService.deleteTempFile(upload.publicId, upload.resourceType)
          )
        );
        messageUtils.success("Đã dọn dẹp các file tạm thời!", { duration: 2000 });
      } catch (error) {
        console.error("Failed to cleanup temp uploads:", error);
        messageUtils.warning("Một số file tạm thời có thể chưa được dọn dẹp.", { duration: 3000 });
      }
    }
    
    setTempUploads([]);
    onClose();
  };

  // Clear temp uploads tracking khi submit thành công
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activityData = {
      ...formData,
      participants: parseInt(formData.participants.toString(), 10),
      date: new Date(formData.date).toISOString(),
      images: formData.images.filter((url) => url.trim() !== ""),
      videos: formData.videos.filter((url) => url.trim() !== ""),
    };
    
    try {
      await onSubmit(activityData);
      // Clear temp uploads tracking sau khi save thành công
      setTempUploads([]);
    } catch (error) {
      console.error("Failed to save activity:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {activity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên hoạt động *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Giáo dục">Giáo dục</option>
                  <option value="Môi trường">Môi trường</option>
                  <option value="Y tế">Y tế</option>
                  <option value="Xã hội">Xã hội</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tổ chức *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số người tham gia *
                </label>
                <input
                  type="number"
                  value={formData.participants}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      participants: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as Activity["status"],
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="upcoming">Sắp diễn ra</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {/* Media Upload */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh hoạt động
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files, "images")
                    }
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-8 w-8 text-primary-600 mb-2 animate-spin" />
                        <span className="text-sm text-primary-600">
                          Đang upload ảnh... {uploadProgress}%
                        </span>
                      </>
                    ) : (
                      <>
                        <Image className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Chọn ảnh để upload
                        </span>
                      </>
                    )}
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(index, "images")}
                          disabled={isSaving}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video hoạt động
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleFileUpload(e.target.files, "videos")
                    }
                    className="hidden"
                    id="video-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="video-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-8 w-8 text-primary-600 mb-2 animate-spin" />
                        <span className="text-sm text-primary-600">
                          Đang upload video... {uploadProgress}%
                        </span>
                      </>
                    ) : (
                      <>
                        <Video className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Chọn video để upload
                        </span>
                      </>
                    )}
                  </label>
                </div>
                {formData.videos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.videos.map((url, index) => (
                      <div key={index} className="relative">
                        <video
                          src={url}
                          controls
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(index, "videos")}
                          disabled={isSaving}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* {uploading && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-700">Đang upload...</span>
                  <span className="text-sm text-blue-700">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )} */}

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={uploading || isSaving}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {(uploading || isSaving) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isSaving 
                  ? (activity ? "Đang cập nhật..." : "Đang tạo...")
                  : uploading 
                    ? "Đang upload..."
                    : (activity ? "Cập nhật" : "Tạo hoạt động")
                }
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-200"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
