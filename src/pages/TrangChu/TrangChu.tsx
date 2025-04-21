import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import image1 from '../../assets/The-Most-Important-Benefits-of-a-Greenhouse-GreenPro-Ventures 1.png';

function TrangChu() {
  return (
    <div className="flex flex-col w-full items-center">
      <motion.div
        className="flex py-5 gap-x-15 gap-y-5 flex-wrap"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <img
          src={image1}
          className="flex-3 max-w-3xl rounded-xl shadow-md backdrop-blur-md hover:scale-105 transition-transform duration-300"
        />
        <p className="block min-w-3xs flex-2 text-lg text-justify self-end bg-white/40 p-4 rounded-lg shadow-sm backdrop-blur-md">
          là một hệ thống được phát triển giúp bạn giám sát và điều khiển môi
          trường nhà kính mọi lúc, mọi nơi thông qua website.
        </p>
      </motion.div>

      <motion.div
        className="flex py-5 gap-x-15 gap-y-5 flex-wrap"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="flex-2 flex flex-col py-5 gap-x-15 gap-y-5 flex-wrap self-end">
          <h1 className="text-green-800 text-3xl font-bold">
            Điều khiển thiết bị từ xa
          </h1>
          <p className="block min-w-3xs text-justify text-lg bg-white/40 p-4 rounded-lg shadow-sm backdrop-blur-md">
            Bạn có thể điều khiển thiết bị từ xa theo hai chế độ linh hoạt: điều
            khiển trực tiếp hoặc hẹn giờ. Đồng thời hệ thống hỗ trợ tính năng
            điều khiển tự động tùy chỉnh
          </p>
          <a className="cursor-pointer hover:underline text-base text-gray-700">
            Thông tin thêm &gt;&gt;
          </a>
        </div>
        <img
          src={image1}
          className="flex-3 max-w-3xl rounded-xl shadow-md backdrop-blur-md hover:scale-105 transition-transform duration-300"
        />
      </motion.div>

      <div className="my-8 h-1 w-100 bg-gray-300" />

      <motion.div
        className="flex flex-col my-2 items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h1 className="text-green-800 text-3xl font-bold">
          Thông tin quan trắc
        </h1>
        <div className="flex my-10 gap-x-20">
          {["Cập nhật liên tục", "Truy xuất dễ dàng"].map((title, index) => (
            <motion.div
              key={index}
              className="flex flex-col flex-1 max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={image1}
                className="flex-3 max-w-3xl rounded-xl shadow-md backdrop-blur-md hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col mt-5 bg-white/40 p-4 rounded-lg shadow-sm backdrop-blur-md">
                <h2 className="text-2xl text-[#858250] font-semibold">
                  {title}
                </h2>
                <p className="text-justify text-lg">
                  {index === 0
                    ? 'Tất cả các thông số quan trắc sẽ được cập nhật liên tục lên website, giúp bạn có thể theo dõi nhà kính từ xa vào bất kì lúc nào'
                    : 'Hệ thống lưu trữ dữ liệu quan trắc trong quá khứ, cho phép bạn tìm kiếm và truy cập dễ dàng, hỗ trợ chẩn đoán, phân tích và lập báo cáo'}
                </p>
                <a className="mt-3 cursor-pointer hover:underline text-base text-gray-700">
                  Thông tin thêm &gt;&gt;
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mb-8 h-1 w-100 bg-gray-300" />

      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="text-green-800 text-3xl font-bold mb-6">
          Và nhiều hơn thế nữa!
        </h1>
        <p className="block max-w-3xl text-lg mb-5 text-justify bg-white/40 p-4 rounded-lg shadow-sm backdrop-blur-md">
          Cùng với các tính năng như tự động cảnh báo khi thông số môi trường
          vượt ngưỡng, ghi nhận mọi hoạt động điều khiển, tùy chỉnh cấu hình hệ
          thống nhà kính,... Hệ thống smartGarden hứa hẹn sẽ giúp việc quản lý
          nhà kính thuận tiện hơn bao giờ hết!
        </p>
        <NavLink
          to="/huong-dan"
          className="mb-8 cursor-pointer hover:underline text-base text-gray-700"
        >
          Bảng hướng dẫn &gt;&gt;
        </NavLink>
      </motion.div>
    </div>
  );
}

export default TrangChu;