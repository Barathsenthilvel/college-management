<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('student.department');

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('date', [$request->from_date, $request->to_date]);
        } elseif ($request->has('from_date')) {
            $query->whereDate('date', '>=', $request->from_date);
        } elseif ($request->has('to_date')) {
            $query->whereDate('date', '<=', $request->to_date);
        }

        if ($request->has('department_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $attendance = $query->orderBy('date', 'desc')->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($attendance);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late',
            'late_hours' => 'nullable|numeric|min:0|max:24',
            'remarks' => 'nullable|string|max:255',
        ]);

        $data = ['status' => $validated['status']];
        if ($validated['status'] === 'late' && isset($validated['late_hours'])) {
            $data['late_hours'] = $validated['late_hours'];
        } else {
            $data['late_hours'] = null;
        }
        $data['remarks'] = $validated['remarks'] ?? null;

        $attendance = Attendance::updateOrCreate(
            [
                'student_id' => $validated['student_id'],
                'date' => $validated['date'],
            ],
            $data
        );

        return response()->json($attendance->load('student'), 201);
    }

    public function markBulk(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late',
            'attendance.*.late_hours' => 'nullable|numeric|min:0|max:24',
            'attendance.*.remarks' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['attendance'] as $item) {
                $data = ['status' => $item['status']];
                if ($item['status'] === 'late' && isset($item['late_hours'])) {
                    $data['late_hours'] = $item['late_hours'];
                } else {
                    $data['late_hours'] = null;
                }
                $data['remarks'] = $item['remarks'] ?? null;

                Attendance::updateOrCreate(
                    [
                        'student_id' => $item['student_id'],
                        'date' => $validated['date'],
                    ],
                    $data
                );
            }
            DB::commit();

            return response()->json(['message' => 'Attendance marked successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to mark attendance'], 500);
        }
    }

    public function getReport(Request $request)
    {
        $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'department_id' => 'sometimes|exists:departments,id',
            'from_date' => 'required|date',
            'to_date' => 'required|date',
        ]);

        $query = Attendance::with('student.department')
            ->whereBetween('date', [$request->from_date, $request->to_date]);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('department_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        $attendance = $query->get();

        $report = [
            'total_days' => $attendance->groupBy('student_id')->map(function ($records) {
                return $records->count();
            }),
            'present_days' => $attendance->where('status', 'present')->groupBy('student_id')->map(function ($records) {
                return $records->count();
            }),
            'absent_days' => $attendance->where('status', 'absent')->groupBy('student_id')->map(function ($records) {
                return $records->count();
            }),
            'attendance_percentage' => $attendance->groupBy('student_id')->map(function ($records, $studentId) {
                $total = $records->count();
                $present = $records->where('status', 'present')->count();
                return $total > 0 ? round(($present / $total) * 100, 2) : 0;
            }),
        ];

        return response()->json($report);
    }

    public function getDepartmentReport(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date',
        ]);

        $departments = \App\Models\Department::withCount('students')->get();
        
        $report = $departments->map(function ($department) use ($request) {
            // Get all student IDs for this department
            $studentIds = \App\Models\Student::where('department_id', $department->id)->pluck('id');
            
            $attendance = Attendance::whereIn('student_id', $studentIds)
                ->whereBetween('date', [$request->from_date, $request->to_date])
                ->get();

            $present = $attendance->where('status', 'present')->count();
            $absent = $attendance->where('status', 'absent')->count();
            $late = $attendance->where('status', 'late')->count();
            
            $totalRecords = $attendance->count();
            $effectivePresent = $present + $late;
            
            $percentage = $totalRecords > 0 ? round(($effectivePresent / $totalRecords) * 100, 2) : 0;

            return [
                'department_name' => $department->department_name,
                'total_students' => $department->students_count,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'attendance_percentage' => $percentage,
            ];
        });

        return response()->json($report);
    }
}

