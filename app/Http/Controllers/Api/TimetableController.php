<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Timetable::with(['subject', 'staff', 'department']);

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }
        if ($request->has('day')) {
            $query->where('day', $request->day);
        }
        
        return response()->json($query->orderBy('start_time')->get());
    }

    public function store(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'subject_id' => 'required|exists:subjects,id',
            'staff_id' => 'required|exists:staff,id',
            'semester' => 'required|string',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room_number' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check for conflicts
        $exists = \App\Models\Timetable::where('day', $request->day)
            ->where(function ($q) use ($request) {
                // Check if staff is busy
                $q->where('staff_id', $request->staff_id)
                  ->where(function ($timeQ) use ($request) {
                      $timeQ->whereBetween('start_time', [$request->start_time, $request->end_time])
                            ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                            ->orWhere(function ($overlap) use ($request) {
                                $overlap->where('start_time', '<=', $request->start_time)
                                        ->where('end_time', '>=', $request->end_time);
                            });
                  });
            })->exists();

        if ($exists) {
            return response()->json(['message' => 'Staff is already booked for this time'], 400);
        }

        $timetable = \App\Models\Timetable::create($request->all());
        return response()->json($timetable, 201);
    }

    public function destroy(\App\Models\Timetable $timetable)
    {
        $timetable->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
