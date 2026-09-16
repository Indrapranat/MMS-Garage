export interface BarangMasuk {
  id: string;
  noReferensi: string; // e.g. "BM-202609-001"
  noSuratJalan: string;
  tanggal: string;
  supplierId: string;
  supplierNama: string;
  sparepartId: string;
  sparepartKode: string;
  sparepartNama: string;
  jumlah: number;
  hargaBeliSatuan: number;
  totalBiaya: number;
  penerima: string; // Petugas gudang
  catatan?: string;
  status: "Selesai" | "Pending" | "Dibatalkan";
  createdAt: string;
}

export interface BarangKeluar {
  id: string;
  noTransaksi: string; // e.g. "BK-202609-001"
  noPolisi: string; // Kendaraan pelanggan e.g. "B 1234 ABC"
  noSPK: string; // Surat Perintah Kerja bengkel e.g. "SPK-0429"
  tanggal: string;
  sparepartId: string;
  sparepartKode: string;
  sparepartNama: string;
  jumlah: number;
  mekanik: string;
  keperluan: string; // e.g. "Servis Berkala 20.000 KM", "Ganti Kampas Rem"
  pencatat: string;
  status: "Selesai" | "Dibatalkan";
  createdAt: string;
}
