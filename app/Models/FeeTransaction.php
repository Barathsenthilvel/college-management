<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_id',
        'amount',
        'payment_mode',
        'transaction_ref',
        'payment_date',
        'remarks',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    public function fee(): BelongsTo
    {
        return $this->belongsTo(Fee::class);
    }
}
