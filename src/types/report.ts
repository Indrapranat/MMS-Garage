export interface DashboardSummary {
  totalSparepart: number;
  totalStok: number;
  barangDiBawahRop: number;
  jumlahRekomendasiPengadaan: number;
  totalNilaiPersediaan: number;
  totalBarangMasukBulanIni: number;
  totalBarangKeluarBulanIni: number;
}

export interface MonthlyUsageChart {
  bulan: string;
  totalPengeluaranUnit: number;
  totalMasukUnit: number;
  nilaiPemakaianRp: number;
}

export interface CategoryStockChart {
  kategori: string;
  totalUnit: number;
  nilaiAsetRp: number;
}

export interface StockVsRopChart {
  nama: string;
  stokSaatIni: number;
  rop: number;
  eoq: number;
}
