<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\AcademicYear::orderBy('start_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        if ($validated['is_current']) {
            \App\Models\AcademicYear::where('is_current', true)->update(['is_current' => false]);
        }

        $year = \App\Models\AcademicYear::create($validated);
        return response()->json($year, 201);
    }

    public function update(Request $request, $id)
    {
        $year = \App\Models\AcademicYear::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'is_current' => 'boolean',
        ]);

        if (isset($validated['is_current']) && $validated['is_current']) {
            \App\Models\AcademicYear::where('id', '!=', $id)->update(['is_current' => false]);
        }

        $year->update($validated);
        return response()->json($year);
    }

    public function destroy($id)
    {
        \App\Models\AcademicYear::findOrFail($id)->delete();
        return response()->json(['message' => 'Academic Year deleted']);
    }
}
