# Login System Documentation

## Overview
The College Management System uses Laravel Sanctum for API authentication with role-based access control (RBAC) via Spatie Laravel Permission.

## Fixed Issues

### 1. `createToken()` Method Error
**Problem:** `Call to undefined method App\Models\User::createToken()`

**Solution:** Added `HasApiTokens` trait from Laravel Sanctum to the User model.

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;
}
```

## Authentication Flow

### Login Process
1. **All Users (Admin, Staff, Student)** can login using their email and password
2. Login endpoint: `POST /api/login`
3. Response includes:
   - `token`: Sanctum authentication token
   - `user`: User object with role information
     ```json
     {
       "user": {
         "id": 1,
         "name": "John Doe",
         "email": "admin@example.com",
         "role": "admin",
         "roles": ["admin"]
       },
       "token": "1|..."
     }
     ```

### Role-Based Access

#### Admin
- Can login
- Can create staff and student accounts
- Full access to all modules
- Can manage permissions

#### Staff
- Can login
- Can create student accounts
- Limited access (attendance, marks, reports)

#### Student
- Can login (account created by admin/staff)
- Cannot register themselves
- Limited access (view own reports)

## Student Account Creation

### How Students Get Accounts
1. **Only Staff/Admin** can create student accounts
2. When creating a student via `POST /api/students`, the system:
   - Creates a User account automatically
   - Assigns "student" role
   - Links Student record to User account
   - Generates default password: `student123` (if not provided)
   - Returns the password in the response

### Student Creation Endpoint
```
POST /api/students
Headers: Authorization: Bearer {token}
Body: {
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "1234567890",
  "department_id": 1,
  "year": 1,
  "password": "optional_password" // If not provided, defaults to "student123"
}
```

**Response:**
```json
{
  "student": { ... },
  "user": { ... },
  "password": "student123",
  "message": "Student account created successfully. Password: student123"
}
```

## Register Endpoint

### Access Control
- **Protected Route**: Requires authentication
- **Authorization**: Only Admin and Staff can access
- **Purpose**: Create admin/staff accounts (not for students)

### Endpoint
```
POST /api/register
Headers: Authorization: Bearer {token}
Body: {
  "name": "User Name",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password",
  "role": "admin|staff|student"
}
```

## Database Changes

### Students Table
Added `user_id` column to link students to their User accounts:
```php
$table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
```

### Relationships
- `User` hasOne `Student`
- `Student` belongsTo `User`

## Default Login Credentials

After running seeders, you can login with:

1. **Admin:**
   - Email: `admin@example.com`
   - Password: (check your seeder or use `php artisan tinker` to reset)

2. **Staff:**
   - Email: `staff@example.com`
   - Password: (check your seeder or use `php artisan tinker` to reset)

3. **Student:**
   - Email: (created by admin/staff)
   - Password: `student123` (default) or as set by admin/staff

## Testing Login

### Using cURL
```bash
# Admin/Staff/Student Login
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password"
  }'
```

### Using React Frontend
1. Navigate to `http://127.0.0.1:8000/login`
2. Enter email and password
3. On successful login, you'll be redirected to dashboard
4. Your role determines what you can see/access

## Security Notes

1. **Students cannot self-register** - Only admin/staff can create student accounts
2. **Default passwords** - When creating students, default password is `student123`. Admin/staff should change this or set a custom password.
3. **Token-based auth** - All API requests require the Sanctum token in the Authorization header
4. **Role-based permissions** - Each route is protected by permission middleware

## Migration

Run the migration to add `user_id` to students table:
```bash
php artisan migrate
```

This migration has already been run and is included in the codebase.

