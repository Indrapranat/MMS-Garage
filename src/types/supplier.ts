export interface Supplier {
  id: string;
  kode: string;
  nama: string;
  kontakPerson: string;
  telepon: string;
  email: string;
  alamat: string;
  kota: string;
  leadTimeHari: number; // Rata-rata waktu pengiriman barang (hari)
  status: "Aktif" | "Non-Aktif";
  createdAt: string;
}
