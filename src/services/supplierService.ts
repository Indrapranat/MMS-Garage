import { Supplier } from "@/types/supplier";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
    await delay();
    return mockStore.getSuppliers();
  },

  async createSupplier(data: Omit<Supplier, "id" | "createdAt">): Promise<Supplier> {
    await delay();
    return mockStore.addSupplier(data);
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier | null> {
    await delay();
    return mockStore.updateSupplier(id, data);
  },

  async deleteSupplier(id: string): Promise<boolean> {
    await delay();
    return mockStore.deleteSupplier(id);
  },
};
