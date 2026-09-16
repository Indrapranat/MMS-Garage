export interface EoqRopAnalysis {
  id: string;
  kode: string;
  namaSparepart: string;
  kategori: string;
  demand: number; // Kebutuhan tahunan / periode (D)
  biayaPemesanan: number; // Biaya setiap kali pesan / S (Rp)
  biayaPenyimpanan: number; // Biaya simpan per unit per tahun / H (Rp)
  leadTime: number; // Waktu tunggu pemesanan dalam hari (L)
  rataRataPenggunaanHari: number; // Penggunaan harian rata-rata (d)
  eoq: number; // Economic Order Quantity unit optimum
  rop: number; // Reorder Point unit titik pemesanan ulang
  stokSaatIni: number; // Stok fisik saat ini
  safetyStock: number; // Stok cadangan pengaman
  supplierNama: string;
  supplierLeadTime: number;
  status: "Stok Aman" | "Perlu Pemesanan" | "Kritis";
  rekomendasiPesanQty: number; // Biasanya sama dengan EOQ jika stok <= ROP
  estimasiBiayaPengadaan: number; // eoq * hargaBeli
  updatedAt: string;
}

export interface RecommendationItem {
  id: string;
  sparepartId: string;
  kode: string;
  namaSparepart: string;
  kategori: string;
  stokSaatIni: number;
  rop: number;
  eoq: number;
  status: "Perlu Pemesanan" | "Kritis";
  jumlahRekomendasiPemesanan: number; // EOQ
  supplierId: string;
  supplierNama: string;
  supplierTelepon: string;
  leadTimeHari: number;
  hargaBeliSatuan: number;
  estimasiTotalBiaya: number;
  catatanKebutuhan: string;
  terakhirDipesan?: string;
}
