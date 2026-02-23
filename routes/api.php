<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\MarkController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Register route - only for staff/admin to create other accounts
    Route::post('/register', [AuthController::class, 'register']);

    // Dashboard
    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);

    // Departments (Admin only)
    Route::middleware('staff.access')->group(function() {
        Route::apiResource('departments', DepartmentController::class);
    });

    // Students
    Route::post('/students/{student}/restore', [StudentController::class, 'restore']);
    Route::apiResource('students', StudentController::class);

    // Staff (Admin only)
    Route::middleware('staff.access')->group(function() {
        Route::apiResource('staff', StaffController::class);
        Route::post('/staff/{staff}/assign-roles', [StaffController::class, 'assignRoles']);
    });

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::post('/attendance/bulk', [AttendanceController::class, 'markBulk']);
    Route::get('/attendance/report', [AttendanceController::class, 'getReport']);
    Route::get('/attendance/department-report', [AttendanceController::class, 'getDepartmentReport']);

    // Fees (Admin only)
    Route::middleware('staff.access')->group(function() {
        Route::apiResource('fees', FeeController::class);
        Route::post('/fees/{fee}/pay', [FeeController::class, 'addPayment']);
        Route::get('/fees/statistics', [FeeController::class, 'getStatistics']);
    });

    // Subjects
    Route::apiResource('subjects', SubjectController::class);

    // Marks
    Route::apiResource('marks', MarkController::class);
    Route::get('/marks/results', [MarkController::class, 'getResults']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

    // Leaves
    Route::apiResource('leaves', LeaveController::class);
    Route::post('/leaves/{leave}/approve', [LeaveController::class, 'approve']);
    Route::post('/leaves/{leave}/reject', [LeaveController::class, 'reject']);

    // Reports
    Route::get('/reports/marksheet', [ReportController::class, 'marksheet']);
    Route::get('/reports/attendance', [ReportController::class, 'attendanceReport']);
    Route::get('/reports/fee-receipt', [ReportController::class, 'feeReceipt']);

    // Library
    Route::get('/library/books', [\App\Http\Controllers\Api\LibraryController::class, 'books']);
    Route::post('/library/books', [\App\Http\Controllers\Api\LibraryController::class, 'storeBook']);
    Route::put('/library/books/{book}', [\App\Http\Controllers\Api\LibraryController::class, 'updateBook']);
    Route::delete('/library/books/{book}', [\App\Http\Controllers\Api\LibraryController::class, 'destroyBook']);
    Route::get('/library/categories', [\App\Http\Controllers\Api\LibraryController::class, 'categories']);
    Route::post('/library/categories', [\App\Http\Controllers\Api\LibraryController::class, 'storeCategory']);
    Route::post('/library/issue', [\App\Http\Controllers\Api\LibraryController::class, 'issueBook']);
    Route::post('/library/return/{issue}', [\App\Http\Controllers\Api\LibraryController::class, 'returnBook']);
    Route::get('/library/my-books', [\App\Http\Controllers\Api\LibraryController::class, 'myBooks']);

    // Timetable
    Route::get('/timetable', [\App\Http\Controllers\Api\TimetableController::class, 'index']);
    Route::post('/timetable', [\App\Http\Controllers\Api\TimetableController::class, 'store']);
    Route::delete('/timetable/{timetable}', [\App\Http\Controllers\Api\TimetableController::class, 'destroy']);

    // Events
    Route::get('/events', [\App\Http\Controllers\Api\EventController::class, 'index']);
    Route::post('/events', [\App\Http\Controllers\Api\EventController::class, 'store']);
    Route::delete('/events/{event}', [\App\Http\Controllers\Api\EventController::class, 'destroy']);

    // Hostel Management
    Route::get('/hostels', [\App\Http\Controllers\Api\HostelController::class, 'index']);
    Route::post('/hostels', [\App\Http\Controllers\Api\HostelController::class, 'store']);
    Route::get('/hostels/{hostel}/rooms', [\App\Http\Controllers\Api\HostelController::class, 'getRooms']);
    Route::post('/hostels/{hostel}/rooms', [\App\Http\Controllers\Api\HostelController::class, 'addRoom']);
    Route::post('/hostels/allocate', [\App\Http\Controllers\Api\HostelController::class, 'allocateRoom']);

    // Transport Management
    Route::get('/transport/routes', [\App\Http\Controllers\Api\TransportController::class, 'index']);
    Route::post('/transport/routes', [\App\Http\Controllers\Api\TransportController::class, 'store']);
    Route::get('/transport/vehicles', [\App\Http\Controllers\Api\TransportController::class, 'getVehicles']);
    Route::post('/transport/vehicles', [\App\Http\Controllers\Api\TransportController::class, 'storeVehicle']);
    Route::post('/transport/allocate', [\App\Http\Controllers\Api\TransportController::class, 'allocate']);

    // Audit Logs (Admin only)
    Route::middleware('staff.access')->group(function() {
        Route::get('/audit-logs', [\App\Http\Controllers\Api\AuditController::class, 'index']);
    });

    // Academic Year (Admin only)
    Route::middleware('staff.access')->group(function() {
        Route::apiResource('academic-years', \App\Http\Controllers\Api\AcademicYearController::class);
    });

    // Backup (Admin only)
    Route::middleware('staff.access')->group(function() {
        Route::get('/backups', [\App\Http\Controllers\Api\BackupController::class, 'index']);
        Route::post('/backups', [\App\Http\Controllers\Api\BackupController::class, 'create']);
        Route::get('/backups/{filename}', [\App\Http\Controllers\Api\BackupController::class, 'download']);
        Route::delete('/backups/{filename}', [\App\Http\Controllers\Api\BackupController::class, 'delete']);
    });
});

