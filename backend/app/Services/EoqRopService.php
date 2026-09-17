<?php

namespace App\Services;

use App\Models\Sparepart;
use App\Models\StockOut;
use Carbon\Carbon;

class EoqRopService
{
    public function __construct(
        protected EoqService $eoqService,
        protected RopService $ropService
    ) {}

    /**
     * Analisis menyeluruh EOQ dan ROP untuk satu sparepart
     *
     * @param Sparepart $sparepart
     * @param int $periodDays Jumlah hari periode analisis (default: 30 hari)
     * @return array
     */
    public function analyzeSparepart(Sparepart $sparepart, int $periodDays = 30): array
    {
        $periodDays = max(1, $periodDays);
        $endDate = Carbon::now()->toDateString();
        $startDate = Carbon::now()->subDays($periodDays)->toDateString();

        // 1. Ekstraksi Demand (D) riil dari histori transaksi Stock Out
        $demand = (float) StockOut::where('sparepart_id', $sparepart->id)
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('quantity');

        // 2. Ambil supplier aktif (prioritas supplier utama)
        $supplierRel = $sparepart->primarySupplier ?? $sparepart->sparepartSuppliers()->where('is_active', true)->first();

        $orderingCost = $supplierRel ? (float) $supplierRel->ordering_cost : 0.0;
        $leadTime = $supplierRel ? (int) $supplierRel->lead_time : 0;
        $purchasePrice = $supplierRel ? (float) $supplierRel->purchase_price : 0.0;
        $holdingCost = (float) $sparepart->holding_cost;
        $safetyStock = (int) $sparepart->safety_stock;
        $currentStock = (int) $sparepart->current_stock;

        // 3. Eksekusi Engine EOQ
        $eoqResult = $this->eoqService->calculate($demand, $orderingCost, $holdingCost);

        // 4. Eksekusi Engine ROP
        $ropResult = $this->ropService->calculate($demand, $periodDays, $leadTime, $safetyStock);

        $eoq = $eoqResult['eoq'];
        $eoqRounded = $eoqResult['eoq_rounded'];
        $rop = $ropResult['rop'];
        $ropRounded = $ropResult['rop_rounded'];

        // 5. Penentuan Status Stok Sesuai PRD
        $stockStatus = 'NORMAL';
        if ($currentStock <= 0) {
            $stockStatus = 'STOK HABIS';
        } elseif ($currentStock <= $ropRounded) {
            $stockStatus = 'PERLU PESAN';
        }

        // 6. Rekomendasi Pengadaan
        $recommendedOrderQty = 0;
        $recommendationReason = 'Stok saat ini (' . $currentStock . ' unit) berada di atas ROP (' . $ropRounded . ' unit). Persediaan aman.';

        if ($stockStatus === 'STOK HABIS' || $stockStatus === 'PERLU PESAN') {
            // Jika EOQ terhitung > 0, gunakan EOQ. Jika demand = 0, rekomendasikan pemenuhan hingga mencapai ROP + Safety
            $recommendedOrderQty = $eoqRounded > 0 ? $eoqRounded : max(1, $ropRounded - $currentStock);
            $recommendationReason = sprintf(
                'Status: %s. Current Stock: %d unit, ROP: %d unit, EOQ: %d unit. Rekomendasi: Pesan %d unit ke supplier %s.',
                $stockStatus,
                $currentStock,
                $ropRounded,
                $eoqRounded,
                $recommendedOrderQty,
                $supplierRel?->supplier?->name ?? 'Pemasok Rekanan'
            );
        }

        $estimatedProcurementCost = $recommendedOrderQty * $purchasePrice;

        // Kumpulkan alasan jika terdapat data yang kurang
        $reasons = array_merge($eoqResult['errors'], $ropResult['errors']);
        if (!$supplierRel) {
            $reasons[] = 'Sparepart belum dipetakan ke supplier aktif manapun.';
        }

        $statusCode = empty($reasons) ? 'CALCULATED' : 'INSUFFICIENT_DATA';

        return [
            'sparepart' => [
                'id' => $sparepart->id,
                'code' => $sparepart->code,
                'name' => $sparepart->name,
                'category' => $sparepart->category?->name ?? '-',
                'unit' => $sparepart->unit,
            ],
            'supplier' => $supplierRel ? [
                'id' => $supplierRel->supplier_id,
                'name' => $supplierRel->supplier?->name ?? '-',
                'is_primary' => (bool) $supplierRel->is_primary,
                'purchase_price' => $purchasePrice,
            ] : null,
            'input' => [
                'analysis_period_days' => $periodDays,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'demand' => $demand,
                'ordering_cost' => $orderingCost,
                'holding_cost' => $holdingCost,
                'average_daily_usage' => $ropResult['average_daily_usage'],
                'lead_time' => $leadTime,
                'safety_stock' => $safetyStock,
                'current_stock' => $currentStock,
                'purchase_price' => $purchasePrice,
            ],
            'process' => [
                'eoq' => $eoq,
                'eoq_rounded' => $eoqRounded,
                'rop' => $rop,
                'rop_rounded' => $ropRounded,
                'eoq_formula' => $eoqResult['formula'],
                'eoq_steps' => $eoqResult['steps'],
                'rop_formula' => $ropResult['formula'],
                'rop_steps' => $ropResult['steps'],
            ],
            'output' => [
                'stock_status' => $stockStatus,
                'recommended_order_quantity' => $recommendedOrderQty,
                'estimated_procurement_cost' => $estimatedProcurementCost,
                'recommendation_note' => $recommendationReason,
                'status_code' => $statusCode,
                'reasons' => $reasons,
            ],
        ];
    }

    /**
     * Analisis seluruh sparepart aktif dalam sistem
     *
     * @param int $periodDays
     * @return array
     */
    public function analyzeAll(int $periodDays = 30): array
    {
        $spareparts = Sparepart::with(['category', 'primarySupplier.supplier', 'sparepartSuppliers.supplier'])
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();

        $items = [];
        $totalStock = 0;
        $outOfStockCount = 0;
        $needOrderCount = 0;
        $normalCount = 0;
        $totalProcurementCost = 0.0;

        foreach ($spareparts as $sp) {
            $analysis = $this->analyzeSparepart($sp, $periodDays);
            $items[] = $analysis;

            $totalStock += $analysis['input']['current_stock'];
            if ($analysis['output']['stock_status'] === 'STOK HABIS') {
                $outOfStockCount++;
                $needOrderCount++; // Stok habis juga termasuk perlu pesan mendesak
            } elseif ($analysis['output']['stock_status'] === 'PERLU PESAN') {
                $needOrderCount++;
            } else {
                $normalCount++;
            }

            $totalProcurementCost += $analysis['output']['estimated_procurement_cost'];
        }

        return [
            'summary' => [
                'total_spareparts' => count($spareparts),
                'total_stock' => $totalStock,
                'out_of_stock' => $outOfStockCount,
                'need_order' => $needOrderCount,
                'normal' => $normalCount,
                'analysis_period_days' => $periodDays,
                'estimated_total_procurement_budget' => $totalProcurementCost,
            ],
            'data' => $items,
        ];
    }
}
