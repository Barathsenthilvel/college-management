<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mark;
use Illuminate\Http\Request;

class MarkController extends Controller
{
    public function index(Request $request)
    {
        $query = Mark::with('student.department', 'subject');

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        $marks = $query->paginate(15);

        return response()->json($marks);
    }

    public function store(Request $request)
    {
        // ... (Keep existing store or redirect to bulk logic for consistency if single)
        // Let's implement bulk store for efficiency as UI usually sends array
        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.subject_id' => 'required|exists:subjects,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0',
            'marks.*.total_marks' => 'required|numeric|min:0',
            'marks.*.exam_type' => 'required|string|in:midterm,final,assignment',
            'marks.*.year' => 'required|integer',
        ]);

        $createdMarks = [];
        foreach ($validated['marks'] as $markData) {
            $mark = Mark::updateOrCreate(
                [
                    'student_id' => $markData['student_id'],
                    'subject_id' => $markData['subject_id'],
                    'exam_type' => $markData['exam_type'],
                    'year' => $markData['year'],
                ],
                [
                    'marks_obtained' => $markData['marks_obtained'],
                    'total_marks' => $markData['total_marks'],
                ]
            );
            $createdMarks[] = $mark;
        }

        return response()->json(['message' => 'Marks saved successfully', 'data' => $createdMarks], 201);
    }

    public function show(Mark $mark)
    {
        return response()->json($mark->load('student.department', 'subject'));
    }

    public function update(Request $request, Mark $mark)
    {
        $validated = $request->validate([
            'marks_obtained' => 'sometimes|required|numeric|min:0',
            'total_marks' => 'sometimes|required|numeric|min:0',
        ]);

        $mark->update($validated);

        return response()->json($mark->load('student', 'subject'));
    }

    public function destroy(Mark $mark)
    {
        $mark->delete();

        return response()->json(['message' => 'Mark deleted successfully']);
    }

    public function getResults(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'year' => 'required|integer',
        ]);

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

        return response()->json([
            'results' => $results->values(),
            'overall_percentage' => round($overallPercentage, 2),
        ]);
    }
}

