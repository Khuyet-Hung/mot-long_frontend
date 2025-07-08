import React, { useRef } from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {

  // Đếm số lần nhấn logo
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1000); // reset nếu không nhấn liên tiếp trong 1s
    if (clickCount.current === 3) {
      window.location.href = '/dashboard';
      clickCount.current = 0;
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">Tình Nguyện Viên</span>
            </div>
            <p className="text-gray-300 mb-4">
              Chúng tôi là nhóm tình nguyện viên nhiệt huyết, luôn sẵn sàng đồng hành cùng cộng đồng 
              để mang đến những giá trị tích cực cho xã hội.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Trang chủ</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#activities" className="text-gray-300 hover:text-white transition-colors">Hoạt động</a></li>
              <li><a href="#members" className="text-gray-300 hover:text-white transition-colors">Thành viên</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">contact@tinhnguyen.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        <div onClick={handleLogoClick} className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Nhóm Tình Nguyện Viên. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
