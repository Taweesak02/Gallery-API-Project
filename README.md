# Gallery API Project

REST API Project เกี่ยวกับการจัดเก็บภาพวาดลงฐานข้อมูล ที่มีระบบยืนยันตัวตนด้วย JWT และมีการทำเอกสาร API ด้วย Swagger<br>

---

## สิ่งที่ใช้ในการพัฒนา 🔧
- Node.js / Express
- swagger-jsdoc / swagger-ui-express
- multer
- jsonwebtoken
- cookie-parser

---

## วิธีการติดตั้งและรันโปรเจกต์ 📑

### สิ่งที่ต้องมี
- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) และ Docker Compose (สำหรับการรันด้วย Docker)

### วิธีที่ 1 — รันด้วย Docker (แนะนำ)
 
1. **Clone โปรเจกต์**
```bash
   git clone https://github.com/Taweesak02/Gallery-API-Project
   cd Gallery-API-Project
```

2. **สร้างไฟล์ `.env`** โดยอ้างอิงจาก `.env.example`
```bash
   cp .env.example .env
```

จากนั้นแก้ไขค่าตามต้องการ:

```env
    APP_PORT=3000
    POSTGRES_PORT=5432

    DB_USER=your_user
    DB_HOST=db
    DB_NAME=gallery_db
    DB_PASSWORD=your_password

    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE_ACCESS_TOKEN=15m
    JWT_EXPIRE_REFRESH_TOKEN=7d
```

3. **Build และรัน containers**
```bash
   docker compose up --build
```

4. API จะพร้อมใช้งานที่ `http://localhost:3000`

---
 
### วิธีที่ 2 — รันแบบ Local (npm)
 
1. **Clone โปรเจกต์และติดตั้ง dependencies**
```bash
    git clone https://github.com/Taweesak02/Gallery-API-Project
    cd Gallery-API-Project
    npm install
```

2. **สร้างไฟล์ `.env`** โดยอ้างอิงจาก `.env.example`
```bash
   cp .env.example .env
``
 
3. **รันโปรเจกต์**
```bash
   # Development mode (hot reload)
   npm run dev
 
   # Production mode
   npm start
```
 
5. API จะพร้อมใช้งานที่ `http://localhost:3000`

---

## เอกสาร API 💡

เมื่อรันโปรเจกต์แล้ว สามารถเข้าถึง Swagger UI ได้ที่:
 
```
http://localhost:3000/docs
```
 
---

## Endpoints ทั้งหมด 🔗

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/v1/auth/register` | สมัครสมาชิกใหม่ | ❌ |
| `POST` | `/v1/auth/login` | เข้าสู่ระบบ (รับ JWT cookie) | ❌ |
| `POST` | `/v1/auth/refresh` | รีเฟรชรับ refresh token และ access token ใหม่ | ✅ |
| `POST` | `/v1/auth/logout` | ออกจากระบบ | ✅ |
| `GET` | `/v1/auth/getme` | เอาข้อมูลของตนเอง | ✅ |
| `PATCH` | `/v1/auth/update` | แก้ไขข้อมูลของตนเอง | ✅ |
| `PATCH` | `/v1/auth/update/:userId` | แก้ไขข้อมูลข้อมูลผู้ใช้งานสำหรับ admin | ✅ |
| `DELETE` | `/v1/auth/delete` | ลบบัญชีตนเอง | ✅ |
| `DELETE` | `/v1/auth/delete/:userId` | ลบบัญชีผู้ใช้งานคนอื่นสำหรับ admin | ✅ |

### Artist

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/v1/artist` | ดึงข้อมูลศิลปินจากข้อมูล | ❌ |
| `GET` | `/v1/artist/:artistId` | ดึงข้อมูลศิลปินตาม ID | ❌ |
| `POST` | `/v1/artist/register` | สมัครเป็นศิลปินใหม่ | ✅ |
| `DELETE` | `/v1/artist/delete` | ลบศิลปินตนเอง | ✅ |
| `DELETE` | `/v1/artist/delete/:artistId` | ลบศิลปินตาม ID | ✅ |
| `PATCH` | `/v1/artist/update` | แก้ไขข้อมูลศิลปินตนเอง | ✅ |
| `PATCH` | `/v1/artist/update/:artistId` | แก้ไขข้อมูลศิลปินตาม ID | ✅ |

### Gallery

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/v1/gallery` | ดึงรายการภาพวาดทั้งหมด | ❌ |
| `GET` | `/v1/gallery/:artworkId` | ดึงข้อมูลภาพวาดตาม ID | ❌ |
| `POST` | `/v1/gallery/add` | เพิ่มภาพวาดใหม่ (พร้อม upload รูป) | ✅ |
| `PATCH` | `/v1/gallery/edit/:artworkId` | แก้ไขข้อมูลภาพวาด | ✅ |
| `DELETE` | `/v1/gallery/remove/:artworkId` | ลบภาพวาด | ✅ |

> **หมายเหตุ:** Endpoints ที่ต้องการ Auth จะตรวจสอบ JWT ผ่าน `tokenCheck` middleware และมีระบบ blacklist token เมื่อ logout

---

## โครงสร้างโปรเจกต์ 📁

```
Gallery-API-Project/
── public/
│   └── image/                  # Static uploaded images
├── src/
│   ├── configs/
│   │   ├── dbConfig.js         # PostgreSQL connection pool
│   │   ├── multerConfig.js     # File upload configuration
│   │   └── swaggerConfig.js    # Swagger setup
│   ├── controllers/
│   │   ├── artistController.js
│   │   ├── authController.js
│   │   └── galleryController.js
│   ├── db/
│   │   └── initdb.js           # Database initialisation / migrations
│   ├── docs/                   # Swagger doc fragments
│   │   ├── paths/
│   │   └── schemas/
│   │       ├── requests/
│   │       └── responses/
│   ├── middlewares/
│   │   ├── asyncHandler.js       # Async Function handler
│   │   ├── errorHandler.js      # Centralised error handler
│   │   └── tokenCheck.js       # JWT verification middleware
│   ├── models/
│   │   ├── artistResponse.js     # Base Artist Response
│   │   ├── galleryResponse.js     # Base Gallery Response 
│   │   └── userResponse.js     # Base User Response
│   ├── repository/
│   │   ├── artistRepo.js
│   │   ├── blackListTokenRepo.js
│   │   ├── galleryRepo.js
│   │   └── userRepo.js
│   ├── routes/
│   │   ├── artistRoute.js
│   │   ├── authRoute.js
│   │   └── galleryRoute.js
│   ├── services/
│   │   ├── artistService.js
│   │   ├── authService.js
│   │   ├── galleryService.js
│   │   ├── imageService.js
│   │   └── jwtService.js
│   └── utils/
│       ├── appError.js    # Error Throw Function
│       ├── responseHandler.js   # Response Function handler
│       └── setCookie.js      # Set Cookie Function
├── .env.example
├── .gitignore
├── .dockerignore
├── Docker-compose.yml
├── Dockerfile
├── index.js
├── package.json
└── README.md
```