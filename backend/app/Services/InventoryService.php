<?php

namespace App\Services;

use App\Models\Sparepart;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function __construct(
        protected ?EoqRopService $eoqRopService = null
    ) {
        $this->eoqRopService = $eoqRopService ?? new EoqRopService(new EoqService(), new RopService());
    }
    /**
     * Generate format nomor transaksi unik
     */
    public function generateTransactionNumber(string $prefix = 'IN'): string
    {
        $date = date('Ymd');
        $random = strtoupper(substr(uniqid(), -4));
        $count = ($prefix === 'IN' ? StockIn::count() : StockOut::count()) + 1;
        $sequence = str_pad($count, 4, '0', STR_PAD_LEFT);

        return "{$prefix}-{$date}-{$sequence}-{$random}";
    }

    /**
     * Tambah stok barang fisik (Stock In) secara atomik
     *
     * @param array $data
     * @return StockIn
     */
    public function addStock(array $data): StockIn
    {
        return DB::transaction(function () use ($data) {
            $sparepart = Sparepart::where('id', $data['sparepart_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $quantity = (int) $data['quantity'];
            if ($quantity <= 0) {
                throw ValidationException::withMessages([
                    'quantity' => ['Kuantitas barang masuk harus lebih besar dari 0.'],
                ]);
            }

            $transactionNumber = $data['transaction_number'] ?? $this->generateTransactionNumber('IN');

            $stockIn = StockIn::create([
                'transaction_number' => $transactionNumber,
                'sparepart_id' => $sparepart->id,
                'supplier_id' => $data['supplier_id'] ?? null,
                'user_id' => $data['user_id'] ?? null,
                'quantity' => $quantity,
                'unit_price' => $data['unit_price'] ?? 0,
                'source_type' => $data['source_type'] ?? 'PURCHASE',
                'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
                'notes' => $data['notes'] ?? null,
            ]);

            // Tambah current_stock
            $sparepart->current_stock += $quantity;
            $sparepart->save();

            return $stockIn->load(['sparepart', 'supplier']);
        });
    }

    /**
     * Kurangi stok barang fisik (Stock Out) secara atomik
     *
     * @param array $data
     * @return StockOut
     */
    public function removeStock(array $data): StockOut
    {
        return DB::transaction(function () use ($data) {
            $sparepart = Sparepart::where('id', $data['sparepart_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $quantity = (int) $data['quantity'];
            if ($quantity <= 0) {
                throw ValidationException::withMessages([
                    'quantity' => ['Kuantitas barang keluar harus lebih besar dari 0.'],
                ]);
            }

            // Validasi: stok tidak boleh negatif
            if ($sparepart->current_stock < $quantity) {
                throw ValidationException::withMessages([
                    'quantity' => [
                        "Stok tidak mencukupi untuk item {$sparepart->name}. Stok tersedia: {$sparepart->current_stock}, diminta: {$quantity}."
                    ],
                ]);
            }

            $transactionNumber = $data['transaction_number'] ?? $this->generateTransactionNumber('OUT');

            $stockOut = StockOut::create([
                'transaction_number' => $transactionNumber,
                'sparepart_id' => $sparepart->id,
                'user_id' => $data['user_id'] ?? null,
                'quantity' => $quantity,
                'usage_type' => $data['usage_type'] ?? 'service',
                'reference_number' => $data['reference_number'] ?? null,
                'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
                'notes' => $data['notes'] ?? null,
            ]);

            // Kurangi current_stock
            $sparepart->current_stock -= $quantity;
            $sparepart->save();

            return $stockOut->load('sparepart');
        });
    }

    /**
     * Ambil data ringkasan real-time untuk Dashboard
     *
     * @return array
     */
    public function getDashboardData(): array
    {
        $spareparts = Sparepart::with(['category', 'primarySupplier.supplier'])
            ->where('is_active', true)
            ->get();

        $totalSpareparts = $spareparts->count();
        $totalStock = (int) $spareparts->sum('current_stock');

        $outOfStockCount = $spareparts->where('current_stock', '<=', 0)->count();

        $lowStockItems = $spareparts->filter(function ($sp) {
            return $sp->current_stock <= $sp->rop_threshold;
        })->values();

        $lowStockCount = $lowStockItems->where('current_stock', '>', 0)->count();

        $stockInCount = StockIn::count();
        $stockOutCount = StockOut::count();

        // Estimasi total nilai persediaan jika harga beli tersedia dari supplier utama
        $totalValuation = $spareparts->reduce(function ($carry, $sp) {
            $price = $sp->primarySupplier?->purchase_price ?? 0;
            return $carry + ($sp->current_stock * $price);
        }, 0);

        $recentStockIns = StockIn::with(['sparepart', 'supplier'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        $recentStockOuts = StockOut::with('sparepart')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        // Hitung analisis ilmiah EOQ & ROP untuk seluruh sparepart
        $eoqRopAll = $this->eoqRopService->analyzeAll(30);

        return [
            'summary' => [
                'total_spareparts' => $totalSpareparts,
                'total_stock' => $totalStock,
                'out_of_stock' => $eoqRopAll['summary']['out_of_stock'],
                'low_stock' => $eoqRopAll['summary']['need_order'],
                'stock_in_transactions' => $stockInCount,
                'stock_out_transactions' => $stockOutCount,
                'total_inventory_value' => (float) $totalValuation,
            ],
            'low_stock_items' => $lowStockItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'code' => $item->code,
                    'name' => $item->name,
                    'category' => $item->category?->name ?? '-',
                    'current_stock' => $item->current_stock,
                    'rop_threshold' => $item->rop_threshold,
                    'unit' => $item->unit,
                    'stock_status' => $item->stock_status,
                    'primary_supplier' => $item->primarySupplier?->supplier?->name ?? 'Belum Ditentukan',
                ];
            }),
            'eoq_rop_analysis' => $eoqRopAll['data'],
            'recent_stock_ins' => $recentStockIns->map(function ($item) {
                return [
                    'id' => $item->id,
                    'transaction_number' => $item->transaction_number,
                    'sparepart_name' => $item->sparepart?->name ?? '-',
                    'supplier_name' => $item->supplier?->name ?? '-',
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'transaction_date' => $item->transaction_date?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
                    'notes' => $item->notes,
                ];
            }),
            'recent_stock_outs' => $recentStockOuts->map(function ($item) {
                return [
                    'id' => $item->id,
                    'transaction_number' => $item->transaction_number,
                    'sparepart_name' => $item->sparepart?->name ?? '-',
                    'quantity' => $item->quantity,
                    'usage_type' => $item->usage_type,
                    'reference_number' => $item->reference_number,
                    'transaction_date' => $item->transaction_date?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
                    'notes' => $item->notes,
                ];
            }),
        ];
    }
}
