import { NavLink } from 'react-router-dom'

import image1 from '../../assets/The-Most-Important-Benefits-of-a-Greenhouse-GreenPro-Ventures 1.png'

function TrangChu() {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex px-30 py-5 gap-x-15 gap-y-5 flex-wrap">
        <img src={image1} className="flex-3 max-w-3xl" />
        <p className="block min-w-3xs flex-2 text-xl text-justify self-end">
          là một hệ thống được phát triển giúp bạn giám sát và điều khiển môi
          trường nhà kính mọi lúc, mọi nơi thông qua website.
        </p>
      </div>

      <div className="flex px-30 py-5 gap-x-15 gap-y-5 flex-wrap">
        <div className="flex-2 flex flex-col py-5 gap-x-15 gap-y-5 flex-wrap self-end">
          <h1 className="text-green-800 text-4xl font-bold">
            Điều khiển thiết bị từ xa
          </h1>
          <p className="block min-w-3xs text-justify text-xl">
            Bạn có thể điều khiển thiết bị từ xa theo hai chế độ linh hoạt: điều
            khiển trực tiếp hoặc hẹn giờ. Đồng thời hệ thống hỗ trợ tính năng
            điều khiển tự động tùy chỉnh
          </p>
          <a className="cursor-pointer hover:underline text-base text-gray-700">
            {`Thông tin thêm >>`}
          </a>
        </div>
        <img src={image1} className="flex-3 max-w-3xl" />
      </div>

      <div className="my-8 h-1 w-100 bg-gray-300" />

      <div className="flex flex-col my-2 items-center">
        <h1 className="text-green-800 text-4xl font-bold">
          Thông tin quan trắc
        </h1>
        <div className="flex my-10 gap-x-20">
          <div className="flex flex-col flex-1 max-w-xl">
            <img src={image1} />
            <div className="flex flex-col mt-5">
              <h2 className="text-3xl text-[#858250] font-semibold">
                Cập nhật liên tục
              </h2>
              <p className="text-justify text-xl">
                Tất cả các thông số quan trắc sẽ được cập nhật liên tục lên
                website, giúp bạn có thể theo dõi nhà kính từ xa vào bất kì lúc
                nào
              </p>
              <a className="mt-3 cursor-pointer hover:underline text-base text-gray-700">
                {`Thông tin thêm >>`}
              </a>
            </div>
          </div>
          <div className="flex flex-col flex-1 max-w-xl">
            <img src={image1} />
            <div className="flex flex-col mt-5">
              <h2 className="text-3xl text-[#858250] font-semibold">
                Truy xuất dễ dàng
              </h2>
              <p className="text-justify text-xl">
                Hệ thống lưu trữ dữ liệu quan trắc trong quá khứ, cho phép bạn
                tìm kiếm và truy cập dễ dàng, hỗ trợ chẩn đoán, phân tích và lập
                báo cáo
              </p>
              <a className="mt-3 cursor-pointer hover:underline text-base text-gray-700">
                {`Thông tin thêm >>`}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 h-1 w-100 bg-gray-300" />

      <div className="flex flex-col items-center">
        <h1 className="text-green-800 text-4xl font-bold mb-6">
          Và nhiều hơn thế nữa!
        </h1>
        <p className="block max-w-3xl text-xl mb-5 text-justify">
          Cùng với các tính năng như tự động cảnh báo khi thông số môi trường
          vượt ngưỡng, ghi nhận mọi hoạt động điều khiển, tùy chỉnh cấu hình hệ
          thống nhà kính,... Hệ thống smartGarden hứa hẹn sẽ giúp việc quản lý
          nhà kính thuận tiện hơn bao giờ hết!
        </p>
        <NavLink
          to="/huong-dan"
          className="mb-8 cursor-pointer hover:underline text-base text-gray-700"
        >
          {`Bảng hướng dẫn >>`}
        </NavLink>
      </div>
    </div>
  )
}

export default TrangChu
