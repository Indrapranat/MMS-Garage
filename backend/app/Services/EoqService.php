<?php

namespace App\Services;

class EoqService
{
    /**
     * Hitung Economic Order Quantity (EOQ)
     *
     * Formula:
     * EOQ = √((2 × D × S) / H)
     *
     * D = Demand pada periode analisis
     * S = Ordering Cost per order (dari supplier)
     * H = Holding Cost per unit pada periode yang sama (dari sparepart)
     *
     * @param float $demand
     * @param float $orderingCost
     * @param float $holdingCost
     * @return array
     */
    public function calculate(float $demand, float $orderingCost, float $holdingCost): array
    {
        $errors = [];

        if ($holdingCost <= 0) {
            $errors[] = 'Biaya penyimpanan (Holding Cost / H) harus lebih besar dari 0 agar tidak terjadi pembagian dengan nol.';
        }

        if ($orderingCost <= 0) {
            $errors[] = 'Biaya pemesanan (Ordering Cost / S) harus lebih besar dari 0.';
        }

        if ($demand < 0) {
            $errors[] = 'Nilai kebutuhan (Demand / D) tidak boleh bernilai negatif.';
        }

        if (!empty($errors)) {
            return [
                'status_code' => 'INSUFFICIENT_DATA',
                'eoq' => 0.0,
                'eoq_rounded' => 0,
                'formula' => 'EOQ = √((2 × D × S) / H)',
                'steps' => 'Data input tidak lengkap atau tidak valid.',
                'errors' => $errors,
            ];
        }

        if ($demand == 0) {
            return [
                'status_code' => 'CALCULATED',
                'eoq' => 0.0,
                'eoq_rounded' => 0,
                'formula' => 'EOQ = √((2 × D × S) / H)',
                'steps' => 'EOQ = √((2 × 0 × ' . number_format($orderingCost, 0, ',', '.') . ') / ' . number_format($holdingCost, 0, ',', '.') . ') = 0 unit (Tidak ada pemakaian pada periode analisis)',
                'errors' => [],
            ];
        }

        // Komputasi deterministik
        $numerator = 2 * $demand * $orderingCost;
        $insideRoot = $numerator / $holdingCost;
        $rawEoq = sqrt($insideRoot);
        $roundedEoq = (int) round($rawEoq);

        // Jika hasil pembulatan round() menghasilkan 0 padahal ada demand, naikkan ke 1
        if ($roundedEoq === 0 && $rawEoq > 0) {
            $roundedEoq = 1;
        }

        $steps = sprintf(
            'EOQ = √((2 × %s × %s) / %s) = √(%s / %s) = √%s = %s ≈ %d unit',
            number_format($demand, 0, ',', '.'),
            number_format($orderingCost, 0, ',', '.'),
            number_format($holdingCost, 0, ',', '.'),
            number_format($numerator, 0, ',', '.'),
            number_format($holdingCost, 0, ',', '.'),
            number_format($insideRoot, 2, ',', '.'),
            number_format($rawEoq, 2, ',', '.'),
            $roundedEoq
        );

        return [
            'status_code' => 'CALCULATED',
            'eoq' => round($rawEoq, 2),
            'eoq_rounded' => $roundedEoq,
            'formula' => 'EOQ = √((2 × D × S) / H)',
            'steps' => $steps,
            'errors' => [],
        ];
    }
}
