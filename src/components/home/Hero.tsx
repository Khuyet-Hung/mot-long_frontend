import React from 'react';
import { Heart, Users, Target, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, transform: 'translateY(-20px)' }}
          animate={{ opacity: 1, transform: 'translateY(0)' }}
          exit={{ opacity: 0, transform: 'translateY(-20px)' }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Cùng Nhau Lan Tỏa <span className="text-yellow-300">Yêu Thương</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Chúng tôi là một nhóm tình nguyện viên nhiệt huyết, luôn sẵn sàng đồng hành cùng cộng đồng 
              để mang đến những giá trị tích cực cho xã hội.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Tham Gia Ngay
              </button>
              <button className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                Xem Hoạt Động
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, transform: 'translateY(20px)' }}
          animate={{ opacity: 1, transform: 'translateY(0)' }}
          exit={{ opacity: 0, transform: 'translateY(20px)' }}
        >
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
            <div className="text-3xl font-bold">150+</div>
            <div className="text-blue-100">Thành viên</div>
          </div>
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
            <div className="text-3xl font-bold">50+</div>
            <div className="text-blue-100">Hoạt động</div>
          </div>
          <div className="text-center">
            <Heart className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
            <div className="text-3xl font-bold">1000+</div>
            <div className="text-blue-100">Người được giúp</div>
          </div>
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-2 text-yellow-300" />
            <div className="text-3xl font-bold">5</div>
            <div className="text-blue-100">Năm hoạt động</div>
          </div>
        </div>
        </motion.div>
      </div>
    </section>
  );
};
