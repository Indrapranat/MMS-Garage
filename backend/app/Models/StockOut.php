<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOut extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_number',
        'sparepart_id',
        'user_id',
        'quantity',
        'usage_type',
        'reference_number',
        'transaction_date',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'transaction_date' => 'date',
    ];

    public function sparepart(): BelongsTo
    {
        return $this->belongsTo(Sparepart::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
