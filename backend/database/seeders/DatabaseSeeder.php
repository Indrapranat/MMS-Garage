<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Sparepart;
use App\Models\SparepartSupplier;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin/Owner Tunggal
        $owner = User::firstOrCreate(
            ['email' => 'owner@bengkel.com'],
            [
                'name' => 'Owner Bengkel Ryan',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Kategori Sparepart
        $catOli = Category::firstOrCreate(['name' => 'Oli & Pelumas'], ['description' => 'Oli mesin, oli gardan, minyak rem']);
        $catRem = Category::firstOrCreate(['name' => 'Sistem Pengereman'], ['description' => 'Kampas rem depan, belakang, disc brake']);
        $catCvt = Category::firstOrCreate(['name' => 'Transmisi & CVT'], ['description' => 'Roller, v-belt, kampas ganda, per cvt']);
        $catListrik = Category::firstOrCreate(['name' => 'Pengapian & Kelistrikan'], ['description' => 'Busi, aki, bohlam, koil']);
        $catBan = Category::firstOrCreate(['name' => 'Ban & Roda'], ['description' => 'Ban luar tubeless, ban dalam, pentil']);

        // 3. Data Supplier (Utama & Cadangan)
        $supAhm = Supplier::firstOrCreate(
            ['code' => 'SPL-AHM-01'],
            [
                'name' => 'PT Daya Adicipta Mitra (Distributor Honda)',
                'phone' => '081234567890',
                'contact_person' => 'Budi Santoso',
                'address' => 'Jl. Perintis Kemerdekaan KM 12',
                'is_active' => true,
            ]
        );

        $supYmh = Supplier::firstOrCreate(
            ['code' => 'SPL-YMH-02'],
            [
                'name' => 'PT Suracojaya Abadimotor (Distributor Yamaha)',
                'phone' => '081398765432',
                'contact_person' => 'Hendri Wijaya',
                'address' => 'Jl. Veteran Selatan No. 45',
                'is_active' => true,
            ]
        );

        $supLokal = Supplier::firstOrCreate(
            ['code' => 'SPL-SJM-03'],
            [
                'name' => 'Toko Grosir Sumber Jaya Motor (Cadangan Lokal)',
                'phone' => '085244112233',
                'contact_person' => 'Haji Lukman',
                'address' => 'Pasar Sentral Grosir Blok B/12',
                'is_active' => true,
            ]
        );

        // 4. Data Master Sparepart (Normal, Rendah, Habis)
        $sparepartsData = [
            [
                'code' => 'PRT-OLI-001',
                'name' => 'Oli Mesin AHM MPX2 0.8L (Matic)',
                'category_id' => $catOli->id,
                'unit' => 'botol',
                'current_stock' => 35, // NORMAL (ROP ~ 10)
                'holding_cost' => 2000,
                'safety_stock' => 10,
                'primary_supplier' => $supAhm->id,
                'price' => 45000,
                'ordering_cost' => 35000,
                'lead_time' => 3,
                'backup_supplier' => $supLokal->id,
                'backup_price' => 47500,
                'backup_ordering' => 20000,
                'backup_lead' => 1,
            ],
            [
                'code' => 'PRT-REM-001',
                'name' => 'Kampas Rem Depan Vario 125/150 CBS',
                'category_id' => $catRem->id,
                'unit' => 'set',
                'current_stock' => 4, // PERLU PESAN (ROP 8)
                'holding_cost' => 1500,
                'safety_stock' => 8,
                'primary_supplier' => $supAhm->id,
                'price' => 38000,
                'ordering_cost' => 30000,
                'lead_time' => 3,
                'backup_supplier' => $supLokal->id,
                'backup_price' => 41000,
                'backup_ordering' => 15000,
                'backup_lead' => 1,
            ],
            [
                'code' => 'PRT-CVT-001',
                'name' => 'Roller Set Beat FI / Scoopy (11gr)',
                'category_id' => $catCvt->id,
                'unit' => 'set',
                'current_stock' => 3, // PERLU PESAN (ROP 6)
                'holding_cost' => 1000,
                'safety_stock' => 6,
                'primary_supplier' => $supAhm->id,
                'price' => 28000,
                'ordering_cost' => 25000,
                'lead_time' => 3,
                'backup_supplier' => null,
            ],
            [
                'code' => 'PRT-BUS-001',
                'name' => 'Busi Standar NGK CPR9EA-9',
                'category_id' => $catListrik->id,
                'unit' => 'pcs',
                'current_stock' => 0, // STOK HABIS (Kritis)
                'holding_cost' => 500,
                'safety_stock' => 12,
                'primary_supplier' => $supAhm->id,
                'price' => 18000,
                'ordering_cost' => 20000,
                'lead_time' => 2,
                'backup_supplier' => $supLokal->id,
                'backup_price' => 20000,
                'backup_ordering' => 10000,
                'backup_lead' => 1,
            ],
            [
                'code' => 'PRT-CVT-002',
                'name' => 'V-Belt Kit Honda Scoopy ESP',
                'category_id' => $catCvt->id,
                'unit' => 'set',
                'current_stock' => 18, // NORMAL (ROP 5)
                'holding_cost' => 5000,
                'safety_stock' => 5,
                'primary_supplier' => $supAhm->id,
                'price' => 115000,
                'ordering_cost' => 40000,
                'lead_time' => 4,
                'backup_supplier' => null,
            ],
            [
                'code' => 'PRT-BAN-001',
                'name' => 'Ban Tubeless IRC 90/90-14 NF59',
                'category_id' => $catBan->id,
                'unit' => 'pcs',
                'current_stock' => 9, // NORMAL (ROP 4)
                'holding_cost' => 6000,
                'safety_stock' => 4,
                'primary_supplier' => $supLokal->id,
                'price' => 195000,
                'ordering_cost' => 25000,
                'lead_time' => 2,
                'backup_supplier' => null,
            ],
            [
                'code' => 'PRT-REM-002',
                'name' => 'Minyak Rem DOT 4 Jumbo Merah 50ml',
                'category_id' => $catRem->id,
                'unit' => 'botol',
                'current_stock' => 0, // STOK HABIS (Kritis)
                'holding_cost' => 500,
                'safety_stock' => 6,
                'primary_supplier' => $supLokal->id,
                'price' => 8500,
                'ordering_cost' => 15000,
                'lead_time' => 1,
                'backup_supplier' => null,
            ],
        ];

        foreach ($sparepartsData as $item) {
            $sp = Sparepart::updateOrCreate(
                ['code' => $item['code']],
                [
                    'name' => $item['name'],
                    'category_id' => $item['category_id'],
                    'unit' => $item['unit'],
                    'current_stock' => $item['current_stock'],
                    'holding_cost' => $item['holding_cost'],
                    'safety_stock' => $item['safety_stock'],
                    'is_active' => true,
                ]
            );

            // Relasi supplier utama
            SparepartSupplier::updateOrCreate(
                [
                    'sparepart_id' => $sp->id,
                    'supplier_id' => $item['primary_supplier'],
                ],
                [
                    'purchase_price' => $item['price'],
                    'ordering_cost' => $item['ordering_cost'],
                    'lead_time' => $item['lead_time'],
                    'is_primary' => true,
                    'is_active' => true,
                ]
            );

            // Relasi supplier cadangan jika ada
            if (!empty($item['backup_supplier'])) {
                SparepartSupplier::updateOrCreate(
                    [
                        'sparepart_id' => $sp->id,
                        'supplier_id' => $item['backup_supplier'],
                    ],
                    [
                        'purchase_price' => $item['backup_price'] ?? $item['price'],
                        'ordering_cost' => $item['backup_ordering'] ?? $item['ordering_cost'],
                        'lead_time' => $item['backup_lead'] ?? 1,
                        'is_primary' => false,
                        'is_active' => true,
                    ]
                );
            }
        }

        // 5. Riwayat Stock In Awal
        $spOli = Sparepart::where('code', 'PRT-OLI-001')->first();
        $spVbelt = Sparepart::where('code', 'PRT-CVT-002')->first();
        $spBan = Sparepart::where('code', 'PRT-BAN-001')->first();

        if ($spOli) {
            StockIn::firstOrCreate(
                ['transaction_number' => 'IN-20260901-0001-A1B2'],
                [
                    'sparepart_id' => $spOli->id,
                    'supplier_id' => $supAhm->id,
                    'user_id' => $owner->id,
                    'quantity' => 40,
                    'unit_price' => 45000,
                    'source_type' => 'PURCHASE',
                    'transaction_date' => '2026-09-01',
                    'notes' => 'Restock awal bulan faktur DO-9981',
                ]
            );
        }

        if ($spVbelt) {
            StockIn::firstOrCreate(
                ['transaction_number' => 'IN-20260905-0002-C3D4'],
                [
                    'sparepart_id' => $spVbelt->id,
                    'supplier_id' => $supAhm->id,
                    'user_id' => $owner->id,
                    'quantity' => 20,
                    'unit_price' => 115000,
                    'source_type' => 'PURCHASE',
                    'transaction_date' => '2026-09-05',
                    'notes' => 'Pengiriman rutin part matic',
                ]
            );
        }

        if ($spBan) {
            StockIn::firstOrCreate(
                ['transaction_number' => 'IN-20260910-0003-E5F6'],
                [
                    'sparepart_id' => $spBan->id,
                    'supplier_id' => $supLokal->id,
                    'user_id' => $owner->id,
                    'quantity' => 10,
                    'unit_price' => 195000,
                    'source_type' => 'PURCHASE',
                    'transaction_date' => '2026-09-10',
                    'notes' => 'Beli dari Sumber Jaya Motor',
                ]
            );
        }

        // 6. Riwayat Stock Out (Pemakaian Servis & Penjualan)
        $spRem = Sparepart::where('code', 'PRT-REM-001')->first();
        $spRoller = Sparepart::where('code', 'PRT-CVT-001')->first();

        if ($spOli) {
            StockOut::firstOrCreate(
                ['transaction_number' => 'OUT-20260908-0001-K1L2'],
                [
                    'sparepart_id' => $spOli->id,
                    'user_id' => $owner->id,
                    'quantity' => 3,
                    'usage_type' => 'service',
                    'reference_number' => 'DD 4521 XY (Vario 150)',
                    'transaction_date' => '2026-09-08',
                    'notes' => 'Ganti oli berkala servis ringan',
                ]
            );

            StockOut::firstOrCreate(
                ['transaction_number' => 'OUT-20260912-0002-M3N4'],
                [
                    'sparepart_id' => $spOli->id,
                    'user_id' => $owner->id,
                    'quantity' => 2,
                    'usage_type' => 'sales',
                    'reference_number' => 'Nota Eceran #1042',
                    'transaction_date' => '2026-09-12',
                    'notes' => 'Pelanggan beli bawa pulang',
                ]
            );
        }

        if ($spRem) {
            StockOut::firstOrCreate(
                ['transaction_number' => 'OUT-20260914-0003-O5P6'],
                [
                    'sparepart_id' => $spRem->id,
                    'user_id' => $owner->id,
                    'quantity' => 2,
                    'usage_type' => 'service',
                    'reference_number' => 'DD 8820 AB (Beat FI)',
                    'transaction_date' => '2026-09-14',
                    'notes' => 'Rem bunyi & aus parah',
                ]
            );
        }

        if ($spRoller) {
            StockOut::firstOrCreate(
                ['transaction_number' => 'OUT-20260916-0004-Q7R8'],
                [
                    'sparepart_id' => $spRoller->id,
                    'user_id' => $owner->id,
                    'quantity' => 1,
                    'usage_type' => 'service',
                    'reference_number' => 'DD 1290 MN (Scoopy ESP)',
                    'transaction_date' => '2026-09-16',
                    'notes' => 'Gredek tarikan awal servis CVT',
                ]
            );
        }
    }
}
