<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Fee;
use App\Models\Mark;
use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function marksheet(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'year' => 'required|integer',
        ]);

        $student = Student::with('department')->findOrFail($request->student_id);

        if (auth()->user()->hasRole('staff') && auth()->user()->department_id && auth()->user()->department_id !== $student->department_id) {
            abort(403, 'Unauthorized access to student of another department.');
        }
        $marks = Mark::with('subject')
            ->where('student_id', $request->student_id)
            ->where('year', $request->year)
            ->get();

        $results = $marks->groupBy('subject_id')->map(function ($subjectMarks) {
            $totalMarks = $subjectMarks->sum('marks_obtained');
            $totalMaxMarks = $subjectMarks->sum('total_marks');
            $percentage = $totalMaxMarks > 0 ? ($totalMarks / $totalMaxMarks) * 100 : 0;

            return [
                'subject' => $subjectMarks->first()->subject,
                'marks' => $subjectMarks,
                'total_obtained' => $totalMarks,
                'total_max' => $totalMaxMarks,
                'percentage' => round($percentage, 2),
            ];
        });

        $overallPercentage = $marks->sum('marks_obtained') / ($marks->sum('total_marks') ?: 1) * 100;

        $pdf = PDF::loadView('reports.marksheet', [
            'student' => $student,
            'results' => $results,
            'overall_percentage' => round($overallPercentage, 2),
            'year' => $request->year,
        ]);

        return $pdf->download("marksheet_{$student->name}_{$request->year}.pdf");
    }

    public function attendanceReport(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'from_date' => 'required|date',
            'to_date' => 'required|date',
        ]);

        $student = Student::with('department')->findOrFail($request->student_id);

        if (auth()->user()->hasRole('staff') && auth()->user()->department_id && auth()->user()->department_id !== $student->department_id) {
            abort(403, 'Unauthorized access to student of another department.');
        }

        $attendance = Attendance::where('student_id', $request->student_id)
            ->whereBetween('date', [$request->from_date, $request->to_date])
            ->get();

        $totalDays = $attendance->count();
        $presentDays = $attendance->where('status', 'present')->count();
        $absentDays = $attendance->where('status', 'absent')->count();
        $lateDays = $attendance->where('status', 'late')->count();
        $percentage = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 2) : 0;

        $pdf = PDF::loadView('reports.attendance', [
            'student' => $student,
            'attendance' => $attendance,
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'absent_days' => $absentDays,
            'late_days' => $lateDays,
            'percentage' => $percentage,
        ]);

        return $pdf->download("attendance_report_{$student->name}.pdf");
    }

    public function feeReceipt(Request $request)
    {
        $request->validate([
            'fee_id' => 'required|exists:fees,id',
        ]);

        $fee = Fee::with('student.department')->findOrFail($request->fee_id);

        if (auth()->user()->hasRole('staff') && auth()->user()->department_id && auth()->user()->department_id !== $fee->student->department_id) {
            abort(403, 'Unauthorized access to student of another department.');
        }

        $pdf = PDF::loadView('reports.fee_receipt', [
            'fee' => $fee,
        ]);

        return $pdf->download("fee_receipt_{$fee->student->name}_{$fee->id}.pdf");
    }
}

