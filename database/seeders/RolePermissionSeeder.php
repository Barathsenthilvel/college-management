<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $guardName = 'web';

        // Create permissions first
        $permissionNames = [
            'manage departments',
            'manage students',
            'manage staff',
            'manage attendance',
            'manage fees',
            'manage subjects',
            'manage marks',
            'manage notifications',
            'manage leaves',
            'view reports',
        ];

        $permissions = [];
        foreach ($permissionNames as $permissionName) {
            $permissions[$permissionName] = Permission::firstOrCreate(
                ['name' => $permissionName, 'guard_name' => $guardName]
            );
        }

        // Create roles
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => $guardName]);
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => $guardName]);
        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => $guardName]);

        // Assign all permissions to admin
        $admin->syncPermissions($permissions);

        // Assign specific permissions to staff
        $staff->syncPermissions([
            $permissions['manage attendance'],
            $permissions['manage marks'],
            $permissions['view reports'],
        ]);

        // Students have limited permissions
        $student->syncPermissions([
            $permissions['view reports'],
        ]);
    }
}

