import { DashboardSummary, MonthlyUsageChart, CategoryStockChart, StockVsRopChart } from "@/types/report";
import { mockStore } from "@/mock/mockStore";
import { API_CONFIG, delay } from "./api";

export const reportService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/dashboard`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const sum = resJson.summary || resJson.data?.summary;
          if (sum) {
            const underRop = (sum.out_of_stock || 0) + (sum.low_stock || 0);
            return {
              totalSparepart: sum.total_spareparts || 0,
              totalStok: sum.total_stock || 0,
              barangDiBawahRop: underRop,
              jumlahRekomendasiPengadaan: underRop,
              totalNilaiPersediaan: sum.total_inventory_value || 0,
              totalBarangMasukBulanIni: sum.stock_in_transactions || 0,
              totalBarangKeluarBulanIni: sum.stock_out_transactions || 0,
            };
          }
        }
      } catch (err) {
        console.warn("Gagal fetch /dashboard dari backend, fallback ke mockStore:", err);
      }
    }

    await delay();
    const products = mockStore.getProducts();
    const eoqData = mockStore.getEoqRopData();
    const bm = mockStore.getBarangMasuk();
    const bk = mockStore.getBarangKeluar();

    const totalSparepart = products.length;
    const totalStok = products.reduce((acc, p) => acc + p.stokFisik, 0);
    const totalNilaiPersediaan = products.reduce((acc, p) => acc + p.stokFisik * p.hargaBeli, 0);

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
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/eoq-rop?days=30`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((item: any) => ({
            nama: item.sparepart.name.length > 18 ? item.sparepart.name.substring(0, 15) + "..." : item.sparepart.name,
            stokSaatIni: item.input.current_stock,
            rop: item.process.rop_rounded,
            eoq: item.process.eoq_rounded,
          }));
        }
      } catch (err) {
        console.warn("Gagal fetch getStockVsRopChart dari API:", err);
      }
    }

    await delay();
    const eoqData = mockStore.getEoqRopData();
    return eoqData.slice(0, 7).map((item) => ({
      nama: item.namaSparepart.length > 18 ? item.namaSparepart.substring(0, 15) + "..." : item.namaSparepart,
      stokSaatIni: item.stokSaatIni,
      rop: item.rop,
      eoq: item.eoq,
    }));
  },
};
