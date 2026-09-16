export interface StockItem {
  id: string;
  kode: string;
  nama: string;
  kategoriNama: string;
  satuan: string;
  stokFisik: number;
  stokMinimum: number; // buffer/safety
  stokMaksimum: number;
  lokasiRak: string;
  hargaBeli: number;
  totalNilaiAset: number; // stokFisik * hargaBeli
  statusStok: "Aman" | "Menipis" | "Kritis / Habis";
  rop: number; // from calculation / reference
}

export interface StockAdjustment {
  id: string;
  tanggal: string;
  sparepartId: string;
  sparepartKode: string;
  sparepartNama: string;
  stokSebelum: number;
  stokFisikAktual: number;
  selisih: number; // aktual - sebelum
  tipePenyesuaian: "Koreksi Fisik" | "Barang Rusak" | "Barang Hilang" | "Lainnya";
  alasan: string;
  petugas: string;
  createdAt: string;
}
