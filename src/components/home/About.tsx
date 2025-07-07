import React from "react";
import { Heart, Users, Target, Globe } from "lucide-react";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: "Tình Yêu Thương",
      description:
        "Chúng tôi hoạt động với tình yêu thương chân thành, mong muốn chia sẻ và giúp đỡ những hoàn cảnh khó khăn.",
    },
    {
      icon: Users,
      title: "Đoàn Kết",
      description:
        "Sức mạnh của chúng tôi đến từ tinh thần đoàn kết, cùng nhau vượt qua mọi thử thách để đạt được mục tiêu chung.",
    },
    {
      icon: Target,
      title: "Hiệu Quả",
      description:
        "Mọi hoạt động được lên kế hoạch cẩn thận và thực hiện một cách chuyên nghiệp để đạt hiệu quả cao nhất.",
    },
    {
      icon: Globe,
      title: "Phát Triển Bền Vững",
      description:
        "Chúng tôi hướng tới những giải pháp lâu dài, tạo ra tác động tích cực và bền vững cho cộng đồng.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Về Chúng Tôi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Nhóm tình nguyện viên của chúng tôi được thành lập với sứ mệnh lan
            tỏa yêu thương và tạo ra những thay đổi tích cực trong cộng đồng.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Câu Chuyện Của Chúng Tôi
              </h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu từ năm 2020, nhóm chúng tôi đã được hình thành bởi những
                người trẻ có chung ý tưởng muốn đóng góp cho xã hội. Từ những
                hoạt động nhỏ ban đầu, chúng tôi đã dần phát triển thành một tổ
                chức với hơn 150 thành viên tích cực.
              </p>
              <p className="text-gray-600 mb-4">
                Qua 5 năm hoạt động, chúng tôi đã thực hiện hơn 50 dự án tình
                nguyện, từ hỗ trợ giáo dục cho trẻ em vùng cao, bảo vệ môi
                trường, đến chăm sóc người già và người khuyết tật.
              </p>
              <p className="text-gray-600">
                Mỗi hoạt động của chúng tôi đều được thực hiện với tinh thần
                trách nhiệm cao, minh bạch và hiệu quả, nhằm mang lại những giá
                trị thiết thực cho cộng đồng.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Sứ Mệnh & Tầm Nhìn
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900">Sứ Mệnh</h5>
                  <p className="text-gray-600 text-sm">
                    Kết nối và tạo cơ hội cho mọi người cùng tham gia các hoạt
                    động tình nguyện ý nghĩa, góp phần xây dựng một cộng đồng
                    đoàn kết và phát triển.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">Tầm Nhìn</h5>
                  <p className="text-gray-600 text-sm">
                    Trở thành tổ chức tình nguyện hàng đầu, tạo ra những tác
                    động tích cực và bền vững cho xã hội Việt Nam.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1, // Mỗi card sẽ xuất hiện sau card trước 0.1s
                }}
                className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <feature.icon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
