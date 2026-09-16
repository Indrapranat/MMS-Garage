import { Sparepart, Kategori } from "@/types/product";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

export const productService = {
  // --- SPAREPART ---
  async getAllSpareparts(): Promise<Sparepart[]> {
    await delay();
    return mockStore.getProducts();
  },

  async getSparepartById(id: string): Promise<Sparepart | null> {
    await delay();
    const item = mockStore.getProductById(id);
    return item || null;
  },

  async createSparepart(data: Omit<Sparepart, "id" | "createdAt" | "updatedAt">): Promise<Sparepart> {
    await delay();
    return mockStore.addProduct(data);
  },

  async updateSparepart(id: string, data: Partial<Sparepart>): Promise<Sparepart | null> {
    await delay();
    return mockStore.updateProduct(id, data);
  },

  async deleteSparepart(id: string): Promise<boolean> {
    await delay();
    return mockStore.deleteProduct(id);
  },

  // --- KATEGORI ---
  async getAllCategories(): Promise<Kategori[]> {
    await delay();
    return mockStore.getCategories();
  },

  async createCategory(data: Omit<Kategori, "id" | "jumlahItem" | "createdAt">): Promise<Kategori> {
    await delay();
    return mockStore.addCategory(data);
  },

  async updateCategory(id: string, data: Partial<Kategori>): Promise<Kategori | null> {
    await delay();
    return mockStore.updateCategory(id, data);
  },

  async deleteCategory(id: string): Promise<boolean> {
    await delay();
    return mockStore.deleteCategory(id);
  },
};
