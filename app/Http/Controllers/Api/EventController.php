<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = \App\Models\Event::query();

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('start_date', [$request->start_date, $request->end_date]);
        }
        
        $user = $request->user();
        if ($user) {
             if ($user->role == 'student') {
                 $query->whereIn('audience', ['all', 'students']);
             } elseif ($user->role == 'staff') {
                 $query->whereIn('audience', ['all', 'staff']);
             }
        }
        
        return response()->json($query->orderBy('start_date', 'asc')->get());
    }

    public function store(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'title' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'time' => 'nullable',
            'type' => 'required|in:academic,holiday,sports,cultural,other',
            'audience' => 'required|in:all,students,staff'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $event = \App\Models\Event::create($request->all());
        return response()->json($event, 201);
    }

    public function destroy(\App\Models\Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
