<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportRoute extends Model
{
    protected $fillable = [
        'route_name',
        'start_location',
        'end_location',
        'stops',
        'fare',
        'status',
    ];

    protected $casts = [
        'stops' => 'array',
    ];

    public function vehicles()
    {
        return $this->hasMany(TransportVehicle::class, 'route_id');
    }

    public function allocations()
    {
        return $this->hasMany(TransportAllocation::class, 'route_id');
    }
}
