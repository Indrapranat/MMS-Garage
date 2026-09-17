<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSparepartRequest;
use App\Models\Sparepart;
use App\Models\SparepartSupplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SparepartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Sparepart::with(['category', 'primarySupplier.supplier', 'suppliers'])
            ->where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $spareparts = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $spareparts,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $sparepart = Sparepart::with(['category', 'primarySupplier.supplier', 'suppliers'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $sparepart,
        ]);
    }

    public function store(StoreSparepartRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $sparepart = DB::transaction(function () use ($validated) {
            $sparepart = Sparepart::create([
                'code' => $validated['code'],
                'name' => $validated['name'],
                'category_id' => $validated['category_id'],
                'unit' => $validated['unit'] ?? 'pcs',
                'current_stock' => $validated['current_stock'] ?? 0,
                'holding_cost' => $validated['holding_cost'] ?? 0,
                'safety_stock' => $validated['safety_stock'] ?? 0,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Jika ada supplier yang langsung dihubungkan
            if (!empty($validated['supplier_id'])) {
                SparepartSupplier::create([
                    'sparepart_id' => $sparepart->id,
                    'supplier_id' => $validated['supplier_id'],
                    'purchase_price' => $validated['purchase_price'] ?? 0,
                    'ordering_cost' => $validated['ordering_cost'] ?? 0,
                    'lead_time' => $validated['lead_time'] ?? 1,
                    'is_primary' => true,
                    'is_active' => true,
                ]);
            }

            return $sparepart->load(['category', 'primarySupplier.supplier', 'suppliers']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Sparepart berhasil ditambahkan',
            'data' => $sparepart,
        ], 201);
    }
}
