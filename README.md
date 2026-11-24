# HOMI Shop — Frontend

Giao diện cửa hàng nội thất HOMI Shop, xây dựng bằng React và Vite. Ứng dụng bao gồm trang mua sắm, quản lý tài khoản và khu vực quản trị; gọi REST API của backend để đọc và cập nhật dữ liệu.

## Tính năng

### Khách hàng

- Đăng ký, đăng nhập, khôi phục mật khẩu và quản lý hồ sơ, địa chỉ giao hàng.
- Tìm kiếm, lọc sản phẩm theo danh mục/thương hiệu và xem chi tiết sản phẩm.
- Xem mô hình 3D và mở trải nghiệm AR trên thiết bị hỗ trợ.
- Quản lý giỏ hàng, danh sách yêu thích, áp dụng mã giảm giá.
- Đặt hàng bằng COD hoặc chuyển khoản ngân hàng; xem lịch sử và tra cứu đơn hàng.
- Đánh giá sản phẩm từ đơn hàng đủ điều kiện.
- Xem gợi ý sản phẩm và trò chuyện với trợ lý tư vấn tích hợp Puter AI.

### Quản trị viên

- Quản lý người dùng, sản phẩm, danh mục, thương hiệu, đánh giá và khuyến mãi.
- Upload ảnh, mô hình 3D thông qua backend.
- Quản lý đơn hàng và cập nhật trạng thái giao hàng, thanh toán.
- Xem thống kê, phân tích cảm xúc đánh giá và kết quả phân cụm sản phẩm/người dùng.

## Công nghệ

| Công nghệ | Vai trò |
| --- | --- |
| React 19, React Router 7 | Giao diện và định tuyến |
| Vite 7 | Chạy môi trường phát triển và build |
| Tailwind CSS 4 | Định dạng giao diện |
| Axios | Gọi backend và xử lý token |
| React Context | Trạng thái xác thực, giỏ hàng và wishlist |
| Lucide React, React Hot Toast | Biểu tượng và thông báo |
| Google Model Viewer | Hiển thị mô hình 3D và AR |
| Puter.js | Tích hợp chatbot AI |

## Cài đặt và chạy

Cần Node.js `20.19+` thuộc nhánh 20 hoặc `22.12+` và npm, theo yêu cầu Vite trong lockfile hiện tại. Backend cần chạy để sử dụng các chức năng có dữ liệu và xác thực.

Có thể clone frontend riêng:

```powershell
git clone https://github.com/PhamHaThang/furniture_shop_frontend.git
cd furniture_shop_frontend
```

Nếu đã clone dự án tổng, mở terminal trong thư mục `frontend`. Các lệnh tiếp theo chạy tại thư mục chứa `package.json` của frontend:

```powershell
npm install
Copy-Item .env.example .env
```

### Biến môi trường

Sửa `frontend/.env` hoặc `.env` tại thư mục gốc nếu clone frontend riêng:

```dotenv
VITE_BASE_URL=http://localhost:5000/api
VITE_CHECK_PAYMENT_URL_API=
```

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_BASE_URL` | URL backend, gồm tiền tố `/api`; mặc định `http://localhost:5000/api` |
| `VITE_CHECK_PAYMENT_URL_API` | URL Google Apps Script trả dữ liệu giao dịch cho chức năng kiểm tra chuyển khoản |

Tên biến API được mã nguồn sử dụng là **`VITE_BASE_URL`**. Nếu chưa cấu hình dịch vụ kiểm tra giao dịch, để trống biến thứ hai và dùng COD khi thử luồng đặt hàng. Khởi động lại Vite sau khi thay đổi `.env`.

Biến `VITE_*` được đưa vào mã frontend và có thể được người dùng xem. Chỉ lưu cấu hình công khai, không đặt mật khẩu hoặc khóa API bí mật trong các biến này.

### Chạy môi trường phát triển

```powershell
npm run dev
```

Giao diện mặc định mở tại http://localhost:5173. Backend cần cho phép origin này qua `FRONTEND_URL`; nếu Vite chuyển sang cổng khác vì cổng đang bận, cập nhật cấu hình CORS của backend cho khớp.

Để dùng gợi ý và thống kê ML, chạy thêm dịch vụ Python và cấu hình kết nối ở backend. Frontend gọi các chức năng này thông qua backend.

## Các trang chính

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ |
| `/products`, `/products/:slug` | Danh sách và chi tiết sản phẩm |
| `/categories`, `/categories/:slug` | Danh mục và sản phẩm thuộc danh mục |
| `/brands`, `/brands/:slug` | Thương hiệu và sản phẩm thuộc thương hiệu |
| `/promotions` | Khuyến mãi |
| `/login`, `/register` | Đăng nhập, đăng ký |
| `/forgot-password`, `/reset-password` | Khôi phục mật khẩu |
| `/cart`, `/wishlist`, `/checkout` | Giỏ hàng, yêu thích và đặt hàng |
| `/profile`, `/orders`, `/orders/:id` | Tài khoản, lịch sử và chi tiết đơn hàng |
| `/admin` | Tổng quan quản trị |
| `/admin/users`, `/admin/products`, `/admin/categories`, `/admin/brands` | Quản lý tài khoản và hàng hóa |
| `/admin/orders`, `/admin/reviews`, `/admin/promotions` | Quản lý giao dịch, đánh giá và khuyến mãi |
| `/admin/ml-analytics`, `/admin/clusters` | Phân tích dữ liệu và phân cụm |

Các trang quản trị yêu cầu tài khoản có `role: "admin"`. Khi khởi tạo môi trường phát triển, đăng ký tài khoản rồi cập nhật quyền quản trị trong MongoDB theo hướng dẫn backend và đăng nhập lại.

## Kết nối API và trạng thái ứng dụng

- [src/config/constants.js](src/config/constants.js) khai báo URL API, khóa lưu trữ và các hằng số giao diện.
- [src/services/api.js](src/services/api.js) tạo Axios client, tự thêm `Authorization: Bearer <token>` từ localStorage và chuẩn hóa lỗi API.
- Khi gặp lỗi 401 phù hợp với điều kiện trong interceptor, ứng dụng xóa thông tin xác thực đã lưu và chuyển về trang đăng nhập.
- `AuthContext`, `CartContext`, `WishlistContext` quản lý trạng thái dùng chung; các module trong `src/services/` phụ trách từng nhóm API.

## 3D, AR và chatbot

Google Model Viewer và Puter.js được tải bằng script ngoài trong [index.html](index.html), cần kết nối mạng để sử dụng.

Sản phẩm cần `model3DUrl` hợp lệ để hiển thị trình xem 3D/AR. Khả năng AR phụ thuộc định dạng mô hình, thiết bị và trình duyệt; khi truy cập từ điện thoại cần môi trường HTTPS phù hợp. Có thể xem 3D bằng thao tác xoay và phóng to ngay cả khi thiết bị không hỗ trợ AR.

Chatbot gọi `window.puter.ai.chat` khi khả dụng. Nếu không nhận được phản hồi AI, ứng dụng dùng logic từ khóa, câu trả lời định sẵn và tìm kiếm sản phẩm qua backend.

## Thanh toán chuyển khoản

Luồng kiểm tra giao dịch gọi `VITE_CHECK_PAYMENT_URL_API` và đọc mảng `data` trong JSON trả về. Mỗi giao dịch được đọc qua các trường `Mô tả`, `Số tiền`, `Mã GD`.

**Chức năng đang ở chế độ demo:** [CheckoutPage.jsx](src/pages/Checkout/CheckoutPage.jsx) đặt `isDemoMode = true`, có thể chấp nhận giao dịch mà không đối chiếu số tiền và nội dung. Cần hoàn thiện xác thực thanh toán phía server trước khi dùng cho giao dịch thật.

Thông tin tài khoản nhận tiền và URL VietQR đang đặt trực tiếp trong [PaymentSection.jsx](src/pages/Checkout/components/PaymentSection.jsx). Điều chỉnh dữ liệu này cho cửa hàng trước khi sử dụng.

## Build và kiểm tra mã

```powershell
npm run lint
npm run build
npm run preview
```

| Lệnh | Kết quả |
| --- | --- |
| `npm run dev` | Chạy Vite ở chế độ phát triển, cổng mặc định `5173` |
| `npm run lint` | Kiểm tra mã bằng ESLint |
| `npm run build` | Tạo bản build trong `dist/` |
| `npm run preview` | Xem bản build đã tạo tại http://localhost:4173 |

Khi build cho môi trường khác, đặt `VITE_BASE_URL` tương ứng trước lúc build. Ứng dụng dùng `BrowserRouter`, vì vậy máy chủ phục vụ bản build cần đưa các đường dẫn giao diện về `index.html`. Repository có cấu hình rewrite trong `vercel.json` và `public/_redirects`.

Hiện `package.json` chưa khai báo lệnh kiểm thử tự động. Có thể kiểm tra thủ công luồng đăng nhập, tìm sản phẩm, thêm giỏ hàng, đặt COD và quyền truy cập trang quản trị sau khi thay đổi cấu hình.

## Cấu trúc mã nguồn

```text
frontend/
├── public/                  # Tài nguyên tĩnh và cấu hình redirect
├── src/
│   ├── components/
│   │   ├── common/          # ProtectedRoute, chatbot, phân trang...
│   │   ├── layout/          # Layout khách hàng, xác thực và quản trị
│   │   └── ui/              # Button, Input, Modal, ProductCard...
│   ├── config/              # URL API và hằng số
│   ├── contexts/            # Auth, Cart, Wishlist
│   ├── hooks/               # Phân trang, debounce, media query
│   ├── pages/               # Các trang theo nhóm chức năng
│   ├── services/            # Axios client và các dịch vụ gọi API
│   ├── utils/               # Định dạng, prompt và tiện ích
│   ├── App.jsx              # Khai báo routes
│   ├── index.css            # CSS và cấu hình giao diện
│   └── main.jsx             # Khởi tạo React và context providers
└── vite.config.js
```

## Xử lý lỗi thường gặp

| Hiện tượng | Cách kiểm tra |
| --- | --- |
| Không cài hoặc chạy được Vite | Kiểm tra phiên bản Node.js đáp ứng yêu cầu ở trên |
| Không tải được sản phẩm | Kiểm tra backend và `VITE_BASE_URL`, bao gồm `/api` |
| Bị chặn CORS | Kiểm tra `FRONTEND_URL` của backend khớp origin frontend |
| Không truy cập được `/admin` | Kiểm tra trạng thái đăng nhập và quyền `admin` của tài khoản |
| Không hiện mô hình 3D | Kiểm tra `model3DUrl`, định dạng tệp và script Model Viewer |
| Kiểm tra chuyển khoản thất bại | Kiểm tra URL Apps Script và cấu trúc JSON giao dịch |
| Reload trang con bị 404 trên hosting | Kiểm tra cấu hình rewrite về `index.html` |
