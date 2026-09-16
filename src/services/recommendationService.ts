import { RecommendationItem } from "@/types/eoqRop";
import { mockStore } from "@/mock/mockStore";
import { delay } from "./api";

export const recommendationService = {
  // Mengambil daftar pengadaan yang disarankan dari data mock (stok <= ROP)
  async getProcurementRecommendations(): Promise<RecommendationItem[]> {
    await delay();
    return mockStore.getRecommendations();
  },
};
