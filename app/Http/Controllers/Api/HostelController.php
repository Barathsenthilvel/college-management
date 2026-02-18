<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HostelController extends Controller
{
    // Hostels
    public function index()
    {
        return response()->json(\App\Models\Hostel::withCount('rooms')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'type' => 'required|in:boys,girls,staff',
            'capacity' => 'required|integer',
            'warden_name' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'status' => 'required|in:active,inactive,maintenance'
        ]);

        $hostel = \App\Models\Hostel::create($validated);
        return response()->json($hostel, 201);
    }

    // Rooms
    public function getRooms(\App\Models\Hostel $hostel)
    {
        return response()->json($hostel->rooms);
    }

    public function addRoom(Request $request, \App\Models\Hostel $hostel)
    {
        $validated = $request->validate([
            'room_number' => 'required|string',
            'capacity' => 'required|integer',
            'type' => 'required|in:ac,non-ac',
            'fees' => 'required|numeric',
            'status' => 'required|in:available,full,maintenance'
        ]);

        $room = $hostel->rooms()->create($validated);
        return response()->json($room, 201);
    }

    // Allocations
    public function allocateRoom(Request $request)
    {
        $validated = $request->validate([
            'hostel_id' => 'required|exists:hostels,id',
            'room_id' => 'required|exists:rooms,id',
            'user_id' => 'required|exists:users,id',
            'allocation_date' => 'required|date',
        ]);

        // Check if room is full
        $room = \App\Models\Room::find($request->room_id);
        $currentAllocations = \App\Models\HostelAllocation::where('room_id', $room->id)->where('status', 'active')->count();
        
        if ($currentAllocations >= $room->capacity) {
            return response()->json(['message' => 'Room is full'], 400);
        }

        $allocation = \App\Models\HostelAllocation::create($validated + ['status' => 'active']);
        
        // Update room status if full
        if ($currentAllocations + 1 >= $room->capacity) {
            $room->update(['status' => 'full']);
        }

        return response()->json($allocation, 201);
    }
}
