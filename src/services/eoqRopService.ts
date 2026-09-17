import { EoqRopAnalysis } from "@/types/eoqRop";
import { mockStore } from "@/mock/mockStore";
import { API_CONFIG, delay } from "./api";

export const eoqRopService = {
  async getEoqRopAnalysis(): Promise<EoqRopAnalysis[]> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/eoq-rop?days=30`, {
          headers: {
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const resJson = await response.json();
          const items = resJson.data || [];
          return items.map((item: any) => {
            let statusLabel: "Stok Aman" | "Perlu Pemesanan" | "Kritis" = "Stok Aman";
            if (item.output.stock_status === "STOK HABIS") {
              statusLabel = "Kritis";
            } else if (item.output.stock_status === "PERLU PESAN") {
              statusLabel = "Perlu Pemesanan";
            }

            return {
              id: String(item.sparepart.id),
              kode: item.sparepart.code,
              namaSparepart: item.sparepart.name,
              kategori: item.sparepart.category,
              demand: item.input.demand,
              biayaPemesanan: item.input.ordering_cost,
              biayaPenyimpanan: item.input.holding_cost,
              leadTime: item.input.lead_time,
              rataRataPenggunaanHari: item.input.average_daily_usage,
              eoq: item.process.eoq_rounded,
              rop: item.process.rop_rounded,
              stokSaatIni: item.input.current_stock,
              safetyStock: item.input.safety_stock,
              supplierNama: item.supplier?.name || "Belum Ditentukan",
              supplierLeadTime: item.input.lead_time,
              status: statusLabel,
              rekomendasiPesanQty: item.output.recommended_order_quantity,
              estimasiBiayaPengadaan: item.output.estimated_procurement_cost,
              updatedAt: new Date().toISOString(),
              eoqSteps: item.process.eoq_steps,
              ropSteps: item.process.rop_steps,
              eoqFormula: item.process.eoq_formula,
              ropFormula: item.process.rop_formula,
              recommendationNote: item.output.recommendation_note,
              statusCode: item.output.status_code,
            };
          });
        }
      } catch (err) {
        console.warn("Koneksi API /eoq-rop gagal, fallback ke data lokal:", err);
      }
    }

    await delay();
    return mockStore.getEoqRopData();
  },

  async getEoqRopDetail(id: number | string): Promise<any> {
    if (!API_CONFIG.USE_MOCK) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/eoq-rop/${id}?days=30`, {
          headers: {
            "Accept": "application/json",
          },
        });
        if (response.ok) {
          const resJson = await response.json();
          return resJson.data;
        }
      } catch (err) {
        console.warn(`Gagal memuat detail EOQ-ROP id ${id}:`, err);
      }
    }
    return null;
  }
};
