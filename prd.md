# Product Requirements Document (PRD)

## Workshop Inventory Management System

### Sistem Manajemen Persediaan Sparepart Bengkel Motor Berbasis EOQ dan ROP

**Versi:** 1.1  
**Status:** Baseline untuk perancangan ERD, API, dan implementasi  
**Jenis:** Web Application  
**Target:** Bengkel motor skala kecil  
**Tujuan:** Portfolio Software Engineering + penelitian/akademik  

---

# 1. Product Overview

Workshop Inventory Management System adalah aplikasi web untuk membantu pemilik bengkel motor skala kecil mengelola persediaan sparepart, transaksi stok, supplier, pembelian, serta menentukan kebutuhan pengadaan menggunakan metode **Economic Order Quantity (EOQ)** dan **Reorder Point (ROP)**.

Aplikasi dirancang untuk digunakan oleh **satu pengguna utama**, yaitu pemilik bengkel yang sekaligus bertindak sebagai administrator sistem.

Sistem tidak menggunakan workflow multi-user atau approval berjenjang.

Alur utama sistem:

**Data Sparepart → Transaksi Stok → Histori Pemakaian → Analisis EOQ → ROP + Safety Stock → Status Stok → Rekomendasi Pengadaan → Purchase Order**

---

# 2. Business Context

Sistem ditujukan untuk bengkel motor skala kecil di daerah/kampung dengan kondisi:

* hanya terdapat satu lokasi bengkel;
* pemilik merupakan pengelola utama bengkel;
* pemilik juga melakukan pengelolaan stok;
* jumlah pekerja sangat terbatas;
* belum diperlukan pembagian hak akses yang kompleks;
* supplier utama dapat digunakan sebagai sumber pembelian utama;
* supplier cadangan dapat ditambahkan apabila diperlukan;
* satu sparepart dapat tersedia dari lebih dari satu supplier;
* harga sparepart dapat berbeda antar supplier.

Sistem harus tetap sederhana untuk digunakan oleh owner, tetapi memiliki struktur database dan metode pengelolaan persediaan yang cukup kuat untuk kebutuhan akademik dan portfolio.

---

# 3. Product Objectives

## 3.1 Tujuan Utama

1. Mengelola data sparepart secara terstruktur.
2. Mengelola data supplier.
3. Mencatat barang masuk dan barang keluar.
4. Mengetahui stok aktual setiap sparepart.
5. Menyimpan histori transaksi persediaan.
6. Menghitung kebutuhan pemesanan menggunakan EOQ.
7. Menentukan titik pemesanan kembali menggunakan ROP.
8. Mempertimbangkan safety stock dalam ROP.
9. Memberikan rekomendasi pengadaan.
10. Membuat Purchase Order dari rekomendasi pengadaan.
11. Menyediakan laporan persediaan dan transaksi.
12. Menyediakan data yang dapat dipertanggungjawabkan untuk penelitian/analisis.

---

# 4. User and Role

Sistem hanya memiliki **satu role**:

## Admin/Owner

Admin/Owner memiliki seluruh akses sistem:

* login;
* mengelola sparepart;
* mengelola kategori;
* mengelola supplier;
* mengelola hubungan sparepart dengan supplier;
* mencatat barang masuk;
* mencatat barang keluar;
* melakukan stock opname;
* melihat histori stok;
* menjalankan analisis EOQ;
* melihat ROP;
* melihat safety stock;
* melihat rekomendasi pengadaan;
* membuat Purchase Order;
* memperbarui status Purchase Order;
* melihat laporan;
* mengelola data pengguna.

Tidak terdapat role:

* Mekanik
* Gudang
* Supervisor
* Manager
* Purchasing terpisah

Karena pemilik bekerja secara mandiri.

---

# 5. Scope

## 5.1 In Scope

### Master Data

* Kategori sparepart
* Sparepart
* Supplier
* Relasi sparepart-supplier

### Inventory

* Stok saat ini
* Barang masuk
* Barang keluar
* Stock opname
* Histori perubahan stok

### Analysis

* Histori demand
* EOQ
* Average Daily Usage
* Safety Stock
* ROP
* Status persediaan

### Procurement

* Rekomendasi pengadaan
* Purchase Order
* Status Purchase Order
* Penerimaan barang dari PO

### Reporting

* Laporan stok
* Laporan barang masuk
* Laporan barang keluar
* Laporan pembelian
* Laporan analisis EOQ/ROP
* Laporan rekomendasi pengadaan

### Authentication

* Login
* Logout
* Current user

---

# 6. Out of Scope

Untuk versi awal tidak mencakup:

* multi-cabang;
* multi-warehouse;
* multi-role kompleks;
* approval berjenjang;
* payroll;
* akuntansi;
* pembukuan keuangan penuh;
* kasir/POS lengkap;
* integrasi supplier eksternal;
* pembayaran online;
* marketplace;
* mobile application native;
* machine learning/prediksi demand;
* otomatis melakukan pembelian kepada supplier.

---

# 7. Master Data

## 7.1 Category

Menyimpan kategori sparepart.

Contoh:

* Mesin
* Rem
* Kelistrikan
* CVT
* Suspensi
* Ban
* Oli
* Body

Data minimal:

* id
* name
* description
* timestamps

Relasi:

**Category 1 : N Sparepart**

---

# 8. Sparepart

Data sparepart minimal:

* id
* code
* name
* category_id
* unit
* current_stock
* minimum_stock/safety-related configuration jika diperlukan
* holding_cost
* is_active
* timestamps

Aturan:

* code harus unik;
* current_stock tidak boleh negatif;
* sparepart harus memiliki kategori;
* sparepart dapat memiliki satu atau lebih supplier.

Harga tidak disimpan sebagai satu-satunya harga pada tabel sparepart karena harga dapat berbeda berdasarkan supplier.

---

# 9. Supplier

Data minimal:

* id
* code
* name
* phone
* address
* contact_person
* is_active
* timestamps

Sistem mendukung:

* satu supplier utama;
* supplier cadangan;
* penambahan supplier lain jika diperlukan di masa depan.

---

# 10. Relasi Sparepart dan Supplier

Digunakan untuk mendukung satu sparepart yang dapat dibeli dari beberapa supplier.

Relasi:

**Sparepart N : N Supplier**

Melalui tabel:

`sparepart_suppliers`

Data yang direkomendasikan:

* id
* sparepart_id
* supplier_id
* supplier_part_number
* purchase_price
* ordering_cost
* lead_time
* is_primary
* is_active
* timestamps

Aturan:

* satu sparepart dapat memiliki beberapa supplier;
* maksimal satu supplier dapat ditandai sebagai supplier utama untuk satu sparepart;
* supplier lain dapat menjadi supplier cadangan;
* purchase_price dapat berbeda antar supplier;
* lead_time dapat berbeda antar supplier;
* ordering_cost dapat berbeda antar supplier;
* supplier utama digunakan sebagai default sumber pengadaan;
* supplier cadangan dapat dipilih apabila supplier utama tidak digunakan.

Jika `supplier_part_number` belum diketahui atau tidak digunakan oleh bengkel, field tersebut dapat dibuat nullable.

---

# 11. Inventory Management

## 11.1 Current Stock

Stok aktual menjadi sumber kebenaran sistem.

Stok tidak boleh dihitung hanya dari tampilan frontend.

Perubahan stok dilakukan melalui backend.

---

# 12. Stock In

Stock In mencatat seluruh penambahan stok.

Sumber barang masuk dapat berupa:

1. Pembelian
2. Retur
3. Penyesuaian stok
4. Penerimaan dari Purchase Order

Contoh:

**Kampas Rem → Qty 10 → Pembelian → Supplier A**

Data minimal:

* transaction_number
* sparepart_id
* supplier_id jika berasal dari supplier
* purchase_order_id jika berasal dari PO
* quantity
* unit_price
* transaction_date
* user_id
* notes

Setiap Stock In akan menambah `current_stock`.

---

# 13. Stock Out

Stock Out mencatat penggunaan atau pengurangan sparepart.

Jenis penggunaan:

* Servis pelanggan
* Penjualan sparepart
* Penyesuaian stok

Contoh:

**Kampas Rem → Qty 2 → Servis**

Data minimal:

* transaction_number
* sparepart_id
* quantity
* usage_type
* transaction_date
* user_id
* notes

Stock Out akan mengurangi `current_stock`.

Aturan:

`quantity_stock_out <= current_stock`

Sistem tidak boleh mengizinkan stok menjadi negatif.

---

# 14. Stock Opname

Stock opname digunakan untuk mencocokkan:

**Stok Sistem vs Stok Fisik**

Data minimal:

* id
* sparepart_id
* system_stock
* physical_stock
* difference
* adjustment
* transaction_date
* user_id
* notes

Jika terdapat selisih, sistem dapat melakukan penyesuaian stok.

Penyesuaian harus tercatat sehingga perubahan stok tetap dapat ditelusuri.

---

# 15. Demand / Historical Usage

Demand EOQ menggunakan histori **Stock Out** sebagai sumber utama.

Contoh:

| Tanggal | Sparepart  | Qty | Penggunaan |
| ------- | ---------- | --: | ---------- |
| 1 Sep   | Kampas Rem |   2 | Servis     |
| 5 Sep   | Kampas Rem |   1 | Servis     |
| 10 Sep  | Kampas Rem |   2 | Penjualan  |

Total demand periode tersebut = 5 unit.

Sistem menyediakan analisis berdasarkan periode:

* mingguan;
* bulanan;
* custom date range jika diperlukan.

Periode analisis harus selalu ditampilkan pada hasil analisis.

---

# 16. EOQ

Metode EOQ digunakan untuk menentukan kuantitas pemesanan ekonomis.

Formula:

**EOQ = √((2 × D × S) / H)**

Keterangan:

* D = demand pada periode analisis
* S = ordering cost
* H = holding cost per unit

Karena sistem digunakan untuk bengkel kecil dan data historis mungkin belum tersedia selama satu tahun, sistem **tidak boleh secara otomatis menganggap data pendek sebagai data tahunan**.

Jika analisis dilakukan mingguan atau bulanan, periode tersebut harus ditampilkan secara eksplisit.

Jika penelitian membutuhkan demand tahunan, annualisasi harus dilakukan dengan metode yang terdokumentasi dan tidak boleh disembunyikan dari pengguna.

---

# 17. Ordering Cost

Ordering Cost tidak dibuat sebagai satu nilai global untuk seluruh sparepart.

Karena supplier dapat berbeda, Ordering Cost dapat disimpan pada hubungan:

**Sparepart + Supplier**

Contoh:

Kampas Rem:

* Supplier A → Ordering Cost Rp50.000
* Supplier B → Ordering Cost Rp60.000

Jika terdapat kebutuhan sederhana pada implementasi awal, sistem dapat memberikan nilai default yang dapat diubah oleh Admin/Owner.

---

# 18. Holding Cost

Holding Cost disimpan sebagai parameter sparepart.

Contoh:

Kampas Rem:

`Holding Cost = Rp5.000/unit/periode`

Nilai dan periode harus dijelaskan secara konsisten pada implementasi dan penelitian.

Sistem harus menghindari penggunaan satuan yang tidak konsisten.

---

# 19. ROP

ROP digunakan untuk menentukan kapan sparepart perlu dipesan kembali.

ROP menggunakan:

**ROP = (d × L) + SS**

Keterangan:

* d = rata-rata penggunaan per hari
* L = lead time supplier dalam hari
* SS = safety stock

Average Daily Usage menggunakan **hari kalender normal**, bukan hanya hari kerja bengkel.

Contoh:

Demand = 60 unit dalam 30 hari

`d = 60 / 30 = 2 unit/hari`

Lead Time = 5 hari

Safety Stock = 5 unit

Maka:

`ROP = (2 × 5) + 5`

`ROP = 15 unit`

---

# 20. Safety Stock

Safety Stock digunakan sebagai buffer terhadap ketidakpastian permintaan dan lead time.

Metode perhitungan Safety Stock harus ditentukan secara eksplisit dalam implementasi/penelitian.

Untuk versi awal, sistem dapat menggunakan parameter safety stock yang dapat dikonfigurasi atau metode statistik sederhana berdasarkan histori demand apabila data mencukupi.

Sistem tidak boleh menghasilkan safety stock secara acak.

---

# 21. Supplier Selection for Procurement

Karena satu sparepart dapat memiliki supplier utama dan cadangan, rekomendasi pengadaan harus menyimpan informasi supplier yang digunakan.

Prioritas awal:

1. Supplier utama.
2. Jika supplier utama tidak tersedia/tidak aktif, supplier cadangan.
3. Admin dapat mengganti supplier secara manual.

Pemilihan supplier bukan bagian dari perhitungan EOQ inti.

EOQ dan supplier selection harus dipisahkan agar metodologi tetap jelas.

---

# 22. Inventory Status

Status stok ditentukan dari hubungan antara current stock dan ROP.

### Stok Normal

`current_stock > ROP`

Status:

**Normal**

### Perlu Pesan

`0 < current_stock <= ROP`

Status:

**Perlu Pesan**

### Stok Habis

`current_stock = 0`

Status:

**Stok Habis**

---

# 23. Procurement Recommendation

Sistem menghasilkan rekomendasi apabila:

`current_stock <= ROP`

Rekomendasi mencakup:

* sparepart;
* current stock;
* demand;
* EOQ;
* safety stock;
* ROP;
* supplier yang direkomendasikan;
* lead time;
* estimated purchase price;
* recommended order quantity;
* alasan rekomendasi.

Default:

**Recommended Order Quantity = EOQ**

Rekomendasi tidak langsung melakukan pembelian.

Admin/Owner tetap menentukan apakah rekomendasi tersebut akan dibuat menjadi Purchase Order.

---

# 24. Purchase Order

Purchase Order disediakan dalam sistem karena akan membuat alur pengadaan lebih lengkap.

Namun karena hanya terdapat satu owner, **tidak diperlukan approval berjenjang**.

Alur:

**Recommendation → Draft PO → Ordered → Partially Received → Received**

Alternatif akhir:

**Draft → Cancelled**

Status:

* Draft
* Ordered
* Partially Received
* Received
* Cancelled

Purchase Order memiliki:

### Header

* PO number
* supplier_id
* order_date
* expected_date
* status
* notes
* total_amount

### Items

* purchase_order_id
* sparepart_id
* quantity
* unit_price
* subtotal
* received_quantity

Relasi:

**Purchase Order 1 : N Purchase Order Item**

**Sparepart 1 : N Purchase Order Item**

**Supplier 1 : N Purchase Order**

---

# 25. Receiving Purchase Order

Penerimaan barang dari PO harus dapat dicatat.

Contoh:

PO:

Kampas Rem = 20 unit

Supplier hanya mengirim:

10 unit.

Status:

**Partially Received**

Setelah 10 unit berikutnya diterima:

**Received**

Penerimaan barang akan menghasilkan Stock In.

Stock In dan Purchase Order harus tetap menjadi konsep berbeda:

* PO = rencana/pemesanan;
* Stock In = barang benar-benar diterima dan masuk ke persediaan.

---

# 26. Dashboard

Dashboard menampilkan ringkasan:

* total sparepart;
* total stok;
* stok habis;
* sparepart perlu dipesan;
* purchase order aktif;
* barang masuk;
* barang keluar;
* rekomendasi pengadaan;
* ringkasan demand.

Visualisasi dapat menggunakan chart untuk:

* tren Stock In;
* tren Stock Out;
* penggunaan sparepart;
* status stok;
* pengadaan.

---

# 27. Reports

Laporan minimal:

### Laporan Sparepart

* kode
* nama
* kategori
* stok
* supplier utama
* harga

### Laporan Stock In

* nomor transaksi
* tanggal
* sparepart
* supplier
* quantity
* harga

### Laporan Stock Out

* nomor transaksi
* tanggal
* sparepart
* quantity
* jenis penggunaan

### Laporan Stock Opname

* tanggal
* sparepart
* stok sistem
* stok fisik
* selisih

### Laporan EOQ/ROP

* periode
* demand
* ordering cost
* holding cost
* EOQ
* daily usage
* lead time
* safety stock
* ROP
* current stock
* status

### Laporan Purchase Order

* nomor PO
* supplier
* tanggal
* total
* status

---

# 28. Database Relationships

Struktur konseptual:

```text
User
 ├── 1:N StockIn
 ├── 1:N StockOut
 ├── 1:N StockOpname
 └── 1:N PurchaseOrder

Category
 └── 1:N Sparepart

Sparepart
 ├── N:N Supplier
 │      └── sparepart_suppliers
 ├── 1:N StockIn
 ├── 1:N StockOut
 ├── 1:N StockOpname
 └── 1:N PurchaseOrderItem

Supplier
 ├── N:N Sparepart
 │      └── sparepart_suppliers
 ├── 1:N StockIn
 └── 1:N PurchaseOrder

PurchaseOrder
 └── 1:N PurchaseOrderItem

PurchaseOrderItem
 └── N:1 Sparepart
```

---

# 29. Proposed Core Tables

Minimal database:

```text
users

categories

suppliers

spareparts

sparepart_suppliers

stock_ins

stock_outs

stock_opnames

purchase_orders

purchase_order_items
```

Jika diperlukan audit trail yang lebih kuat, dapat ditambahkan:

```text
inventory_movements
```

Tabel tersebut dapat menjadi ledger seluruh perubahan stok.

---

# 30. Data Integrity

Backend menjadi sumber kebenaran sistem.

Aturan:

* frontend tidak menghitung stok sebagai sumber utama;
* frontend tidak menjadi sumber utama EOQ;
* frontend tidak menjadi sumber utama ROP;
* transaksi Stock In menggunakan database transaction;
* transaksi Stock Out menggunakan database transaction;
* stok tidak boleh negatif;
* foreign key harus diterapkan;
* kode sparepart unik;
* nomor transaksi unik;
* nomor PO unik;
* data supplier yang digunakan transaksi tidak boleh dihapus secara sembarangan;
* gunakan soft delete/deactivation jika diperlukan.

---

# 31. API Architecture

Arsitektur:

```text
Next.js Frontend
       ↓
REST API
       ↓
Laravel 13
       ↓
Service Layer
       ↓
Eloquent Models
       ↓
MySQL
```

Flow:

```text
Route
 ↓
Controller
 ↓
Form Request
 ↓
Service
 ↓
Model / Database
 ↓
API Resource
 ↓
JSON Response
```

---

# 32. Business Logic Separation

Business logic utama berada pada Laravel backend.

Service yang disarankan:

```text
InventoryService
EoqService
RopService
ProcurementRecommendationService
PurchaseOrderService
StockOpnameService
```

Frontend hanya:

* meminta data;
* menampilkan data;
* mengirim input;
* menampilkan hasil dari API.

---

# 33. Authentication

Menggunakan:

**Laravel Sanctum**

Endpoint:

```text
POST /api/login
POST /api/logout
GET  /api/user
```

Karena hanya satu role, authorization lebih sederhana tetapi authentication tetap wajib.

---

# 34. Frontend Modules

Next.js frontend minimal memiliki:

```text
Dashboard

Spareparts
Categories
Suppliers

Stock In
Stock Out
Stock Opname
Inventory

EOQ & ROP Analysis
Procurement Recommendations

Purchase Orders

Reports

Profile / Account
```

---

# 35. UI/UX Principles

Karena pengguna adalah owner bengkel dan bukan pengguna enterprise:

* sederhana;
* cepat dipahami;
* mobile responsive;
* form tidak terlalu kompleks;
* dashboard informatif;
* status stok mudah terlihat;
* rekomendasi pengadaan mudah ditemukan;
* penggunaan istilah konsisten;
* tidak menampilkan fitur yang tidak diperlukan.

---

# 36. Development Principles

1. PRD menjadi dasar pengembangan.
2. ERD dibuat berdasarkan PRD.
3. API contract dibuat berdasarkan ERD dan business rules.
4. Frontend dan backend mengikuti API contract yang sama.
5. Jangan membuat field database hanya karena frontend membutuhkannya tanpa validasi terhadap domain.
6. Jangan membuat business logic baru tanpa mendokumentasikannya.
7. EOQ dan ROP berada di backend.
8. Database harus relational.
9. Foreign key dan constraint harus digunakan.
10. Hindari duplikasi data.
11. Gunakan service layer untuk business logic.
12. Semua perubahan stok harus dapat ditelusuri.
13. Purchase Order tidak sama dengan Stock In.
14. Recommendation tidak sama dengan Purchase Order.
15. Purchase Order tidak otomatis berarti barang sudah masuk.
16. Supplier utama/cadangan tidak boleh menghilangkan fleksibilitas supplier.
17. Periode analisis EOQ harus selalu jelas.
18. Jangan menyebut demand sebagai demand tahunan apabila data yang digunakan bukan demand tahunan.
19. Semua formula harus memiliki definisi parameter dan satuan yang jelas.
20. Perubahan struktur database/API yang signifikan harus dibahas sebelum implementasi.

---

# 37. Academic/Research Considerations

Karena sistem digunakan untuk portfolio sekaligus penelitian/akademik, sistem harus mampu menunjukkan:

* sumber data demand;
* periode analisis;
* parameter EOQ;
* parameter ROP;
* safety stock;
* hasil perhitungan;
* supplier yang digunakan;
* kondisi stok;
* rekomendasi pengadaan;
* histori transaksi.

Hasil perhitungan harus dapat ditelusuri kembali ke data input.

Contoh:

```text
Demand periode:
60 unit

Ordering Cost:
Rp50.000

Holding Cost:
Rp5.000

EOQ:
34,64 ≈ 35 unit

Daily Usage:
2 unit/hari

Lead Time:
5 hari

Safety Stock:
5 unit

ROP:
15 unit

Current Stock:
10 unit

Status:
Perlu Pesan

Recommended Order:
35 unit
```

Dengan demikian, hasil sistem dapat dijelaskan secara akademik dan tidak menjadi sekadar dashboard CRUD.

---

# 38. Acceptance Criteria

Sistem dianggap memenuhi kebutuhan apabila:

### Master Data

* Admin dapat CRUD kategori.
* Admin dapat CRUD sparepart.
* Admin dapat CRUD supplier.
* Admin dapat menghubungkan sparepart dengan beberapa supplier.
* Admin dapat menentukan supplier utama.

### Inventory

* Stock In menambah stok.
* Stock Out mengurangi stok.
* Stock Out tidak boleh melebihi stok.
* Stock Opname dapat mencatat selisih.
* Perubahan stok dapat ditelusuri.

### EOQ

* Sistem mengambil demand dari Stock Out.
* Sistem dapat melakukan analisis mingguan.
* Sistem dapat melakukan analisis bulanan.
* Sistem menampilkan periode analisis.
* Sistem menghitung EOQ menggunakan formula yang ditentukan.
* Parameter perhitungan dapat ditelusuri.

### ROP

* Sistem menghitung daily usage berdasarkan hari kalender.
* Sistem menggunakan lead time supplier.
* Sistem mempertimbangkan safety stock.
* Sistem menghasilkan ROP.

### Recommendation

* Sistem mendeteksi current stock <= ROP.
* Sistem menghasilkan rekomendasi pengadaan.
* Sistem menentukan quantity rekomendasi berdasarkan EOQ.
* Supplier rekomendasi dapat diketahui.

### Purchase Order

* Admin dapat membuat PO.
* PO dapat memiliki beberapa item.
* PO memiliki status.
* Penerimaan sebagian dapat dicatat.
* Penerimaan PO menghasilkan Stock In.
* PO yang belum diterima tidak otomatis menambah stok.

---

# 39. Final Product Principle

Sistem harus berpusat pada alur:

```text
TRANSACTION DATA
       ↓
CURRENT INVENTORY
       ↓
HISTORICAL DEMAND
       ↓
EOQ
       ↓
DAILY USAGE
       ↓
SAFETY STOCK
       ↓
ROP
       ↓
STOCK STATUS
       ↓
PROCUREMENT RECOMMENDATION
       ↓
PURCHASE ORDER
       ↓
GOODS RECEIVED
       ↓
STOCK IN
       ↓
CURRENT INVENTORY
```

Siklus tersebut membentuk hubungan antara transaksi nyata dengan perhitungan EOQ/ROP sehingga sistem tidak hanya menjadi aplikasi CRUD, tetapi memiliki alur **inventory management + decision support** yang jelas.
