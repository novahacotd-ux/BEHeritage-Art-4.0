# Heritage Art Backend API

Backend API toàn diện cho nền tảng Heritage Art - Nơi kết nối Di sản, Nghệ thuật và Cộng đồng.

## 🛠️ Công nghệ sử dụng

- **Node.js** v18+
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Socket.IO** - Real-time communication (Chat, Notifications)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation

## 📋 Tính năng

### 1. Xác thực & Phân quyền (Auth & RBAC)

- Đăng ký, Đăng nhập, Quản lý Profile.
- **Phân quyền đa cấp độ**:
  - `ADMIN`: Quản trị hệ thống.
  - `PREMIUM`: Người dùng trả phí.
  - `ART_PATRON`: Nhà bảo trợ.
  - `TEACHER`, `STUDENT`: Môi trường giáo dục.
  - `USER`: Người dùng cơ bản.

### 2. Mạng xã hội & Tương tác (Social & Real-time)

- **Kết bạn**: Gửi lời mời, chấp nhận/từ chối, danh sách bạn bè.
- **Chat Real-time**: Nhắn tin 1-1, thông báo tin nhắn mới, trạng thái online/offline.
- **Socket.IO Events**: Xử lý kết nối thời gian thực mượt mà.

### 3. Cộng đồng (Community Forum)

- **Bài viết (Posts)**: Tạo bài viết với nội dung text, hình ảnh và video.
- **Tương tác**: Like, Comment bài viết.
- **Media**: Hỗ trợ upload nhiều ảnh và video cho bài viết.

### 4. Di sản & Văn hóa (Heritage & Culture)

- **Di tích lịch sử (Historical Sites)**: Bản đồ di tích, thông tin chi tiết, hình ảnh 360/thông thường.
- **Thời kỳ & Vùng miền**: Phân loại di sản theo dòng thời gian và địa lý.
- **Sự kiện (Events)**: Tổ chức sự kiện, đăng ký tham gia, hỏi đáp (FAQs), thư viện ảnh.
- **Tin tức (News)**: Cập nhật tin tức văn hóa nghệ thuật.

### 5. Thương mại điện tử (E-commerce)

- **Sản phẩm**: Danh mục, chủ đề, phong cách.
- **Giỏ hàng & Đơn hàng**: Quy trình mua sắm đầy đủ.
- **Thanh toán**: Tích hợp quản lý thanh toán.
- **Địa chỉ**: Quản lý sổ địa chỉ giao hàng.

### 6. Công nghệ hỗ trợ & Khác

- **AI Tools**: Danh sách và đánh giá các công cụ AI hỗ trợ nghệ thuật.
- **Phân tích (Analytics)**: Thống kê lượt xem (Analyze Views).
- **Upload**: Hệ thống upload file tập trung.

## 📁 Cấu trúc dự án

```
BEHeritage-Art-4.0/
├── config/              # Cấu hình DB, Cloudinary, etc.
├── src/
│   ├── controllers/     # Logic xử lý
│   │   ├── StoreController/  # E-commerce core
│   │   ├── aiController.js
│   │   ├── eventController.js
│   │   ├── forumController.js
│   │   ├── friendController.js
│   │   ├── messageController.js
│   │   ├── siteController.js
│   │   └── ...
│   ├── middleware/      # Auth, Upload, Validate
│   ├── models/          # Sequelize Models (30+ tables)
│   ├── routes/          # API Routes definitions
│   ├── utils/           # Helpers
│   └── server.js        # App entry & Socket.IO setup
├── migrations/          # DB Migrations
├── seeders/             # DB Seeders
└── package.json
```

## 🚀 Cài đặt và chạy

### 1. Chuẩn bị môi trường

- Clone repo: `git clone <repo_url>`
- Cài đặt dependencies: `npm install`
- Tạo file `.env` (copy từ `.env.example`).

### 2. Cấu hình Database & Biến môi trường

Cập nhật `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=heritage_art_db
JWT_SECRET=secret_key
FRONTEND_URL=http://localhost:5173
```

### 3. Khởi tạo Database

```bash
# Chạy migration
npm run migrate

# Tạo dữ liệu mẫu
npm run seed
```

### 4. Chạy Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 Socket.IO Real-time API

Kết nối tới namespace chính `/`.

### Client Emits (Gửi lên server)

| Event                     | Data Packet                    | Mô tả                           |
| ------------------------- | ------------------------------ | ------------------------------- |
| `join`                    | `userId` (int)                 | Xác nhận user online.           |
| `send_message`            | `{ receiver_id, message: {} }` | Gửi tin nhắn.                   |
| `send_friend_request`     | `{ receiver_id, request: {} }` | Gửi lời mời kết bạn.            |
| `friend_request_accepted` | `{ user_id, friendship: {} }`  | Thông báo đã chấp nhận kết bạn. |

### Server Emits (Gửi về client)

| Event                    | Data Packet      | Mô tả                         |
| ------------------------ | ---------------- | ----------------------------- |
| `user_online`            | `{ userId }`     | Thông báo có user vừa online. |
| `user_offline`           | `{ userId }`     | Thông báo user đã offline.    |
| `receive_message`        | `message` object | Nhận tin nhắn mới.            |
| `receive_friend_request` | `request` object | Nhận lời mời kết bạn mới.     |

## 📚 RESTful API Overview

Hệ thống có hơn 60 endpoints. Dưới đây là các nhóm chính:

### Authentication

- `POST /api/auth/register`: Đăng ký
- `POST /api/auth/login`: Đăng nhập
- `GET /api/auth/profile`: Lấy thông tin cá nhân

### Social & Chat

- `GET /api/friends`: Danh sách bạn bè
- `POST /api/friends/request`: Gửi lời mời kết bạn
- `GET /api/messages/:friendId`: Lấy lịch sử chat
- `POST /api/messages`: Gửi tin nhắn (fallback HTTP)

### Heritage & Content

- `GET /api/sites`: Danh sách di tích (Map data)
- `GET /api/events`: Sự kiện sắp tới
- `POST /api/events/:id/register`: Đăng ký tham gia
- `GET /api/forums/posts`: Newfeed cộng đồng
- `GET /api/news`: Tin tức

### E-commerce

- `GET /api/products`: Duyệt sản phẩm
- `POST /api/cart/items`: Thêm vào giỏ
- `POST /api/orders`: Thanh toán đơn hàng

---

**Heritage Art Team** 🚀
