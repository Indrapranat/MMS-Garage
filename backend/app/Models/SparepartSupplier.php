<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SparepartSupplier extends Model
{
    use HasFactory;

    protected $table = 'sparepart_suppliers';

    protected $fillable = [
        'sparepart_id',
        'supplier_id',
        'supplier_part_number',
        'purchase_price',
        'ordering_cost',
        'lead_time',
        'is_primary',
        'is_active',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'ordering_cost' => 'decimal:2',
        'lead_time' => 'integer',
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function sparepart(): BelongsTo
    {
        return $this->belongsTo(Sparepart::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
