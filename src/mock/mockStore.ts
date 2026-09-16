import { Sparepart, Kategori } from "@/types/product";
import { Supplier } from "@/types/supplier";
import { BarangMasuk, BarangKeluar } from "@/types/transaction";
import { EoqRopAnalysis, RecommendationItem } from "@/types/eoqRop";
import { StockAdjustment } from "@/types/inventory";
import { initialCategories } from "./categories";
import { initialSuppliers } from "./suppliers";
import { initialProducts } from "./products";
import { initialBarangMasuk, initialBarangKeluar } from "./transactions";
import { initialEoqRopData, getInitialRecommendations } from "./eoqRopData";

const STORAGE_KEYS = {
  PRODUCTS: "bengkel_ryan_products",
  CATEGORIES: "bengkel_ryan_categories",
  SUPPLIERS: "bengkel_ryan_suppliers",
  BARANG_MASUK: "bengkel_ryan_barang_masuk",
  BARANG_KELUAR: "bengkel_ryan_barang_keluar",
  EOQ_ROP: "bengkel_ryan_eoq_rop",
  ADJUSTMENTS: "bengkel_ryan_adjustments",
};

class MockStore {
  private products: Sparepart[] = initialProducts;
  private categories: Kategori[] = initialCategories;
  private suppliers: Supplier[] = initialSuppliers;
  private barangMasuk: BarangMasuk[] = initialBarangMasuk;
  private barangKeluar: BarangKeluar[] = initialBarangKeluar;
  private eoqRopData: EoqRopAnalysis[] = initialEoqRopData;
  private adjustments: StockAdjustment[] = [];
  private isInitialized = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (p) this.products = JSON.parse(p);

      const c = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (c) this.categories = JSON.parse(c);

      const s = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      if (s) this.suppliers = JSON.parse(s);

      const bm = localStorage.getItem(STORAGE_KEYS.BARANG_MASUK);
      if (bm) this.barangMasuk = JSON.parse(bm);

      const bk = localStorage.getItem(STORAGE_KEYS.BARANG_KELUAR);
      if (bk) this.barangKeluar = JSON.parse(bk);

      const er = localStorage.getItem(STORAGE_KEYS.EOQ_ROP);
      if (er) this.eoqRopData = JSON.parse(er);

      const adj = localStorage.getItem(STORAGE_KEYS.ADJUSTMENTS);
      if (adj) this.adjustments = JSON.parse(adj);

      this.isInitialized = true;
    } catch (e) {
      console.error("Gagal membaca dari localStorage", e);
    }
  }

  private save(key: string, data: unknown) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage", e);
    }
  }

  // --- PRODUCTS ---
  getProducts(): Sparepart[] {
    return [...this.products];
  }

  getProductById(id: string): Sparepart | undefined {
    return this.products.find((p) => p.id === id);
  }

  addProduct(product: Omit<Sparepart, "id" | "createdAt" | "updatedAt">): Sparepart {
    const newProduct: Sparepart = {
      ...product,
      id: `sp-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    this.products = [newProduct, ...this.products];
    this.save(STORAGE_KEYS.PRODUCTS, this.products);

    // Sinkronkan juga ke tabel EOQ ROP
    const eoqItem: EoqRopAnalysis = {
      id: `eoq-${newProduct.id}`,
      kode: newProduct.kode,
      namaSparepart: newProduct.nama,
      kategori: newProduct.kategoriNama,
      demand: 600,
      biayaPemesanan: 120000,
      biayaPenyimpanan: 10000,
      leadTime: 3,
      rataRataPenggunaanHari: 2,
      eoq: 120,
      rop: newProduct.stokMinimum,
      stokSaatIni: newProduct.stokFisik,
      safetyStock: Math.round(newProduct.stokMinimum / 2),
      supplierNama: newProduct.supplierNama,
      supplierLeadTime: 3,
      status: newProduct.stokFisik <= newProduct.stokMinimum ? "Perlu Pemesanan" : "Stok Aman",
      rekomendasiPesanQty: newProduct.stokFisik <= newProduct.stokMinimum ? 120 : 0,
      estimasiBiayaPengadaan: 120 * newProduct.hargaBeli,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    this.eoqRopData = [eoqItem, ...this.eoqRopData];
    this.save(STORAGE_KEYS.EOQ_ROP, this.eoqRopData);

    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Sparepart>): Sparepart | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    this.products[index] = updated;
    this.save(STORAGE_KEYS.PRODUCTS, this.products);

    // Update corresponding EOQ/ROP item stok & status
    const eoqIndex = this.eoqRopData.findIndex((e) => e.kode === updated.kode);
    if (eoqIndex !== -1) {
      const e = this.eoqRopData[eoqIndex];
      const newStatus = updated.stokFisik <= e.rop ? "Perlu Pemesanan" : "Stok Aman";
      this.eoqRopData[eoqIndex] = {
        ...e,
        namaSparepart: updated.nama,
        stokSaatIni: updated.stokFisik,
        status: newStatus,
        rekomendasiPesanQty: newStatus === "Perlu Pemesanan" ? e.eoq : 0,
        estimasiBiayaPengadaan: (newStatus === "Perlu Pemesanan" ? e.eoq : 0) * updated.hargaBeli,
      };
      this.save(STORAGE_KEYS.EOQ_ROP, this.eoqRopData);
    }

    return updated;
  }

  deleteProduct(id: string): boolean {
    const p = this.products.find((x) => x.id === id);
    this.products = this.products.filter((item) => item.id !== id);
    this.save(STORAGE_KEYS.PRODUCTS, this.products);
    if (p) {
      this.eoqRopData = this.eoqRopData.filter((e) => e.kode !== p.kode);
      this.save(STORAGE_KEYS.EOQ_ROP, this.eoqRopData);
    }
    return true;
  }

  // --- CATEGORIES ---
  getCategories(): Kategori[] {
    return [...this.categories];
  }

  addCategory(kat: Omit<Kategori, "id" | "jumlahItem" | "createdAt">): Kategori {
    const newKat: Kategori = {
      ...kat,
      id: `kat-${Date.now()}`,
      jumlahItem: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.categories = [...this.categories, newKat];
    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    return newKat;
  }

  updateCategory(id: string, updates: Partial<Kategori>): Kategori | null {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    return this.categories[idx];
  }

  deleteCategory(id: string): boolean {
    this.categories = this.categories.filter((c) => c.id !== id);
    this.save(STORAGE_KEYS.CATEGORIES, this.categories);
    return true;
  }

  // --- SUPPLIERS ---
  getSuppliers(): Supplier[] {
    return [...this.suppliers];
  }

  addSupplier(sup: Omit<Supplier, "id" | "createdAt">): Supplier {
    const newSup: Supplier = {
      ...sup,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.suppliers = [...this.suppliers, newSup];
    this.save(STORAGE_KEYS.SUPPLIERS, this.suppliers);
    return newSup;
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const idx = this.suppliers.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.suppliers[idx] = { ...this.suppliers[idx], ...updates };
    this.save(STORAGE_KEYS.SUPPLIERS, this.suppliers);
    return this.suppliers[idx];
  }

  deleteSupplier(id: string): boolean {
    this.suppliers = this.suppliers.filter((s) => s.id !== id);
    this.save(STORAGE_KEYS.SUPPLIERS, this.suppliers);
    return true;
  }

  // --- BARANG MASUK ---
  getBarangMasuk(): BarangMasuk[] {
    return [...this.barangMasuk];
  }

  addBarangMasuk(item: Omit<BarangMasuk, "id" | "createdAt">): BarangMasuk {
    const newItem: BarangMasuk = {
      ...item,
      id: `bm-${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    this.barangMasuk = [newItem, ...this.barangMasuk];
    this.save(STORAGE_KEYS.BARANG_MASUK, this.barangMasuk);

    // Otomatis tambah stok fisik sparepart
    const product = this.products.find((p) => p.id === item.sparepartId);
    if (product) {
      this.updateProduct(product.id, {
        stokFisik: product.stokFisik + item.jumlah,
      });
    }

    return newItem;
  }

  // --- BARANG KELUAR ---
  getBarangKeluar(): BarangKeluar[] {
    return [...this.barangKeluar];
  }

  addBarangKeluar(item: Omit<BarangKeluar, "id" | "createdAt">): BarangKeluar {
    const newItem: BarangKeluar = {
      ...item,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    this.barangKeluar = [newItem, ...this.barangKeluar];
    this.save(STORAGE_KEYS.BARANG_KELUAR, this.barangKeluar);

    // Otomatis kurangi stok fisik sparepart
    const product = this.products.find((p) => p.id === item.sparepartId);
    if (product) {
      const newStock = Math.max(0, product.stokFisik - item.jumlah);
      this.updateProduct(product.id, {
        stokFisik: newStock,
      });
    }

    return newItem;
  }

  // --- EOQ & ROP ---
  getEoqRopData(): EoqRopAnalysis[] {
    return [...this.eoqRopData];
  }

  getRecommendations(): RecommendationItem[] {
    // Menampilkan sparepart yang memenuhi kriteria stok <= ROP
    return this.eoqRopData
      .filter((item) => item.stokSaatIni <= item.rop)
      .map((item) => {
        const isCritical = item.stokSaatIni <= item.safetyStock;
        const hargaUnit = Math.round(item.estimasiBiayaPengadaan / (item.rekomendasiPesanQty || 1)) || 85000;
        return {
          id: `rec-${item.id}`,
          sparepartId: item.id,
          kode: item.kode,
          namaSparepart: item.namaSparepart,
          kategori: item.kategori,
          stokSaatIni: item.stokSaatIni,
          rop: item.rop,
          eoq: item.eoq,
          status: isCritical ? "Kritis" : "Perlu Pemesanan",
          jumlahRekomendasiPemesanan: item.eoq,
          supplierId: "sup-1",
          supplierNama: item.supplierNama,
          supplierTelepon: "0812-3456-7890",
          leadTimeHari: item.leadTime,
          hargaBeliSatuan: hargaUnit,
          estimasiTotalBiaya: item.eoq * hargaUnit,
          catatanKebutuhan: `Stok saat ini ${item.stokSaatIni} unit telah mencapai/di bawah titik pemesanan kembali (ROP = ${item.rop} unit). Rekomendasi pesan sebesar kuantitas ekonomis (EOQ = ${item.eoq} unit).`,
          terakhirDipesan: "2026-08-28",
        };
      });
  }

  // --- STOCK ADJUSTMENT / OPNAME ---
  getAdjustments(): StockAdjustment[] {
    return [...this.adjustments];
  }

  addAdjustment(adj: Omit<StockAdjustment, "id" | "createdAt">): StockAdjustment {
    const newAdj: StockAdjustment = {
      ...adj,
      id: `adj-${Date.now()}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    this.adjustments = [newAdj, ...this.adjustments];
    this.save(STORAGE_KEYS.ADJUSTMENTS, this.adjustments);

    // Perbarui stok fisik sesuai hasil opname
    this.updateProduct(adj.sparepartId, {
      stokFisik: adj.stokFisikAktual,
    });

    return newAdj;
  }

  resetToDefault() {
    this.products = initialProducts;
    this.categories = initialCategories;
    this.suppliers = initialSuppliers;
    this.barangMasuk = initialBarangMasuk;
    this.barangKeluar = initialBarangKeluar;
    this.eoqRopData = initialEoqRopData;
    this.adjustments = [];
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  }
}

export const mockStore = new MockStore();
