<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Fee;
use App\Models\Student;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function statistics()
    {
        $user = auth()->user();
        $isStaff = $user->hasRole('staff') && $user->department_id;
        $isStudent = $user->hasRole('student');

        if ($isStudent) {
            $student = $user->student;
            if (!$student) {
                return response()->json(['error' => 'Student record not found'], 404);
            }

            // Attendance Percentage
            $attendanceStats = Attendance::where('student_id', $student->id)
                ->select(
                    DB::raw('count(*) as total_records'),
                    DB::raw('sum(case when status = "present" then 1 else 0 end) as present_count')
                )->first();

            $attendancePercentage = $attendanceStats->total_records > 0
                ? round(($attendanceStats->present_count / $attendanceStats->total_records) * 100, 2)
                : 0;

            // Fee Status
            $totalFees = Fee::where('student_id', $student->id)->sum('total_amount');
            $paidFeesTransactions = \App\Models\FeeTransaction::whereHas('fee', function($q) use ($student) {
                $q->where('student_id', $student->id);
            })->sum('amount');
            $pendingFees = max(0, $totalFees - $paidFeesTransactions);

            // Results Summary
            $marks = \App\Models\Mark::where('student_id', $student->id)->get();
            $marksObtained = $marks->sum('marks_obtained');
            $totalMaxMarks = $marks->sum('total_marks');
            $overallPercentage = $totalMaxMarks > 0 ? round(($marksObtained / $totalMaxMarks) * 100, 2) : 0;

            // Notifications
            $notificationsQuery = \App\Models\CollegeNotification::where(function ($q) use ($user, $student) {
                $q->where('type', 'all')
                  ->orWhere('user_id', $user->id)
                  ->orWhere(function ($subQ) use ($student) {
                      $subQ->where('type', 'department')
                           ->where('department_id', $student->department_id);
                  });
            });
            $recentNotifications = $notificationsQuery->orderBy('created_at', 'desc')->limit(5)->get();

            return response()->json([
                'is_student' => true,
                'attendance_percentage' => $attendancePercentage,
                'total_fees_demand' => $totalFees,
                'paid_fees' => $paidFeesTransactions,
                'pending_fees' => $pendingFees,
                'overall_percentage' => $overallPercentage,
                'recent_notifications' => $recentNotifications,
            ]);
        }

        $totalStudents = Student::when($isStaff, fn($q) => $q->where('department_id', $user->department_id))->count();
        $totalDepartments = Department::count();
        $totalStaff = Staff::when($isStaff, fn($q) => $q->where('department_id', $user->department_id))->count();
        if ($isStaff) {
            $totalFees = 0;
            $paidFees = 0;
        } else {
            $totalFees = Fee::sum('amount');
            $paidFees = Fee::where('status', 'paid')->sum('amount');
        }

        // Students per department
        $studentsPerDepartment = Student::select('departments.department_name', DB::raw('count(students.id) as count'))
            ->join('departments', 'students.department_id', '=', 'departments.id')
            ->when($isStaff, fn($q) => $q->where('departments.id', $user->department_id))
            ->groupBy('departments.id', 'departments.department_name')
            ->get();

        // Attendance percentage
        $attendanceQuery = Attendance::query();
        if ($isStaff) {
            $attendanceQuery->whereHas('student', fn($q) => $q->where('department_id', $user->department_id));
        }
        
        $attendanceStats = $attendanceQuery->select(
            DB::raw('count(*) as total_records'),
            DB::raw('sum(case when status = "present" then 1 else 0 end) as present_count')
        )->first();

        $attendancePercentage = $attendanceStats->total_records > 0
            ? round(($attendanceStats->present_count / $attendanceStats->total_records) * 100, 2)
            : 0;

        if ($isStaff) {
            $feesCollected = [];
        } else {
            $feesCollected = Fee::where('status', 'paid')
                ->select(DB::raw('DATE(paid_date) as date'), DB::raw('sum(amount) as total'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->limit(30)
                ->get();
        }

        return response()->json([
            'total_students' => $totalStudents,
            'total_departments' => $totalDepartments,
            'total_staff' => $totalStaff,
            'total_fees' => $totalFees,
            'paid_fees' => $paidFees,
            'students_per_department' => $studentsPerDepartment,
            'attendance_percentage' => $attendancePercentage,
            'fees_collected' => $feesCollected,
        ]);
    }
}

