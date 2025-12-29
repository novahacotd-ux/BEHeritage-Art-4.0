# Heritage Art Backend API

Backend API cho nền tảng Heritage Art với hệ thống xác thực và phân quyền đầy đủ.

## 🛠️ Công nghệ sử dụng

- **Node.js** v18+
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

## 📋 Tính năng

### Xác thực & Phân quyền
- ✅ Đăng ký và đăng nhập người dùng
- ✅ Xác thực JWT
- ✅ Phân quyền theo vai trò (RBAC)
- ✅ Quản lý người dùng (CRUD)
- ✅ Quản lý vai trò
- ✅ Mã hóa mật khẩu với Bcrypt
- ✅ Validation đầu vào
- ✅ Error handling

### E-commerce
- ✅ Quản lý sản phẩm (CRUD với phân trang, tìm kiếm, lọc)
- ✅ Quản lý danh mục (Categories, Topics, Styles)
- ✅ Giỏ hàng (thêm, sửa, xóa sản phẩm)
- ✅ Quản lý đơn hàng (tạo, cập nhật trạng thái, hủy)
- ✅ Quản lý địa chỉ giao hàng
- ✅ Quản lý thanh toán
- ✅ Tự động cập nhật tồn kho khi đặt/hủy đơn
- ✅ Soft delete cho sản phẩm
- ✅ Cấu trúc MVC

## 🎭 Các vai trò (Roles)

1. **ADMIN** - Quản trị viên (toàn quyền)
2. **PREMIUM** - Người dùng cao cấp
3. **ART_PATRON** - Nhà bảo trợ nghệ thuật
4. **TEACHER** - Giáo viên
5. **STUDENT** - Học sinh
6. **USER** - Người dùng thông thường

## 📁 Cấu trúc dự án

```
BEHeritage-Art-4.0/
├── config/
│   ├── database.js          # Database configuration
│   └── db.js                # Database connection
├── migrations/              # Database migrations
├── seeders/                 # Database seeders
├── src/
│   ├── controllers/         # Controllers (MVC)
│   │   ├── StoreController/ # E-commerce controllers
│   │   │   ├── cartController.js
│   │   │   ├── categoryController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── productController.js
│   │   │   ├── styleController.js
│   │   │   └── topicController.js
│   │   ├── addressController.js
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── roleController.js
│   ├── middleware/          # Middleware functions
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/              # Database models
│   │   ├── Address.js
│   │   ├── Cart.js
│   │   ├── CartItem.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── OrderDetail.js
│   │   ├── Payment.js
│   │   ├── Product.js
│   │   ├── Role.js
│   │   ├── Style.js
│   │   ├── Topic.js
│   │   ├── User.js
│   │   └── index.js
│   ├── routes/              # API routes
│   │   ├── addressRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── roleRoutes.js
│   │   ├── styleRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── utils/               # Utility functions
│   │   ├── jwt.js
│   │   └── validators.js
│   └── server.js            # Entry point
├── .env.example             # Environment variables template
├── .gitignore
├── .sequelizerc             # Sequelize CLI config
└── package.json
```

## 🚀 Cài đặt và chạy

### 1. Clone repository và cài đặt dependencies

```bash
cd BEHeritage-Art-4.0
npm install
```

### 2. Cấu hình database

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=heritage_art_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_very_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:3000
```

### 3. Tạo database

```bash
# Tạo database trong PostgreSQL
psql -U postgres
CREATE DATABASE heritage_art_db;
\q
```

### 4. Chạy migrations

```bash
npm run migrate
```

### 5. Chạy seeders (tạo dữ liệu mẫu)

```bash
npm run seed
```

Seeder sẽ tạo:
- 6 roles: ADMIN, PREMIUM, ART_PATRON, TEACHER, STUDENT, USER
- 1 admin user:
  - Username: `admin`
  - Email: `admin@heritage-art.com`
  - Password: `Admin@123`

### 6. Chạy server

```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| POST | `/api/auth/register` | Đăng ký user mới | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| GET | `/api/auth/profile` | Xem thông tin user hiện tại | Private |
| POST | `/api/auth/logout` | Đăng xuất | Private |

### User Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/users` | Lấy danh sách users | ADMIN |
| GET | `/api/users/:id` | Lấy user theo ID | ADMIN |
| POST | `/api/users` | Tạo user mới | ADMIN |
| PUT | `/api/users/:id` | Cập nhật user | ADMIN |
| DELETE | `/api/users/:id` | Xóa user | ADMIN |

### Role Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/roles` | Lấy danh sách roles | ADMIN |
| GET | `/api/roles/:id` | Lấy role theo ID | ADMIN |
| POST | `/api/roles` | Tạo role mới | ADMIN |
| PUT | `/api/roles/:id` | Cập nhật role | ADMIN |
| DELETE | `/api/roles/:id` | Xóa role | ADMIN |

### Category Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/categories` | Lấy danh sách categories (có phân trang, tìm kiếm) | Public |
| GET | `/api/categories/:id` | Lấy category theo ID | Public |
| POST | `/api/categories` | Tạo category mới | ADMIN |
| PUT | `/api/categories/:id` | Cập nhật category | ADMIN |
| DELETE | `/api/categories/:id` | Xóa category | ADMIN |

### Topic Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/topics` | Lấy danh sách topics (có phân trang, tìm kiếm) | Public |
| GET | `/api/topics/:id` | Lấy topic theo ID | Public |
| POST | `/api/topics` | Tạo topic mới | ADMIN |
| PUT | `/api/topics/:id` | Cập nhật topic | ADMIN |
| DELETE | `/api/topics/:id` | Xóa topic | ADMIN |

### Style Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/styles` | Lấy danh sách styles (có phân trang, tìm kiếm) | Public |
| GET | `/api/styles/:id` | Lấy style theo ID | Public |
| POST | `/api/styles` | Tạo style mới | ADMIN |
| PUT | `/api/styles/:id` | Cập nhật style | ADMIN |
| DELETE | `/api/styles/:id` | Xóa style | ADMIN |

### Product Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/products` | Lấy danh sách products (có phân trang, tìm kiếm, lọc) | Public |
| GET | `/api/products/:id` | Lấy product theo ID | Public |
| POST | `/api/products` | Tạo product mới | ADMIN |
| PUT | `/api/products/:id` | Cập nhật product | ADMIN |
| PUT | `/api/products/:id/stock` | Cập nhật số lượng tồn kho | ADMIN |
| DELETE | `/api/products/:id` | Xóa product (soft delete) | ADMIN |

### Cart Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/cart` | Lấy giỏ hàng của user hiện tại | Private |
| POST | `/api/cart/items` | Thêm sản phẩm vào giỏ hàng | Private |
| PUT | `/api/cart/items/:product_id` | Cập nhật số lượng sản phẩm trong giỏ | Private |
| DELETE | `/api/cart/items/:product_id` | Xóa sản phẩm khỏi giỏ hàng | Private |
| DELETE | `/api/cart` | Xóa toàn bộ giỏ hàng | Private |

### Order Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/orders` | Lấy tất cả đơn hàng | ADMIN |
| GET | `/api/orders/me` | Lấy đơn hàng của user hiện tại | Private |
| GET | `/api/orders/:id` | Lấy đơn hàng theo ID | Owner/ADMIN |
| POST | `/api/orders` | Tạo đơn hàng từ giỏ hàng | Private |
| PUT | `/api/orders/:id/status` | Cập nhật trạng thái đơn hàng | ADMIN |
| PUT | `/api/orders/:id/cancel` | Hủy đơn hàng | Owner/ADMIN |

### Address Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/addresses` | Lấy tất cả địa chỉ | ADMIN |
| GET | `/api/addresses/me` | Lấy địa chỉ của user hiện tại | Private |
| GET | `/api/addresses/:id` | Lấy địa chỉ theo ID | Owner/ADMIN |
| POST | `/api/addresses` | Tạo địa chỉ mới | Private |
| PUT | `/api/addresses/:id` | Cập nhật địa chỉ | Owner/ADMIN |
| PUT | `/api/addresses/:id/default` | Đặt địa chỉ làm mặc định | Owner |
| DELETE | `/api/addresses/:id` | Xóa địa chỉ | Owner/ADMIN |

### Payment Management

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/payments` | Lấy tất cả thanh toán | ADMIN |
| GET | `/api/payments/me` | Lấy thanh toán của user hiện tại | Private |
| GET | `/api/payments/:id` | Lấy thanh toán theo ID | Owner/ADMIN |
| POST | `/api/payments` | Tạo thanh toán cho đơn hàng | Private |
| PUT | `/api/payments/:id/status` | Cập nhật trạng thái thanh toán | ADMIN |

### Health Check

| Method | Endpoint | Mô tả | Access |
|--------|----------|-------|--------|
| GET | `/api/health` | Kiểm tra trạng thái API | Public |

## 📝 Ví dụ sử dụng API

### 1. Đăng ký user mới

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john_doe",
    "email": "john@example.com",
    "password": "Password@123",
    "full_name": "John Doe",
    "phone": "+84987654321"
  }'
```

### 2. Đăng nhập

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin",
    "password": "Admin@123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@heritage-art.com",
      "role": {
        "id": 1,
        "name": "ADMIN"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Lấy thông tin profile (cần token)

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Tạo user mới (ADMIN only)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "username": "teacher_1",
    "email": "teacher@example.com",
    "password": "Teacher@123",
    "full_name": "Teacher One",
    "role_id": 4
  }'
```

### 5. Lấy danh sách users (ADMIN only)

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 6. Lấy danh sách sản phẩm (có lọc)

```bash
# Lấy tất cả sản phẩm
curl -X GET "http://localhost:3000/api/products?page=1&limit=10"

# Lọc theo category, topic, style
curl -X GET "http://localhost:3000/api/products?category_id=1&topic_id=2&style_id=3&search=tranh"
```

### 7. Thêm sản phẩm vào giỏ hàng

```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

### 8. Xem giỏ hàng

```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": 1,
      "user_id": 2,
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 2,
          "price": "500000.00",
          "product": {
            "id": 1,
            "name": "Tranh Đông Hồ",
            "description": "Tranh dân gian truyền thống",
            "stock_quantity": 10,
            "image": "image_url"
          }
        }
      ],
      "total_items": 1,
      "total_amount": "1000000.00"
    }
  }
}
```

### 9. Tạo đơn hàng từ giỏ hàng

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "address_id": 1
  }'
```

### 10. Thêm địa chỉ giao hàng

```bash
curl -X POST http://localhost:3000/api/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
    "phone": "+84987654321",
    "is_default": true
  }'
```

### 11. Xem đơn hàng của tôi

```bash
curl -X GET http://localhost:3000/api/orders/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 12. Hủy đơn hàng

```bash
curl -X PUT http://localhost:3000/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔐 Bảo mật

- Mật khẩu được mã hóa bằng Bcrypt (10 salt rounds)
- JWT token để xác thực
- Middleware kiểm tra quyền truy cập
- Input validation với express-validator
- Password phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số

## 🗃️ Database Schema

### Authentication & User Management

#### Table: roles
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `name` (STRING, UNIQUE)
- `description` (TEXT)

#### Table: users
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `username` (STRING, UNIQUE)
- `email` (STRING, UNIQUE)
- `password` (STRING, HASHED)
- `full_name` (STRING)
- `phone` (STRING)
- `avatar` (TEXT)
- `is_active` (BOOLEAN, DEFAULT: true)
- `role_id` (FK -> roles.id)
- `last_login` (DATE)
- `created_at` (DATE)

### E-commerce Tables

#### Table: categories
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `name` (STRING, UNIQUE)
- `description` (TEXT)

#### Table: topics
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `name` (STRING, UNIQUE)
- `description` (TEXT)

#### Table: styles
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `name` (STRING, UNIQUE)
- `description` (TEXT)

#### Table: products
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `name` (STRING)
- `description` (TEXT)
- `price` (DECIMAL)
- `stock_quantity` (INTEGER)
- `image` (TEXT)
- `status` (ENUM: 'Active', 'Inactive')
- `category_id` (FK -> categories.id)
- `topic_id` (FK -> topics.id)
- `style_id` (FK -> styles.id)

#### Table: carts
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `user_id` (FK -> users.id, UNIQUE)
- `created_at` (DATE)

#### Table: cart_items
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `cart_id` (FK -> carts.id)
- `product_id` (FK -> products.id)
- `quantity` (INTEGER)
- `price` (DECIMAL)

#### Table: addresses
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `user_id` (FK -> users.id)
- `address` (TEXT)
- `phone` (STRING)
- `is_default` (BOOLEAN)
- `status` (ENUM: 'Active', 'Inactive')

#### Table: orders
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `user_id` (FK -> users.id)
- `address_id` (FK -> addresses.id)
- `total_amount` (DECIMAL)
- `status` (ENUM: 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
- `created_at` (DATE)

#### Table: order_details
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `order_id` (FK -> orders.id)
- `product_id` (FK -> products.id)
- `quantity` (INTEGER)
- `price` (DECIMAL)

#### Table: payments
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `order_id` (FK -> orders.id)
- `amount` (DECIMAL)
- `payment_method` (ENUM: 'Cash', 'Credit Card', 'Bank Transfer', 'E-Wallet')
- `status` (ENUM: 'Pending', 'Completed', 'Failed', 'Refunded')
- `transaction_id` (STRING)
- `created_at` (DATE)


## 🧪 Testing với Postman

Import collection vào Postman với các endpoint sau:

### Authentication & User Management
1. Health Check: `GET /api/health`
2. Register: `POST /api/auth/register`
3. Login: `POST /api/auth/login`
4. Get Profile: `GET /api/auth/profile` (cần token)
5. List Users: `GET /api/users` (ADMIN)
6. Create User: `POST /api/users` (ADMIN)
7. Update User: `PUT /api/users/:id` (ADMIN)
8. Delete User: `DELETE /api/users/:id` (ADMIN)
9. List Roles: `GET /api/roles` (ADMIN)

### E-commerce Endpoints
10. List Products: `GET /api/products`
11. Get Product: `GET /api/products/:id`
12. Create Product: `POST /api/products` (ADMIN)
13. Update Product: `PUT /api/products/:id` (ADMIN)
14. Update Stock: `PUT /api/products/:id/stock` (ADMIN)
15. Delete Product: `DELETE /api/products/:id` (ADMIN)
16. List Categories: `GET /api/categories`
17. Create Category: `POST /api/categories` (ADMIN)
18. List Topics: `GET /api/topics`
19. List Styles: `GET /api/styles`
20. Get My Cart: `GET /api/cart` (Private)
21. Add to Cart: `POST /api/cart/items` (Private)
22. Update Cart Item: `PUT /api/cart/items/:product_id` (Private)
23. Remove from Cart: `DELETE /api/cart/items/:product_id` (Private)
24. Clear Cart: `DELETE /api/cart` (Private)
25. Create Order: `POST /api/orders` (Private)
26. Get My Orders: `GET /api/orders/me` (Private)
27. Get Order: `GET /api/orders/:id` (Private)
28. Update Order Status: `PUT /api/orders/:id/status` (ADMIN)
29. Cancel Order: `PUT /api/orders/:id/cancel` (Private)
30. Get My Addresses: `GET /api/addresses/me` (Private)
31. Create Address: `POST /api/addresses` (Private)
32. Set Default Address: `PUT /api/addresses/:id/default` (Private)
33. Get My Payments: `GET /api/payments/me` (Private)
34. Create Payment: `POST /api/payments` (Private)

## 📌 Lưu ý

- Đổi `JWT_SECRET` trong production
- Sử dụng HTTPS trong production
- Cấu hình CORS phù hợp với frontend
- Backup database định kỳ
- Monitor logs và errors

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón. Vui lòng tạo Pull Request hoặc Issue.

## 📄 License

ISC

---

**Được phát triển bởi Senior Backend Developer** 🚀
