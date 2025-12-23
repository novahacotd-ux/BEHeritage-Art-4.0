# News API - Installation & Setup

## 📦 Install Required Dependencies

```bash
npm install cloudinary multer
```

## 🔧 Configuration

### 1. Environment Variables
Copy [`.env.example`](.env.example) to `.env` and configure Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=heritage-art/news
```

### 2. Run Migrations

```bash
npm run migrate
```

## 📡 API Endpoints

### Public Endpoints (No Authentication)

#### Get All News
```http
GET /api/news
Query Parameters:
  - status: Filter by status (Draft, Published, Archived, Deleted)
  - includeDeleted: Include deleted news (true/false)
```

#### Get News by ID
```http
GET /api/news/:id
```

### Protected Endpoints (Require Authentication)

#### Create News
```http
POST /api/news
Headers: Authorization: Bearer <token>
Body: {
  "content": "Your news content here...",
  "tag": "Technology",
  "status": "Draft"
}
```

#### Update News
```http
PUT /api/news/:id
Headers: Authorization: Bearer <token>
Body: {
  "content": "Updated content",
  "tag": "Updated tag",
  "status": "Published"
}
```

#### Delete News (Soft Delete)
```http
DELETE /api/news/:id
Headers: Authorization: Bearer <token>
```

#### Update News Status
```http
PATCH /api/news/:id/status
Headers: Authorization: Bearer <token>
Body: {
  "status": "Published"
}
Valid statuses: Draft, Published, Archived, Deleted
```

#### Upload Media (Image/Video)
```http
POST /api/news/:newsId/media
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: file (image or video file)

Supported formats:
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, MOV, AVI
- Max size: 50MB
```

#### Delete News Image
```http
DELETE /api/news/images/:imageId
Headers: Authorization: Bearer <token>
```

## 📝 Response Examples

### Success Response
```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 1,
    "content": "Your news content...",
    "status": "Draft",
    "tag": "Technology",
    "created_date": "2023-12-22T10:00:00.000Z",
    "images": []
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "News not found"
}
```

## 🗂️ Database Schema

### News Table
- **id**: Integer (Primary Key)
- **content**: TEXT(long) - For very long article content
- **status**: String - Draft, Published, Archived, Deleted
- **tag**: String - Category/tag for news
- **created_date**: DateTime

### NewsImages Table
- **id**: Integer (Primary Key)
- **news_id**: Integer (Foreign Key → news.id)
- **image_url**: String - Cloudinary URL
- **created_date**: DateTime

## 🎯 Features Implemented

✅ CRUD operations for News
✅ Soft delete (status change to "Deleted")
✅ Status management (Draft, Published, Archived, Deleted)
✅ Image/Video upload to Cloudinary
✅ Multiple images per news article
✅ TEXT(long) for very long content
✅ Authentication required for modifications
✅ Public access for viewing news
