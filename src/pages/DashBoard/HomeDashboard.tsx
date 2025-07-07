export default function HomeDashboard() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Tổng hoạt động</h3>
          <p className="text-3xl font-bold">{1}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Đang diễn ra</h3>
          <p className="text-3xl font-bold">
            {1}
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Sắp diễn ra</h3>
          <p className="text-3xl font-bold">
            {1}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Đã hoàn thành</h3>
          <p className="text-3xl font-bold">
            {1}
          </p>
        </div>
      </div>
    </div>
  );
}
