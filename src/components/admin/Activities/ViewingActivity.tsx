import type { Activity } from "../../../types";

const ViewingActivity = ({ activity, onClose }: { activity: Activity | null; onClose: () => void }) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{activity.title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ngày:</strong> {new Date(activity.date).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Địa điểm:</strong> {activity.location}</p>
                    <p><strong>Số người tham gia:</strong> {activity.participants}</p>
                    <p><strong>Danh mục:</strong> {activity.category}</p>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    <p><strong>Trạng thái:</strong> {activity.status}</p>
                  </div>
                  
                  {activity.images.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Hình ảnh</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {activity.images.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Activity ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activity.videos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Video</h4>
                      <div className="space-y-2">
                        {activity.videos.map((url, index) => (
                          <video
                            key={index}
                            src={url}
                            controls
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
};

export default ViewingActivity;