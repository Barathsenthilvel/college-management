# College Management System - Setup Instructions

## Prerequisites
- PHP 8.2+
- Composer
- Node.js and npm
- MySQL

## Installation Steps

1. **Install PHP Dependencies**
   ```bash
   composer install
   ```

2. **Install Node Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` if not exists
   - Generate application key: `php artisan key:generate`
   - Configure database connection in `.env`

4. **Publish Spatie Permission Migrations**
   ```bash
   php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
   ```

5. **Publish DomPDF Config (if needed)**
   ```bash
   php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
   ```

6. **Run Migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed Database**
   ```bash
   php artisan db:seed
   ```

8. **Build Frontend Assets**
   ```bash
   npm run build
   ```

9. **Start Development Server**
   ```bash
   php artisan serve
   npm run dev
   ```

## Default Login Credentials

- **Admin**: admin@college.com / password
- **Staff**: staff1@college.com / password
- **Student**: student1@college.com / password

## Features Implemented

✅ Role-based access control (Admin, Staff, Student)
✅ Departments management
✅ Students management with search & filters
✅ Staff management
✅ Attendance tracking and reports
✅ Fees management
✅ Subjects and Marks management
✅ Notification system with email support
✅ Leave management with approval workflow
✅ Dashboard with Chart.js analytics
✅ PDF reports (Marksheet, Attendance, Fee Receipt)

## API Endpoints

All API endpoints are prefixed with `/api` and require authentication via Sanctum.

## Notes

- Make sure to configure mail settings in `.env` for email notifications
- The React app is integrated into the Laravel welcome page
- All routes are protected with authentication middleware
- PDF reports require dompdf to be properly configured

