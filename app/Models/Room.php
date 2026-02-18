<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'hostel_id',
        'room_number',
        'capacity',
        'type',
        'fees',
        'status',
    ];

    public function hostel()
    {
        return $this->belongsTo(Hostel::class);
    }

    public function allocations()
    {
        return $this->hasMany(HostelAllocation::class);
    }
}
