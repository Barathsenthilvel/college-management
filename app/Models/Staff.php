<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Staff extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'employee_id',
        'email',
        'department_id',
        'designation',
        'phone',
        'gender',
        'date_of_joining',
        'address',
        'photo_path',
        'status',
        'role',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}

