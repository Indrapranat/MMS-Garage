import { Supplier } from "@/types/supplier";
import { mockStore } from "@/mock/mockStore";
import { API_CONFIG, delay } from "./api";

export const supplierService = {
  async getAllSuppliers(): Promise<Supplier[]> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/suppliers`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((item: any) => ({
            id: String(item.id),
            kode: item.code,
            nama: item.name,
            kontakPerson: item.contact_person || "-",
            telepon: item.phone || "-",
            email: "distributor@example.com",
            alamat: item.address || "-",
            kota: "Jakarta",
            leadTimeHari: 3,
            status: item.is_active ? "Aktif" : "Non-Aktif",
            createdAt: item.created_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn("Gagal fetch /suppliers dari API, fallback ke mockStore:", err);
      }
    }

    await delay();
    return mockStore.getSuppliers();
  },

  async createSupplier(data: Omit<Supplier, "id" | "createdAt">): Promise<Supplier> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const payload = {
          code: data.kode,
          name: data.nama,
          contact_person: data.kontakPerson,
          phone: data.telepon,
          address: data.alamat,
          is_active: data.status === "Aktif",
        };

        const response = await fetch(`${API_CONFIG.BASE_URL}/suppliers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const resJson = await response.json();
          const item = resJson.data;
          return {
            id: String(item.id),
            kode: item.code,
            nama: item.name,
            kontakPerson: item.contact_person || "-",
            telepon: item.phone || "-",
            email: data.email,
            alamat: item.address || "-",
            kota: data.kota || "-",
            leadTimeHari: data.leadTimeHari || 3,
            status: item.is_active ? "Aktif" : "Non-Aktif",
            createdAt: item.created_at || new Date().toISOString(),
          };
        } else {
          const errJson = await response.json();
          throw new Error(errJson.message || "Gagal menambahkan supplier ke backend");
        }
      } catch (err: any) {
        console.warn("Gagal createSupplier via API:", err);
        throw err;
      }
    }

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

