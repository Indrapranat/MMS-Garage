<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'phone',
        'contact_person',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function spareparts(): BelongsToMany
    {
        return $this->belongsToMany(Sparepart::class, 'sparepart_suppliers')
            ->withPivot([
                'id',
                'supplier_part_number',
                'purchase_price',
                'ordering_cost',
                'lead_time',
                'is_primary',
                'is_active',
            ])
            ->withTimestamps();
    }

    public function sparepartSuppliers(): HasMany
    {
        return $this->hasMany(SparepartSupplier::class);
    }

    public function stockIns(): HasMany
    {
        return $this->hasMany(StockIn::class);
    }
}
