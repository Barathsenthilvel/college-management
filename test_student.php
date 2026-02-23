<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Student;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

$role = Role::firstOrCreate(['name' => 'student']);
$dept = Department::first();

if (!$dept) {
    echo "No department found. Please create one first.\n";
    exit;
}

$user = User::updateOrCreate(
    ['email' => 'student1@college.com'],
    [
        'name' => 'Test Student',
        'password' => Hash::make('password'),
    ]
);

$user->assignRole('student');

$student = Student::updateOrCreate(
    ['email' => 'student1@college.com'],
    [
        'user_id' => $user->id,
        'name' => 'Test Student',
        'email' => 'student1@college.com',
        'phone' => '9876543210',
        'department_id' => $dept->id,
        'year' => 1,
        'semester' => 1,
        'dob' => '2000-01-01',
        'gender' => 'Male',
        'address' => 'Student Test Address'
    ]
);

echo "Test student created successfully.\n";
echo "Email: student1@college.com\n";
echo "Password: password\n";
echo "Department: {$dept->department_name}\n";
