# TaskManager

Appointment Management System Sebuah aplikasi manajemen janji temu berbasis web yang dibangun dengan:

Frontend: Next.js, React.js, Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB

Autentikasi: JWT


Instalasi

Clone Repository
Setup Backend Masuk ke direktori backend dan install dependencies: cd backend npm install Buat file .env di root folder backend dengan konten:
MONGODB_URI=mongodb://localhost:27017/taskmanager JWT_SECRET=rahasia_anda PORT=8000

Jalankan server backend: npm run dev

Setup Frontend Masuk ke direktori frontend dan install dependencies: cd ../frontend npm install Buat file .env.local di root folder frontend dengan konten:
env VITE_API_BASE_URL=http://localhost:8000/api/v1

Jalankan aplikasi frontend: npm run dev

Penggunaan Buka browser dan akses http://localhost:3000

Login dengan username yang sudah terdaftar

Endpoint API POST /api/v1/auth/register - Registrasi user baru

POST /api/v1/auth/login - Login user

GET /api/v1/auth/profile - Dapatkan profil user

GET /api/v1/tasks - Dapatkan semua tasks

POST /api/v1/tasks - Buat task

DELETE /api/v1/tasks/:id - hapus task

PATCH /api/v1/tasks/:id - switch toogle completed/incompleted task

Dependencies yang Wajib Diinstal terlebih dahulu Frontend:

Moment.js (timezone)

SweetAlert2

Backend:

JWT (autentikasi)

Moment-timezone

Project Implementation

Authentication • Login: Implement simple login using only the username. • Authentication Method: Use JWT or session-based authentication. • Session Expiry: Sessions should expire after 1 hour.

User Management • User Model: Implement a User model with the following attributes: • id (UUID or auto-increment) • name (String) • username (String, unique) • preferred_timezone (e.g., Asia/Jakarta, Pacific/Auckland) • Database: Use a relational database (PostgreSQL/MySQL) or NoSQL (MongoDB). • API Endpoint: Provide an API endpoint to fetch user data.

Task Management (Create, Patch, Delete Task)
