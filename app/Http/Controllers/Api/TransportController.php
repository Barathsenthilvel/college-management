<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TransportController extends Controller
{
    // Routes
    public function index()
    {
        return response()->json(\App\Models\TransportRoute::with(['vehicles', 'allocations'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'route_name' => 'required|string',
            'start_location' => 'required|string',
            'end_location' => 'required|string',
            'stops' => 'nullable|array',
            'fare' => 'required|numeric',
            'status' => 'required|in:active,inactive'
        ]);

        $route = \App\Models\TransportRoute::create($validated);
        return response()->json($route, 201);
    }

    // Vehicles
    public function storeVehicle(Request $request)
    {
        $validated = $request->validate([
            'vehicle_number' => 'required|string|unique:transport_vehicles',
            'driver_name' => 'required|string',
            'driver_contact' => 'required|string',
            'capacity' => 'required|integer',
            'route_id' => 'nullable|exists:transport_routes,id',
            'status' => 'required|in:active,maintenance,inactive'
        ]);

        $vehicle = \App\Models\TransportVehicle::create($validated);
        return response()->json($vehicle, 201);
    }

    public function getVehicles()
    {
        return response()->json(\App\Models\TransportVehicle::with('route')->get());
    }

    // Allocate
    public function allocate(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'route_id' => 'required|exists:transport_routes,id',
            'stop_name' => 'required|string',
            'allocation_date' => 'required|date',
        ]);

        $allocation = \App\Models\TransportAllocation::create($validated + ['status' => 'active']);
        return response()->json($allocation, 201);
    }
}
