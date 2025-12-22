# Furniture Shop - Frontend

React + Vite application cho cửa hàng nội thất.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# App sẽ chạy tại http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Configuration

### Environment Variables

Tạo file `.env` (copy từ `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_CHECK_PAYMENT_URL_API=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

1. Clone repository:

```bash
git clone https://github.com/PhamHaThang/furniture_shop_frontend
cd furniture_shop_frontend
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

4. Cấu hình biến môi trường trong file `.env`:

```env
VITE_BASE_URL=http://localhost:5000/api
VITE_CHECK_PAYMENT_URL_API=your_check_payment_api_url
```

5. Khởi động development server:

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173`

## Build Production

```bash
npm run build
```

Xem preview build:

```bash
npm run preview
```

## Cấu trúc thư mục

```
src/
├── assets/          # Images, fonts, static files
├── components/      # React components
│   ├── common/      # Shared components
│   ├── layout/      # Layout components
│   └── ui/          # UI components
├── config/          # Configuration files
├── contexts/        # React Context (Auth, Cart, Wishlist)
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   ├── Admin/       # Admin pages
│   ├── Auth/        # Authentication pages
│   ├── Cart/        # Cart page
│   ├── Checkout/    # Checkout page
│   ├── Home/        # Home page
│   ├── Orders/      # Orders pages
│   ├── Products/    # Product pages
│   ├── Profile/     # Profile pages
│   └── Static/      # Static pages (About, Contact, etc.)
├── services/        # API services
└── utils/           # Utility functions
```

## Tính năng

### Người dùng

- 🔐 Đăng ký, đăng nhập, quản lý tài khoản
- 🛍️ Xem sản phẩm, tìm kiếm, lọc theo danh mục/thương hiệu
- 🛒 Giỏ hàng, wishlist
- 💳 Thanh toán COD và chuyển khoản ngân hàng
- ✅ Xác nhận thanh toán tự động (Bank transfer)
- 📦 Tra cứu đơn hàng, quản lý đơn hàng
- ⭐ Đánh giá sản phẩm
- 🎫 Áp dụng mã giảm giá

### Admin

- 👥 Quản lý người dùng
- 📦 Quản lý sản phẩm (CRUD, upload ảnh, model 3D)
- 🏷️ Quản lý danh mục, thương hiệu
- 📋 Quản lý đơn hàng, cập nhật trạng thái
- ⭐ Quản lý đánh giá
- 🎫 Quản lý mã giảm giá

## Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code với ESLint

## Environment Variables

- `VITE_BASE_URL` - Backend API URL (mặc định: http://localhost:5000/api)
- `VITE_CHECK_PAYMENT_URL_API` - URL API check payment cho chức năng xác nhận thanh toán chuyển khoản

## Notes

- Sử dụng React Context API cho state management (Auth, Cart, Wishlist)
- Axios interceptor tự động thêm JWT token vào requests
- Responsive design với Tailwind CSS
- Image optimization với Cloudinary
- Auto-redirect khi token expired (401)
