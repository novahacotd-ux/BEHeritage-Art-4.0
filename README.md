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

- ✅ Đăng ký và đăng nhập người dùng
- ✅ Xác thực JWT
- ✅ Phân quyền theo vai trò (RBAC)
- ✅ Quản lý người dùng (CRUD)
- ✅ Quản lý vai trò
- ✅ Mã hóa mật khẩu với Bcrypt
- ✅ Validation đầu vào
- ✅ Error handling
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
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── roleController.js
│   ├── middleware/          # Middleware functions
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Role.js
│   │   └── index.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roleRoutes.js
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
    "username": "john_doe",
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
    "login": "admin",
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

## 🔐 Bảo mật

- Mật khẩu được mã hóa bằng Bcrypt (10 salt rounds)
- JWT token để xác thực
- Middleware kiểm tra quyền truy cập
- Input validation với express-validator
- Password phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số

## 🗃️ Database Schema

### Table: roles
- `id` (PK, INTEGER, AUTO_INCREMENT)
- `name` (STRING, UNIQUE)
- `description` (TEXT)
- `created_at` (DATE)
- `updated_at` (DATE)

### Table: users
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
- `updated_at` (DATE)

## 🧪 Testing với Postman

Import collection vào Postman với các endpoint sau:

1. Health Check: `GET /api/health`
2. Register: `POST /api/auth/register`
3. Login: `POST /api/auth/login`
4. Get Profile: `GET /api/auth/profile` (cần token)
5. List Users: `GET /api/users` (ADMIN)
6. Create User: `POST /api/users` (ADMIN)
7. Update User: `PUT /api/users/:id` (ADMIN)
8. Delete User: `DELETE /api/users/:id` (ADMIN)
9. List Roles: `GET /api/roles` (ADMIN)

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
