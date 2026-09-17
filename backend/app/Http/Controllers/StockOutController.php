<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockOutRequest;
use App\Models\StockOut;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockOutController extends Controller
{
    public function __construct(
        protected InventoryService $inventoryService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = StockOut::with(['sparepart.category', 'user'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc');

        if ($request->has('sparepart_id')) {
            $query->where('sparepart_id', $request->sparepart_id);
        }

        if ($request->has('usage_type')) {
            $query->where('usage_type', $request->usage_type);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('transaction_date', [$request->start_date, $request->end_date]);
        }

        $stockOuts = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $stockOuts->items(),
            'meta' => [
                'current_page' => $stockOuts->currentPage(),
                'per_page' => $stockOuts->perPage(),
                'total' => $stockOuts->total(),
                'last_page' => $stockOuts->lastPage(),
            ],
        ]);
    }

    public function store(StoreStockOutRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['user_id'] = $request->user()?->id;

        $stockOut = $this->inventoryService->removeStock($payload);

        return response()->json([
            'success' => true,
            'message' => 'Barang keluar berhasil dicatat dan stok fisik berkurang',
            'data' => $stockOut,
        ], 201);
    }
}
