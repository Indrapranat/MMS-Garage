# MMS-Garage: Bengkel Ryan - Inventory Management System (EOQ & ROP)

Aplikasi frontend manajemen inventaris bengkel mobil & motor modern, desktop-first, dan komprehensif yang mengintegrasikan metode **Economic Order Quantity (EOQ)** dan **Reorder Point (ROP)** untuk pengendalian persediaan suku cadang secara optimal.

---

## 🚀 Fitur & Modul Utama

1. **Dashboard Eksekutif**:
   - Ringkasan KPI: Total Sparepart, Total Stok Fisik, Stok di Bawah ROP, dan Rekomendasi Pengadaan.
   - Grafik interaktif Recharts: Tren volume penerimaan vs pengeluaran servis serta visualisasi perbandingan stok terhadap batas ROP.
   - Widget peringatan suku cadang mendesak yang memerlukan pemesanan segera.
2. **Data Master Sparepart**:
   - Katalog suku cadang lengkap dengan harga beli, harga jual, lokasi rak penyimpanan, supplier utama, dan level stok minimum buffer.
   - Pencarian real-time, filter kategori, filter status, dan pagination.
3. **Kategori Sparepart**:
   - Pengelompokan klasifikasi suku cadang bengkel dengan penghitungan otomatis jumlah item aktif.
4. **Data Supplier**:
   - Direktori distributor/supplier resmi, kontak PIC, alamat, serta parameter **Lead Time Pengiriman (Hari)**.
5. **Barang Masuk (Penerimaan)**:
   - Pencatatan surat jalan / Delivery Order (DO) pengiriman dari distributor.
   - Otomatis menambah stok fisik suku cadang secara real-time.
6. **Barang Keluar (Servis Kendaraan)**:
   - Pencatatan pemakaian suku cadang berdasarkan nomor plat kendaraan, Surat Perintah Kerja (SPK), dan mekanik penanggung jawab.
   - Otomatis mengurangi stok fisik dengan validasi ketersediaan barang.
7. **Stok & Stock Opname**:
   - Monitoring level persediaan (Aman, Menipis $\le$ ROP, Kritis/Habis) dan valuasi total nilai aset.
   - Fitur Stock Opname untuk koreksi fisik aktual gudang beserta pencatatan alasan selisih dan riwayat audit.
8. **Analisis EOQ & ROP**:
   - Matriks tabel 11 kolom: Kode, Nama Sparepart, Demand ($D$), Biaya Pemesanan ($S$), Biaya Penyimpanan ($H$), Lead Time ($L$), Rata-rata/Hari ($d$), EOQ, ROP, Stok Saat Ini, dan Status.
   - Menampilkan hasil kalkulasi server tanpa perhitungan rumus di frontend.
9. **Rekomendasi Pengadaan**:
   - Filter otomatis suku cadang dengan kondisi $\text{Stok} \le \text{ROP}$.
   - Rekomendasi kuantitas pemesanan ekonomis (Pesan = EOQ), modal kalkulasi anggaran, dan aksi penerbitan draft Purchase Order (PO).
10. **Pelaporan**:
    - Laporan Stok & Valuasi, Laporan Barang Masuk, Laporan Barang Keluar, dan Laporan Analisis EOQ/ROP.
    - Dilengkapi fitur **Print/Cetak Laporan** dan **Export CSV/Excel**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Architecture**: Decoupled Frontend dengan API Service Layer (`src/services/`), siap dihubungkan ke backend Laravel 13 Sanctum REST API.

---

## 💻 Panduan Menjalankan

### 1. Instalasi Dependensi
```bash
pnpm install
# atau
npm install
```

### 2. Menjalankan Server Pengembangan
```bash
pnpm dev
# atau
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 3. Build Produksi
```bash
pnpm build
pnpm start
```
