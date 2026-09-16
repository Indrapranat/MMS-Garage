import { StockItem, StockAdjustment } from "@/types/inventory";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

export const inventoryService = {
  async getStockOverview(): Promise<StockItem[]> {
    await delay();
    const products = mockStore.getProducts();
    const eoqData = mockStore.getEoqRopData();

    return products.map((p) => {
      const eoqInfo = eoqData.find((e) => e.kode === p.kode);
      const ropVal = eoqInfo?.rop ?? p.stokMinimum;
      const isCritical = p.stokFisik <= Math.round(ropVal / 2) || p.stokFisik === 0;
      const isLow = p.stokFisik <= ropVal;

      let statusStok: "Aman" | "Menipis" | "Kritis / Habis" = "Aman";
      if (isCritical) {
        statusStok = "Kritis / Habis";
      } else if (isLow) {
        statusStok = "Menipis";
      }

      return {
        id: p.id,
        kode: p.kode,
        nama: p.nama,
        kategoriNama: p.kategoriNama,
        satuan: p.satuan,
        stokFisik: p.stokFisik,
        stokMinimum: p.stokMinimum,
        stokMaksimum: p.stokMaksimum,
        lokasiRak: p.lokasiRak,
        hargaBeli: p.hargaBeli,
        totalNilaiAset: p.stokFisik * p.hargaBeli,
        statusStok,
        rop: ropVal,
      };
    });
  },

  async getAdjustments(): Promise<StockAdjustment[]> {
    await delay();
    return mockStore.getAdjustments();
  },

  async createAdjustment(data: Omit<StockAdjustment, "id" | "createdAt">): Promise<StockAdjustment> {
    await delay();
    return mockStore.addAdjustment(data);
  },
};
