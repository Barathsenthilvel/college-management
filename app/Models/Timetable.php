<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'department_id',
        'subject_id',
        'staff_id',
        'semester',
        'day',
        'start_time',
        'end_time',
        'room_number',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
