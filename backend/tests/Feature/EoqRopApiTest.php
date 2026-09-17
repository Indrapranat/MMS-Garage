<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Sparepart;
use App\Models\SparepartSupplier;
use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EoqRopApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_eoq_rop_endpoint_returns_academic_structure_and_stock_conditions(): void
    {
        $category = Category::create(['name' => 'Rem']);
        $supplier = Supplier::create(['code' => 'SPL-01', 'name' => 'Supplier Utama AHM']);

        // 1. Kasus Stok Habis (current_stock = 0)
        $spHabis = Sparepart::create([
            'code' => 'PRT-001',
            'name' => 'Busi Iridium',
            'category_id' => $category->id,
            'current_stock' => 0,
            'holding_cost' => 1000,
            'safety_stock' => 5,
        ]);
        SparepartSupplier::create([
            'sparepart_id' => $spHabis->id,
            'supplier_id' => $supplier->id,
            'purchase_price' => 25000,
            'ordering_cost' => 20000,
            'lead_time' => 3,
            'is_primary' => true,
        ]);

        // 2. Kasus Perlu Pesan (current_stock <= ROP)
        // ROP = (d * L) + SS = (0 * 3) + 10 = 10. Current stock = 4 <= 10.
        $spPerluPesan = Sparepart::create([
            'code' => 'PRT-002',
            'name' => 'Kampas Rem',
            'category_id' => $category->id,
            'current_stock' => 4,
            'holding_cost' => 2000,
            'safety_stock' => 10,
        ]);
        SparepartSupplier::create([
            'sparepart_id' => $spPerluPesan->id,
            'supplier_id' => $supplier->id,
            'purchase_price' => 35000,
            'ordering_cost' => 30000,
            'lead_time' => 3,
            'is_primary' => true,
        ]);

        // 3. Kasus Normal (current_stock > ROP)
        // ROP = (0 * 3) + 5 = 5. Current stock = 25 > 5.
        $spNormal = Sparepart::create([
            'code' => 'PRT-003',
            'name' => 'Oli Mesin',
            'category_id' => $category->id,
            'current_stock' => 25,
            'holding_cost' => 2000,
            'safety_stock' => 5,
        ]);
        SparepartSupplier::create([
            'sparepart_id' => $spNormal->id,
            'supplier_id' => $supplier->id,
            'purchase_price' => 45000,
            'ordering_cost' => 35000,
            'lead_time' => 3,
            'is_primary' => true,
        ]);

        // Uji endpoint GET /api/eoq-rop
        $response = $this->getJson('/api/eoq-rop?days=30');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'summary' => [
                    'total_spareparts',
                    'total_stock',
                    'out_of_stock',
                    'need_order',
                    'normal',
                ],
                'data' => [
                    '*' => [
                        'sparepart' => ['id', 'code', 'name'],
                        'input' => ['demand', 'ordering_cost', 'holding_cost', 'average_daily_usage', 'lead_time', 'safety_stock', 'current_stock'],
                        'process' => ['eoq', 'rop', 'eoq_formula', 'eoq_steps', 'rop_formula', 'rop_steps'],
                        'output' => ['stock_status', 'recommended_order_quantity', 'recommendation_note'],
                    ],
                ],
            ]);

        $data = collect($response->json('data'));

        // Cek item 1: STOK HABIS
        $itemHabis = $data->firstWhere('sparepart.code', 'PRT-001');
        $this->assertEquals('STOK HABIS', $itemHabis['output']['stock_status']);
        $this->assertGreaterThan(0, $itemHabis['output']['recommended_order_quantity']);

        // Cek item 2: PERLU PESAN
        $itemPerluPesan = $data->firstWhere('sparepart.code', 'PRT-002');
        $this->assertEquals('PERLU PESAN', $itemPerluPesan['output']['stock_status']);
        $this->assertGreaterThan(0, $itemPerluPesan['output']['recommended_order_quantity']);

        // Cek item 3: NORMAL
        $itemNormal = $data->firstWhere('sparepart.code', 'PRT-003');
        $this->assertEquals('NORMAL', $itemNormal['output']['stock_status']);
        $this->assertEquals(0, $itemNormal['output']['recommended_order_quantity']);
    }

    public function test_single_sparepart_eoq_rop_detail(): void
    {
        $category = Category::create(['name' => 'Kelistrikan']);
        $supplier = Supplier::create(['code' => 'SPL-02', 'name' => 'Supplier Busi']);

        $sparepart = Sparepart::create([
            'code' => 'PRT-BUS-01',
            'name' => 'Busi NGK',
            'category_id' => $category->id,
            'current_stock' => 2,
            'holding_cost' => 500,
            'safety_stock' => 4,
        ]);

        SparepartSupplier::create([
            'sparepart_id' => $sparepart->id,
            'supplier_id' => $supplier->id,
            'purchase_price' => 15000,
            'ordering_cost' => 10000,
            'lead_time' => 2,
            'is_primary' => true,
        ]);

        $response = $this->getJson("/api/eoq-rop/{$sparepart->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.sparepart.code', 'PRT-BUS-01')
            ->assertJsonPath('data.input.current_stock', 2)
            ->assertJsonPath('data.output.stock_status', 'PERLU PESAN');
    }
}
