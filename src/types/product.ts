export interface Kategori {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  jumlahItem: number;
  status: "Aktif" | "Non-Aktif";
  createdAt: string;
}

export interface Sparepart {
  id: string;
  kode: string;
  nama: string;
  kategoriId: string;
  kategoriNama: string;
  satuan: string; // Pcs, Botol, Set, Roll, Can, Box
  hargaBeli: number;
  hargaJual: number;
  stokFisik: number;
  stokMinimum: number;
  stokMaksimum: number;
  lokasiRak: string; // e.g. "Rak A-02", "Bin B-14"
  supplierId: string;
  supplierNama: string;
  status: "Aktif" | "Non-Aktif";
  createdAt: string;
  updatedAt: string;
}
