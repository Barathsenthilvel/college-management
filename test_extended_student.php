<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Student;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;

$dept = Department::first();

if (!$dept) {
    echo "No department found. Please create one first.\n";
    exit;
}

$user = User::updateOrCreate(
    ['email' => 'extendedstudent@college.com'],
    [
        'name' => 'Extended Fields Student',
        'password' => Hash::make('mypassword123'),
        'username' => 'extendedstudent', // Ensure username if required
    ]
);

$user->assignRole('student');

$student = Student::updateOrCreate(
    ['email' => 'extendedstudent@college.com'],
    [
        'user_id' => $user->id,
        'name' => 'Extended Fields Student',
        'phone' => '1231231231',
        'department_id' => $dept->id,
        'year' => 1,
        'batch' => '2026-2030',
        'status' => 'active',
    ]
);

echo "Extended student created successfully.\n";
echo "Email: {$student->email}\n";
echo "Batch: {$student->batch}\n";
echo "Status: {$student->status}\n";
