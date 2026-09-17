<?php

namespace App\Http\Controllers;

use App\Models\Sparepart;
use App\Services\EoqRopService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EoqRopController extends Controller
{
    public function __construct(
        protected EoqRopService $eoqRopService
    ) {}

    /**
     * Analisis komprehensif EOQ & ROP seluruh sparepart
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        if ($days <= 0) {
            $days = 30;
        }

        $result = $this->eoqRopService->analyzeAll($days);

        return response()->json([
            'success' => true,
            'message' => 'Hasil analisis metode EOQ & ROP berhasil dihitung oleh server backend',
            'summary' => $result['summary'],
            'data' => $result['data'],
        ]);
    }

    /**
     * Detail analisis ilmiah transparan untuk satu sparepart
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function show(int $id, Request $request): JsonResponse
    {
        $days = (int) $request->get('days', 30);
        if ($days <= 0) {
            $days = 30;
        }

        $sparepart = Sparepart::with(['category', 'primarySupplier.supplier', 'sparepartSuppliers.supplier'])
            ->findOrFail($id);

        $result = $this->eoqRopService->analyzeSparepart($sparepart, $days);

        return response()->json([
            'success' => true,
            'message' => 'Detail proses perhitungan EOQ & ROP sparepart berhasil dimuat',
            'data' => $result,
        ]);
    }
}
