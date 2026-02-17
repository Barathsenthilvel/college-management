<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject_name',
        'subject_code',
        'department_id',
        'year',
        'staff_id',
        'credits',
        'status',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class); // Assuming Staff model exists as Staff
    }

    public function marks(): HasMany
    {
        return $this->hasMany(Mark::class);
    }
}

