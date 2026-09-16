import { DashboardSummary, MonthlyUsageChart, CategoryStockChart, StockVsRopChart } from "@/types/report";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

export const reportService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    await delay();
    const products = mockStore.getProducts();
    const eoqData = mockStore.getEoqRopData();
    const bm = mockStore.getBarangMasuk();
    const bk = mockStore.getBarangKeluar();

    const totalSparepart = products.length;
    const totalStok = products.reduce((acc, p) => acc + p.stokFisik, 0);
    const totalNilaiPersediaan = products.reduce((acc, p) => acc + p.stokFisik * p.hargaBeli, 0);

    // Barang di bawah ROP dari data EOQ
    const underRopItems = eoqData.filter((item) => item.stokSaatIni <= item.rop);
    const barangDiBawahRop = underRopItems.length;
    const jumlahRekomendasiPengadaan = underRopItems.length;

    const totalBarangMasukBulanIni = bm.reduce((acc, item) => acc + item.jumlah, 0);
    const totalBarangKeluarBulanIni = bk.reduce((acc, item) => acc + item.jumlah, 0);

    return {
      totalSparepart,
      totalStok,
      barangDiBawahRop,
      jumlahRekomendasiPengadaan,
      totalNilaiPersediaan,
      totalBarangMasukBulanIni,
      totalBarangKeluarBulanIni,
    };
  },

  async getMonthlyUsageChart(): Promise<MonthlyUsageChart[]> {
    await delay();
    return [
      { bulan: "Apr 2026", totalPengeluaranUnit: 142, totalMasukUnit: 160, nilaiPemakaianRp: 18450000 },
      { bulan: "Mei 2026", totalPengeluaranUnit: 168, totalMasukUnit: 190, nilaiPemakaianRp: 22100000 },
      { bulan: "Jun 2026", totalPengeluaranUnit: 185, totalMasukUnit: 175, nilaiPemakaianRp: 25400000 },
      { bulan: "Jul 2026", totalPengeluaranUnit: 154, totalMasukUnit: 160, nilaiPemakaianRp: 20150000 },
      { bulan: "Agu 2026", totalPengeluaranUnit: 210, totalMasukUnit: 240, nilaiPemakaianRp: 28900000 },
      { bulan: "Sep 2026", totalPengeluaranUnit: 195, totalMasukUnit: 200, nilaiPemakaianRp: 26350000 },
    ];
  },

  async getCategoryStockChart(): Promise<CategoryStockChart[]> {
    await delay();
    const products = mockStore.getProducts();
    const categories = mockStore.getCategories();

    return categories.map((c) => {
      const items = products.filter((p) => p.kategoriId === c.id);
      const totalUnit = items.reduce((acc, item) => acc + item.stokFisik, 0);
      const nilaiAsetRp = items.reduce((acc, item) => acc + item.stokFisik * item.hargaBeli, 0);
      return {
        kategori: c.nama,
        totalUnit,
        nilaiAsetRp,
      };
    });
  },

  async getStockVsRopChart(): Promise<StockVsRopChart[]> {
    await delay();
    const eoqData = mockStore.getEoqRopData();
    // Ambil 8 sparepart terpilih untuk perbandingan visual
    return eoqData.slice(0, 8).map((item) => ({
      nama: item.namaSparepart.split(" (")[0], // Sederhanakan nama untuk label grafik
      stokSaatIni: item.stokSaatIni,
      rop: item.rop,
      eoq: item.eoq,
    }));
  },
};
