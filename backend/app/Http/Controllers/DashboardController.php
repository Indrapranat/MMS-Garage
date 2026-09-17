<?php

namespace App\Http\Controllers;

use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(
        protected InventoryService $inventoryService
    ) {}

    public function index(): JsonResponse
    {
        $data = $this->inventoryService->getDashboardData();

        return response()->json([
            'success' => true,
            'message' => 'Data dashboard berhasil dimuat dari database real-time',
            'data' => $data,
            // Format fallback flat jika frontend membaca langsung tanpa nested "data"
            'summary' => $data['summary'],
            'low_stock_items' => $data['low_stock_items'],
            'recent_stock_ins' => $data['recent_stock_ins'],
            'recent_stock_outs' => $data['recent_stock_outs'],
        ]);
    }
}
