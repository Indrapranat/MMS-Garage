<?php

namespace App\Services;

class RopService
{
    /**
     * Hitung Reorder Point (ROP) dan Evaluasi Safety Stock
     *
     * Formula:
     * ROP = (d × L) + SS
     *
     * d  = Average Daily Usage (Penggunaan rata-rata per hari kalender)
     * L  = Lead Time supplier (dalam hari)
     * SS = Safety Stock (persediaan pengaman)
     *
     * @param float $demand Total kebutuhan selama periode analisis
     * @param int $periodDays Jumlah hari kalender dalam periode analisis (misal: 30 hari)
     * @param int $leadTime Waktu tunggu pengiriman (hari)
     * @param int $configuredSafetyStock Safety stock yang terkonfigurasi di sparepart
     * @return array
     */
    public function calculate(float $demand, int $periodDays, int $leadTime, int $configuredSafetyStock = 0): array
    {
        $errors = [];

        if ($periodDays <= 0) {
            $errors[] = 'Jumlah hari periode analisis harus lebih besar dari 0.';
        }

        if ($leadTime < 0) {
            $errors[] = 'Lead time tidak boleh bernilai negatif.';
        }

        if ($demand < 0) {
            $errors[] = 'Demand tidak boleh bernilai negatif.';
        }

        if (!empty($errors)) {
            return [
                'status_code' => 'INSUFFICIENT_DATA',
                'average_daily_usage' => 0.0,
                'lead_time' => $leadTime,
                'safety_stock' => $configuredSafetyStock,
                'rop' => 0.0,
                'rop_rounded' => 0,
                'formula' => 'ROP = (d × L) + SS',
                'steps' => 'Data input tidak lengkap atau tidak valid.',
                'errors' => $errors,
            ];
        }

        // Penggunaan harian rata-rata berbasis hari kalender normal
        $avgDailyUsage = $periodDays > 0 ? ($demand / $periodDays) : 0.0;
        $safetyStock = max(0, $configuredSafetyStock);

        // Kebutuhan selama lead time
        $leadTimeUsage = $avgDailyUsage * $leadTime;
        $rawRop = $leadTimeUsage + $safetyStock;
        $roundedRop = (int) ceil($rawRop);

        $steps = sprintf(
            'ROP = (d × L) + SS = (%s unit/hari × %d hari) + %d unit = %s + %d = %s ≈ %d unit',
            number_format($avgDailyUsage, 2, ',', '.'),
            $leadTime,
            $safetyStock,
            number_format($leadTimeUsage, 2, ',', '.'),
            $safetyStock,
            number_format($rawRop, 2, ',', '.'),
            $roundedRop
        );

        return [
            'status_code' => 'CALCULATED',
            'average_daily_usage' => round($avgDailyUsage, 2),
            'lead_time' => $leadTime,
            'safety_stock' => $safetyStock,
            'lead_time_usage' => round($leadTimeUsage, 2),
            'rop' => round($rawRop, 2),
            'rop_rounded' => $roundedRop,
            'formula' => 'ROP = (d × L) + SS',
            'steps' => $steps,
            'errors' => [],
        ];
    }
}
