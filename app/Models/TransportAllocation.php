<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportAllocation extends Model
{
    protected $fillable = [
        'user_id',
        'route_id',
        'stop_name',
        'allocation_date',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function route()
    {
        return $this->belongsTo(TransportRoute::class, 'route_id');
    }
}
