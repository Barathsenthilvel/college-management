<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hostel extends Model
{
    protected $fillable = [
        'name',
        'address',
        'type',
        'capacity',
        'warden_name',
        'contact_number',
        'status',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
