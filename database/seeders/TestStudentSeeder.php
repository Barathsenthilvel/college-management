<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TestStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure student role exists
        Role::firstOrCreate(['name' => 'student']);
        
        // Get available departments to assign students to
        $departments = Department::all();
        
        if ($departments->isEmpty()) {
            $this->command->error('No departments found! Please create a department first before running this seeder.');
            return;
        }

        $studentsData = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'phone' => '1234567890',
                'year' => 1,
                'batch' => '2023-2027',
                'status' => 'active'
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '0987654321',
                'year' => 2,
                'batch' => '2022-2026',
                'status' => 'active'
            ],
            [
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@example.com',
                'phone' => '1122334455',
                'year' => 3,
                'batch' => '2021-2025',
                'status' => 'active'
            ],
            [
                'name' => 'Bob Williams',
                'email' => 'bob.williams@example.com',
                'phone' => '5544332211',
                'year' => 4,
                'batch' => '2020-2024',
                'status' => 'inactive'
            ]
        ];

        foreach ($studentsData as $index => $data) {
            // Distribute students among available departments
            $department = $departments[$index % $departments->count()];
            
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
            ]);
            
            // Assign role
            $user->assignRole('student');
            
            // Create student
            Student::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'department_id' => $department->id,
                'year' => $data['year'],
                'batch' => $data['batch'],
                'status' => $data['status'],
            ]);
        }

        $this->command->info('Test students generated successfully! Password for all is: password');
    }
}
