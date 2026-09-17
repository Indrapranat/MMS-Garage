import { Sparepart, Kategori } from "@/types/product";
import { mockStore } from "@/mock/mockStore";
import { API_CONFIG, delay } from "./api";

export const productService = {
  // --- SPAREPART ---
  async getAllSpareparts(): Promise<Sparepart[]> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/spareparts`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((item: any) => {
            const primarySup = item.primary_supplier;
            const price = primarySup ? Number(primarySup.purchase_price) : 0;

            return {
              id: String(item.id),
              kode: item.code,
              nama: item.name,
              kategoriId: String(item.category_id),
              kategoriNama: item.category?.name || "Umum",
              satuan: item.unit || "pcs",
              stokFisik: item.current_stock || 0,
              stokMinimum: item.safety_stock || item.rop_threshold || 5,
              stokMaksimum: 100,
              lokasiRak: "Rak " + (item.category?.name ? item.category.name.substring(0, 3).toUpperCase() : "GEN"),
              hargaBeli: price,
              hargaJual: Math.round(price * 1.25) || price,
              supplierId: String(primarySup?.supplier_id || "1"),
              supplierNama: primarySup?.supplier?.name || "Distributor Resmi",
              status: item.is_active !== false ? "Aktif" : "Non-Aktif",
              createdAt: item.created_at || new Date().toISOString(),
              updatedAt: item.updated_at || new Date().toISOString(),
            };
          });
        }
      } catch (err) {
        console.warn("Gagal fetch /spareparts dari backend, fallback ke mockStore:", err);
      }
    }

    await delay();
    return mockStore.getProducts();
  },

  async getSparepartById(id: string): Promise<Sparepart | null> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/spareparts/${id}`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const item = resJson.data;
          const primarySup = item.primary_supplier;
          const price = primarySup ? Number(primarySup.purchase_price) : 0;
          return {
            id: String(item.id),
            kode: item.code,
            nama: item.name,
            kategoriId: String(item.category_id),
            kategoriNama: item.category?.name || "Umum",
            satuan: item.unit || "pcs",
            stokFisik: item.current_stock || 0,
            stokMinimum: item.safety_stock || item.rop_threshold || 5,
            stokMaksimum: 100,
            lokasiRak: "Rak " + (item.category?.name ? item.category.name.substring(0, 3).toUpperCase() : "GEN"),
            hargaBeli: price,
            hargaJual: Math.round(price * 1.25) || price,
            supplierId: String(primarySup?.supplier_id || "1"),
            supplierNama: primarySup?.supplier?.name || "Distributor Resmi",
            status: item.is_active !== false ? "Aktif" : "Non-Aktif",
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn(`Gagal fetch /spareparts/${id}:`, err);
      }
    }

    await delay();
    const item = mockStore.getProductById(id);
    return item || null;
  },

  async createSparepart(data: Omit<Sparepart, "id" | "createdAt" | "updatedAt">): Promise<Sparepart> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const payload = {
          code: data.kode,
          name: data.nama,
          category_id: Number(data.kategoriId),
          unit: data.satuan || "pcs",
          current_stock: data.stokFisik || 0,
          holding_cost: 2000,
          safety_stock: data.stokMinimum || 5,
          supplier_id: data.supplierId ? Number(data.supplierId) : null,
          purchase_price: data.hargaBeli || 0,
          ordering_cost: 25000,
          lead_time: 3,
        };

        const response = await fetch(`${API_CONFIG.BASE_URL}/spareparts`, {
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
            kategoriId: String(item.category_id),
            kategoriNama: item.category?.name || "Umum",
            satuan: item.unit,
            stokFisik: item.current_stock,
            stokMinimum: item.safety_stock,
            stokMaksimum: 100,
            lokasiRak: "Rak GEN",
            hargaBeli: data.hargaBeli,
            hargaJual: data.hargaJual,
            supplierId: data.supplierId,
            supplierNama: data.supplierNama,
            status: "Aktif",
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          };
        } else {
          const errJson = await response.json();
          throw new Error(errJson.message || "Gagal menambahkan sparepart ke backend");
        }
      } catch (err: any) {
        console.warn("Gagal createSparepart via API:", err);
        throw err;
      }
    }

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
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/categories`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((c: any) => ({
            id: String(c.id),
            kode: `KAT-${String(c.id).padStart(3, "0")}`,
            nama: c.name,
            deskripsi: c.description || "",
            jumlahItem: c.spareparts_count || 0,
            status: "Aktif",
            createdAt: c.created_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn("Gagal fetch /categories dari backend, fallback ke mockStore:", err);
      }
    }

    await delay();
    return mockStore.getCategories();
  },

  async createCategory(data: Omit<Kategori, "id" | "jumlahItem" | "createdAt">): Promise<Kategori> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ name: data.nama, description: data.deskripsi }),
        });
        if (response.ok) {
          const resJson = await response.json();
          const c = resJson.data;
          return {
            id: String(c.id),
            kode: `KAT-${String(c.id).padStart(3, "0")}`,
            nama: c.name,
            deskripsi: c.description || "",
            jumlahItem: 0,
            status: "Aktif",
            createdAt: c.created_at,
          };
        }
      } catch (err) {
        console.warn("Gagal createCategory via API:", err);
      }
    }

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
