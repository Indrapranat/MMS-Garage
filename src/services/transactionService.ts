import { BarangMasuk, BarangKeluar } from "@/types/transaction";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

export const transactionService = {
  // --- BARANG MASUK ---
  async getAllBarangMasuk(): Promise<BarangMasuk[]> {
    await delay();
    return mockStore.getBarangMasuk();
  },

  async createBarangMasuk(data: Omit<BarangMasuk, "id" | "createdAt">): Promise<BarangMasuk> {
    await delay();
    return mockStore.addBarangMasuk(data);
  },

  // --- BARANG KELUAR ---
  async getAllBarangKeluar(): Promise<BarangKeluar[]> {
    await delay();
    return mockStore.getBarangKeluar();
  },

  async createBarangKeluar(data: Omit<BarangKeluar, "id" | "createdAt">): Promise<BarangKeluar> {
    await delay();
    return mockStore.addBarangKeluar(data);
  },
};
