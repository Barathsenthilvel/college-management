<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mark extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'subject_id',
        'marks_obtained',
        'total_marks',
        'exam_type',
        'year',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'total_marks' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function getPercentageAttribute(): float
    {
        if ($this->total_marks == 0) {
            return 0;
        }
        return ($this->marks_obtained / $this->total_marks) * 100;
    }
}

