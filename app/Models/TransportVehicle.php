<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportVehicle extends Model
{
    protected $fillable = [
        'vehicle_number',
        'driver_name',
        'driver_contact',
        'capacity',
        'route_id',
        'status',
    ];

    public function route()
    {
        return $this->belongsTo(TransportRoute::class, 'route_id');
    }
}
