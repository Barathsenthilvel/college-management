<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Student;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CollegeManagementSeeder extends Seeder
{
    public function run(): void
    {
        // Create departments
        $csDept = Department::create([
            'department_name' => 'Computer Science',
            'status' => 'active',
        ]);

        $eeDept = Department::create([
            'department_name' => 'Electrical Engineering',
            'status' => 'active',
        ]);

        $meDept = Department::create([
            'department_name' => 'Mechanical Engineering',
            'status' => 'active',
        ]);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@college.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Create staff users
        $staff1 = User::create([
            'name' => 'Staff Member 1',
            'email' => 'staff1@college.com',
            'password' => Hash::make('password'),
        ]);
        $staff1->assignRole('staff');

        Staff::create([
            'name' => 'Staff Member 1',
            'email' => 'staff1@college.com',
            'department_id' => $csDept->id,
            'role' => 'Professor',
        ]);

        // Create student users
        $student1 = User::create([
            'name' => 'Student One',
            'email' => 'student1@college.com',
            'password' => Hash::make('password'),
        ]);
        $student1->assignRole('student');

        Student::create([
            'name' => 'Student One',
            'email' => 'student1@college.com',
            'phone' => '1234567890',
            'department_id' => $csDept->id,
            'year' => 2,
        ]);

        Student::create([
            'name' => 'Student Two',
            'email' => 'student2@college.com',
            'phone' => '1234567891',
            'department_id' => $eeDept->id,
            'year' => 1,
        ]);

        Student::create([
            'name' => 'Student Three',
            'email' => 'student3@college.com',
            'phone' => '1234567892',
            'department_id' => $meDept->id,
            'year' => 3,
        ]);
    }
}

