<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::with('department', 'staff');

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        $subjects = $query->get();

        return response()->json($subjects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_name' => 'required|string|max:255',
            'subject_code' => 'required|string|unique:subjects,subject_code',
            'department_id' => 'required|exists:departments,id',
            'year' => 'required|integer|min:1|max:4',
            'staff_id' => 'nullable|exists:staff,id',
            'credits' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
        ]);

        $subject = Subject::create($validated);

        return response()->json($subject->load('department', 'staff'), 201);
    }

    public function show(Subject $subject)
    {
        return response()->json($subject->load('department', 'staff'));
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'subject_name' => 'sometimes|required|string|max:255',
            'subject_code' => 'sometimes|required|string|unique:subjects,subject_code,' . $subject->id,
            'department_id' => 'sometimes|required|exists:departments,id',
            'year' => 'sometimes|required|integer|min:1|max:4',
            'staff_id' => 'nullable|exists:staff,id',
            'credits' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        $subject->update($validated);

        return response()->json($subject->load('department'));
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }
}

