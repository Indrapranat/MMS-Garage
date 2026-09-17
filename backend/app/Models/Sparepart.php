<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Sparepart extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category_id',
        'unit',
        'current_stock',
        'holding_cost',
        'safety_stock',
        'is_active',
    ];

    protected $casts = [
        'current_stock' => 'integer',
        'holding_cost' => 'decimal:2',
        'safety_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'stock_status',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function suppliers(): BelongsToMany
    {
        return $this->belongsToMany(Supplier::class, 'sparepart_suppliers')
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

    public function primarySupplier(): HasOne
    {
        return $this->hasOne(SparepartSupplier::class)
            ->where('is_primary', true)
            ->where('is_active', true);
    }

    public function stockIns(): HasMany
    {
        return $this->hasMany(StockIn::class);
    }

    public function stockOuts(): HasMany
    {
        return $this->hasMany(StockOut::class);
    }

    /**
     * Hitung threshold ROP sementara:
     * ROP default = safety_stock (atau lead_time * 1 jika ada data primary supplier)
     */
    public function getRopThresholdAttribute(): int
    {
        if ($this->safety_stock > 0) {
            return $this->safety_stock;
        }

        $primary = $this->primarySupplier;
        if ($primary && $primary->lead_time > 0) {
            return (int) $primary->lead_time;
        }

        return 5; // Default safety threshold sederhana
    }

    /**
     * Status persediaan sesuai PRD
     */
    public function getStockStatusAttribute(): string
    {
        if ($this->current_stock <= 0) {
            return 'STOK HABIS';
        }

        if ($this->current_stock <= $this->rop_threshold) {
            return 'PERLU PESAN';
        }

        return 'NORMAL';
    }
}
