<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with('department');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        $students = $query->paginate(15);

        return response()->json($students);
    }

    public function store(Request $request)
    {
        // Only staff and admin can create students
        if (!auth()->user()->hasAnyRole(['admin', 'staff'])) {
            return response()->json([
                'message' => 'Unauthorized. Only staff and admin can create students.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'year' => 'required|integer|min:1|max:4',
            'password' => 'nullable|string|min:8', // Optional password, will generate if not provided
        ]);

        // Generate a default password if not provided
        $password = $validated['password'] ?? 'student123'; // Default password

        // Create User account for the student
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
        ]);

        // Assign student role
        $user->assignRole('student');

        // Create Student record
        $student = Student::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'department_id' => $validated['department_id'],
            'year' => $validated['year'],
            'user_id' => $user->id,
        ]);

        return response()->json([
            'student' => $student->load('department', 'user'),
            'user' => $user,
            'password' => $password, // Return password so admin/staff can share it
            'message' => 'Student account created successfully. Password: ' . $password,
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json($student->load('department'));
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:students,email,' . $student->id,
            'phone' => 'nullable|string|max:20',
            'department_id' => 'sometimes|required|exists:departments,id',
            'year' => 'sometimes|required|integer|min:1|max:4',
        ]);

        $student->update($validated);

        return response()->json($student->load('department'));
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
}

