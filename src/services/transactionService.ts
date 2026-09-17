import { BarangMasuk, BarangKeluar } from "@/types/transaction";
import { mockStore } from "@/mock/mockStore";
import { API_CONFIG, delay } from "./api";

export const transactionService = {
  // --- BARANG MASUK (STOCK IN) ---
  async getAllBarangMasuk(): Promise<BarangMasuk[]> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/stock-ins?per_page=100`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((item: any) => {
            const notes = item.notes || "";
            let suratJalan = `SJ/${item.id}`;
            let penerima = item.user?.name || "Petugas Bengkel";
            
            if (notes.includes("SJ:")) {
              const matchSJ = notes.match(/SJ:\s*([^|]+)/);
              if (matchSJ) suratJalan = matchSJ[1].trim();
            }
            if (notes.includes("Penerima:")) {
              const matchPenerima = notes.match(/Penerima:\s*([^|]+)/);
              if (matchPenerima) penerima = matchPenerima[1].trim();
            }

            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;

            return {
              id: String(item.id),
              noReferensi: item.transaction_number || `BM-${item.id}`,
              noSuratJalan: suratJalan,
              tanggal: item.transaction_date ? String(item.transaction_date).substring(0, 10) : new Date().toISOString().split("T")[0],
              supplierId: String(item.supplier_id || ""),
              supplierNama: item.supplier?.name || "Distributor Umum",
              sparepartId: String(item.sparepart_id),
              sparepartKode: item.sparepart?.code || `SP-${item.sparepart_id}`,
              sparepartNama: item.sparepart?.name || "Sparepart",
              jumlah: qty,
              hargaBeliSatuan: price,
              totalBiaya: qty * price,
              penerima: penerima,
              catatan: item.notes || "",
              status: "Selesai",
              createdAt: item.created_at || new Date().toISOString(),
            };
          });
        }
      } catch (err) {
        console.warn("Gagal fetch /stock-ins dari API, fallback ke mockStore:", err);
      }
    }

    await delay();
    return mockStore.getBarangMasuk();
  },

  async createBarangMasuk(data: Omit<BarangMasuk, "id" | "createdAt">): Promise<BarangMasuk> {
    if (!API_CONFIG.USE_MOCK) {
      const payload = {
        sparepart_id: Number(data.sparepartId),
        supplier_id: data.supplierId ? Number(data.supplierId) : null,
        quantity: Number(data.jumlah),
        unit_price: Number(data.hargaBeliSatuan),
        source_type: "PURCHASE",
        transaction_date: data.tanggal,
        notes: `Ref: ${data.noReferensi} | SJ: ${data.noSuratJalan} | Penerima: ${data.penerima}${data.catatan ? ` | ${data.catatan}` : ""}`,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/stock-ins`, {
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
          noReferensi: item.transaction_number || data.noReferensi,
          noSuratJalan: data.noSuratJalan,
          tanggal: item.transaction_date ? String(item.transaction_date).substring(0, 10) : data.tanggal,
          supplierId: data.supplierId,
          supplierNama: item.supplier?.name || data.supplierNama,
          sparepartId: data.sparepartId,
          sparepartKode: item.sparepart?.code || data.sparepartKode,
          sparepartNama: item.sparepart?.name || data.sparepartNama,
          jumlah: Number(item.quantity),
          hargaBeliSatuan: Number(item.unit_price),
          totalBiaya: Number(item.quantity) * Number(item.unit_price),
          penerima: data.penerima,
          catatan: item.notes || data.catatan,
          status: "Selesai",
          createdAt: item.created_at || new Date().toISOString(),
        };
      } else {
        const errJson = await response.json();
        let errMsg = errJson.message || "Gagal mencatat barang masuk ke backend";
        if (errJson.errors && typeof errJson.errors === "object") {
          const firstField = Object.keys(errJson.errors)[0];
          if (errJson.errors[firstField]?.[0]) {
            errMsg = errJson.errors[firstField][0];
          }
        }
        throw new Error(errMsg);
      }
    }

    await delay();
    return mockStore.addBarangMasuk(data);
  },

  // --- BARANG KELUAR (STOCK OUT) ---
  async getAllBarangKeluar(): Promise<BarangKeluar[]> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/stock-outs?per_page=100`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((item: any) => {
            const ref = item.reference_number || "";
            const notes = item.notes || "";
            let noPolisi = "B 1234 XYZ";
            let noSPK = `SPK-${item.id}`;
            let mekanik = "Mekanik Bengkel";
            let keperluan = notes || "Servis Berkala";

            if (ref.includes("|")) {
              const parts = ref.split("|");
              noPolisi = parts[0]?.trim() || noPolisi;
              noSPK = parts[1]?.trim() || noSPK;
            } else if (ref) {
              noPolisi = ref;
            }

            if (notes.includes("Mekanik:")) {
              const matchMekanik = notes.match(/Mekanik:\s*([^|]+)/);
              if (matchMekanik) mekanik = matchMekanik[1].trim();
            }

            return {
              id: String(item.id),
              noTransaksi: item.transaction_number || `BK-${item.id}`,
              noPolisi: noPolisi,
              noSPK: noSPK,
              tanggal: item.transaction_date ? String(item.transaction_date).substring(0, 10) : new Date().toISOString().split("T")[0],
              sparepartId: String(item.sparepart_id),
              sparepartKode: item.sparepart?.code || `SP-${item.sparepart_id}`,
              sparepartNama: item.sparepart?.name || "Sparepart",
              jumlah: Number(item.quantity) || 0,
              mekanik: mekanik,
              keperluan: keperluan,
              pencatat: item.user?.name || "Service Advisor",
              status: "Selesai",
              createdAt: item.created_at || new Date().toISOString(),
            };
          });
        }
      } catch (err) {
        console.warn("Gagal fetch /stock-outs dari API, fallback ke mockStore:", err);
      }
    }

    await delay();
    return mockStore.getBarangKeluar();
  },

  async createBarangKeluar(data: Omit<BarangKeluar, "id" | "createdAt">): Promise<BarangKeluar> {
    if (!API_CONFIG.USE_MOCK) {
      const payload = {
        sparepart_id: Number(data.sparepartId),
        quantity: Number(data.jumlah),
        usage_type: "service",
        reference_number: `${data.noPolisi} | ${data.noSPK}`,
        transaction_date: data.tanggal,
        notes: `Mekanik: ${data.mekanik} | ${data.keperluan} | Pencatat: ${data.pencatat}`,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/stock-outs`, {
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
          noTransaksi: item.transaction_number || data.noTransaksi,
          noPolisi: data.noPolisi,
          noSPK: data.noSPK,
          tanggal: item.transaction_date ? String(item.transaction_date).substring(0, 10) : data.tanggal,
          sparepartId: data.sparepartId,
          sparepartKode: item.sparepart?.code || data.sparepartKode,
          sparepartNama: item.sparepart?.name || data.sparepartNama,
          jumlah: Number(item.quantity),
          mekanik: data.mekanik,
          keperluan: data.keperluan,
          pencatat: data.pencatat,
          status: "Selesai",
          createdAt: item.created_at || new Date().toISOString(),
        };
      } else {
        const errJson = await response.json();
        let errMsg = errJson.message || "Gagal mencatat barang keluar ke backend";
        if (errJson.errors && typeof errJson.errors === "object") {
          const firstField = Object.keys(errJson.errors)[0];
          if (errJson.errors[firstField]?.[0]) {
            errMsg = errJson.errors[firstField][0];
          }
        }
        throw new Error(errMsg);
      }
    }

    await delay();
    return mockStore.addBarangKeluar(data);
  },
};

