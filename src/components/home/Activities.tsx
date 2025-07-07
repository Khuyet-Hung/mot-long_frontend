import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Image, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../../services/activitiesService';
import { messageUtils } from '../../utils/messageUtils';
import type { Activity } from '../../types';

export const Activities: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activitiesPerPage] = useState(3);
  const [allLoadedActivities, setAllLoadedActivities] = useState<Activity[]>([]);
  
  // Image preview state
  const [previewImage, setPreviewImage] = useState<{
    images: string[];
    currentIndex: number;
    title: string;
  } | null>(null);

  // Fetch activities từ API
  const fetchActivities = async (page: number) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setPageLoading(true);
      }
      
      const response = await apiService.getActivities({
        page,
        limit: activitiesPerPage,
        sortBy: 'date',
        sortOrder: 'desc'
      });
      
      const newActivities = response.data.activities || [];
      
      if (page === 1) {
        setAllLoadedActivities(newActivities);
        setActivities(newActivities);
      } else {
        setAllLoadedActivities(prev => [...prev, ...newActivities]);
        setActivities(newActivities);
      }
      
      // Check if there are more activities to load
      setHasMore(newActivities.length === activitiesPerPage);
      
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      messageUtils.error('Không thể tải danh sách hoạt động. Vui lòng thử lại sau.');
      if (page === 1) {
        setActivities([]);
        setAllLoadedActivities([]);
      }
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  // Load next page
  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Load previous page
  const prevPage = () => {
    if (currentPage > 1) {
      // Nếu đã load trước đó, lấy từ cache
      const startIndex = (currentPage - 2) * activitiesPerPage;
      const endIndex = startIndex + activitiesPerPage;
      const prevPageItems = allLoadedActivities.slice(startIndex, endIndex);
      
      setCurrentPage(prev => prev - 1);
      setActivities(prevPageItems);
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Activity['status']) => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      default: return 'Không rõ';
    }
  };

  // Image preview functions
  const openImagePreview = (images: string[], index: number, title: string) => {
    setPreviewImage({
      images,
      currentIndex: index,
      title
    });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const nextImage = () => {
    if (previewImage && previewImage.currentIndex < previewImage.images.length - 1) {
      setPreviewImage({
        ...previewImage,
        currentIndex: previewImage.currentIndex + 1
      });
    }
  };

  const prevImage = () => {
    if (previewImage && previewImage.currentIndex > 0) {
      setPreviewImage({
        ...previewImage,
        currentIndex: previewImage.currentIndex - 1
      });
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!previewImage) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeImagePreview();
          break;
      }
    };

    if (previewImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [previewImage]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải hoạt động...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Hoạt Động Của Chúng Tôi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Khám phá những hoạt động ý nghĩa mà nhóm chúng tôi đã và đang thực hiện
          </motion.p>
        </div>


        {/* Activities Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {activities.map((activity) => (
            <motion.div 
              key={activity._id || activity.id} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {activity.images.length > 0 && (
                <img
                  src={activity.images[0]}
                  alt={activity.title}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImagePreview(activity.images, 0, activity.title)}
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {getStatusText(activity.status)}
                  </span>
                  <span className="text-sm text-gray-500">{activity.category}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{activity.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(activity.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{activity.participants} người tham gia</span>
                  </div>
                </div>
                
                {(activity.images.length > 0 || activity.videos.length > 0) && (
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    {activity.images.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Image className="h-4 w-4" />
                        <span>{activity.images.length} ảnh</span>
                      </div>
                    )}
                    {activity.videos.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        <span>{activity.videos.length} video</span>
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedActivity(activity)}
                  className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
                >
                  Xem Chi Tiết
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {activities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Chưa có hoạt động nào được tạo.</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12 gap-4 items-center"
        >
          <button
            onClick={prevPage}
            disabled={currentPage === 1 || pageLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              currentPage === 1 || pageLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            Trang trước
          </button>
          
          <span className="text-gray-700 font-medium">Trang {currentPage}</span>
          
          <button
            onClick={nextPage}
            disabled={!hasMore || pageLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              !hasMore || pageLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 transition-colors'
            }`}
          >
            {pageLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang tải...
              </>
            ) : (
              <>
                Trang tiếp theo
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </motion.div>

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedActivity.title}</h3>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 mb-4">{selectedActivity.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>{new Date(selectedActivity.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>{selectedActivity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span>{selectedActivity.participants} người tham gia</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedActivity.status)} mb-4`}>
                      {getStatusText(selectedActivity.status)}
                    </div>
                    <p className="text-sm text-gray-500">Danh mục: {selectedActivity.category}</p>
                  </div>
                </div>
                
                {/* Media Gallery */}
                {(selectedActivity.images.length > 0 || selectedActivity.videos.length > 0) && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh & Video</h4>
                    
                    {selectedActivity.images.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-md font-medium text-gray-700 mb-2">Hình ảnh</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedActivity.images.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`${selectedActivity.title} - ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImagePreview(selectedActivity.images, index, selectedActivity.title)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedActivity.videos.length > 0 && (
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-2">Video</h5>
                        <div className="space-y-4">
                          {selectedActivity.videos.map((url, index) => (
                            <video
                              key={index}
                              src={url}
                              controls
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Image Preview Modal */}
        {previewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
            >
              {/* Close Button */}
              <button
                onClick={closeImagePreview}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="h-8 w-8" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full z-10">
                {previewImage.currentIndex + 1} / {previewImage.images.length}
              </div>

              {/* Image Title */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-center z-10">
                <h3 className="text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                  {previewImage.title}
                </h3>
              </div>

              {/* Previous Button */}
              {previewImage.currentIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
              )}

              {/* Next Button */}
              {previewImage.currentIndex < previewImage.images.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              )}

              {/* Main Image */}
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={previewImage.currentIndex} // Để kích hoạt animation khi thay đổi ảnh
                transition={{ duration: 0.3 }}
                src={previewImage.images[previewImage.currentIndex]}
                alt={`${previewImage.title} - ${previewImage.currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />

              {/* Click outside to close */}
              <div
                className="absolute inset-0 -z-10"
                onClick={closeImagePreview}
              />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};
