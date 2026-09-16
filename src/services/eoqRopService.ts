import { EoqRopAnalysis } from "@/types/eoqRop";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

// CATATAN ARSITEKTUR: Service ini mengembalikan data analisis EOQ & ROP yang sudah dikalkulasi
// di backend (atau data mock saat ini). Tidak ada kalkulasi rumus EOQ atau ROP di frontend.
export const eoqRopService = {
  async getEoqRopAnalysis(): Promise<EoqRopAnalysis[]> {
    await delay();
    return mockStore.getEoqRopData();
  },
};
