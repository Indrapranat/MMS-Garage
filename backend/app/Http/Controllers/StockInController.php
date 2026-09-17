<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockInRequest;
use App\Models\StockIn;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockInController extends Controller
{
    public function __construct(
        protected InventoryService $inventoryService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = StockIn::with(['sparepart.category', 'supplier', 'user'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc');

        if ($request->has('sparepart_id')) {
            $query->where('sparepart_id', $request->sparepart_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('transaction_date', [$request->start_date, $request->end_date]);
        }

        $stockIns = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $stockIns->items(),
            'meta' => [
                'current_page' => $stockIns->currentPage(),
                'per_page' => $stockIns->perPage(),
                'total' => $stockIns->total(),
                'last_page' => $stockIns->lastPage(),
            ],
        ]);
    }

    public function store(StoreStockInRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $payload['user_id'] = $request->user()?->id;

        $stockIn = $this->inventoryService->addStock($payload);

        return response()->json([
            'success' => true,
            'message' => 'Barang masuk berhasil dicatat dan stok fisik bertambah',
            'data' => $stockIn,
        ], 201);
    }
}
