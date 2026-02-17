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
        $totalStudents = Student::count();
        $totalDepartments = Department::count();
        $totalStaff = Staff::count();
        $totalFees = Fee::sum('amount');
        $paidFees = Fee::where('status', 'paid')->sum('amount');

        // Students per department
        $studentsPerDepartment = Student::select('departments.department_name', DB::raw('count(students.id) as count'))
            ->join('departments', 'students.department_id', '=', 'departments.id')
            ->groupBy('departments.id', 'departments.department_name')
            ->get();

        // Attendance percentage
        $attendanceStats = Attendance::select(
            DB::raw('count(*) as total_records'),
            DB::raw('sum(case when status = "present" then 1 else 0 end) as present_count')
        )->first();

        $attendancePercentage = $attendanceStats->total_records > 0
            ? round(($attendanceStats->present_count / $attendanceStats->total_records) * 100, 2)
            : 0;

        // Fees collected
        $feesCollected = Fee::where('status', 'paid')
            ->select(DB::raw('DATE(paid_date) as date'), DB::raw('sum(amount) as total'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();

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

