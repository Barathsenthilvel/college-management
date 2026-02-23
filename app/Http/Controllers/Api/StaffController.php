<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = Staff::with('department');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('employee_id', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('designation')) {
            $query->where('designation', $request->designation);
        }

        $staff = $query->orderBy('name')->paginate(15);

        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:100|unique:staff,employee_id',
            'email' => 'required|email|unique:staff,email',
            'department_id' => 'required|exists:departments,id',
            'designation' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|max:20',
            'date_of_joining' => 'nullable|date',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'login_id' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        // Create User for login
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['login_id'],
            'password' => bcrypt($validated['password']),
            'department_id' => $validated['department_id'],
        ]);
        $user->assignRole('staff');

        // Handle optional profile photo upload
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('staff', 'public');
        }

        $staff = Staff::create(array_merge($validated, [
            'photo_path' => $photoPath,
            'role' => 'staff',
            'department_id' => $validated['department_id'],
        ]));

        return response()->json($staff->load('department'), 201);
    }

    public function show(Staff $staff)
    {
        return response()->json($staff->load('department'));
    }

    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'employee_id' => 'sometimes|required|string|max:100|unique:staff,employee_id,' . $staff->id,
            'email' => 'sometimes|required|email|unique:staff,email,' . $staff->id,
            'department_id' => 'nullable|exists:departments,id',
            'designation' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|max:20',
            'date_of_joining' => 'nullable|date',
            'address' => 'nullable|string',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        // Handle optional profile photo upload
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('staff', 'public');
            $validated['photo_path'] = $photoPath;
        }

        $staff->update($validated);

        return response()->json($staff->load('department'));
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();

        return response()->json(['message' => 'Staff deleted successfully']);
    }

    /**
     * Assign or update roles & permissions for a staff member.
     */
    public function assignRoles(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'role' => 'required|string',
            'permissions' => 'array',
            'permissions.*' => 'string',
        ]);

        // Find or create a User for this staff email
        $user = User::firstOrCreate(
            ['email' => $staff->email],
            ['name' => $staff->name, 'password' => bcrypt('password')]
        );

        // Assign role using Spatie
        $user->syncRoles([$validated['role']]);

        if (!empty($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        // Keep staff.role in sync for display
        $staff->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'Roles and permissions updated successfully.',
            'staff' => $staff->fresh()->load('department'),
        ]);
    }
}

