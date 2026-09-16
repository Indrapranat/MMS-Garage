"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, LoadingState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { productService } from "@/services/productService";
import { supplierService } from "@/services/supplierService";
import { formatRupiah, formatNumber } from "@/lib/formatters";
import { Sparepart, Kategori } from "@/types/product";
import { Supplier } from "@/types/supplier";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Layers,
  MapPin,
  Truck,
} from "lucide-react";

export default function SparepartPage() {
  const [products, setProducts] = useState<Sparepart[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Sparepart | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategoriId: "",
    satuan: "Pcs",
    hargaBeli: 0,
    hargaJual: 0,
    stokFisik: 0,
    stokMinimum: 10,
    stokMaksimum: 100,
    lokasiRak: "Rak A-01",
    supplierId: "",
    status: "Aktif" as "Aktif" | "Non-Aktif",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes, supRes] = await Promise.all([
        productService.getAllSpareparts(),
        productService.getAllCategories(),
        supplierService.getAllSuppliers(),
      ]);
      setProducts(prodRes);
      setCategories(catRes);
      setSuppliers(supRes);
      if (catRes.length > 0 && !formData.kategoriId) {
        setFormData((prev) => ({ ...prev, kategoriId: catRes[0].id }));
      }
      if (supRes.length > 0 && !formData.supplierId) {
        setFormData((prev) => ({ ...prev, supplierId: supRes[0].id }));
      }
    } catch (err) {
      console.error("Gagal memuat sparepart", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered & Paginated items
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lokasiRak.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === "all" || p.kategoriId === selectedCategory;
      const matchStatus = selectedStatus === "all" || p.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleOpenCreate = () => {
    setFormData({
      kode: `SP-${Date.now().toString().slice(-4)}`,
      nama: "",
      kategoriId: categories[0]?.id || "",
      satuan: "Pcs",
      hargaBeli: 50000,
      hargaJual: 75000,
      stokFisik: 20,
      stokMinimum: 10,
      stokMaksimum: 100,
      lokasiRak: "Rak B-01",
      supplierId: suppliers[0]?.id || "",
      status: "Aktif",
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (item: Sparepart) => {
    setSelectedItem(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      kategoriId: item.kategoriId,
      satuan: item.satuan,
      hargaBeli: item.hargaBeli,
      hargaJual: item.hargaJual,
      stokFisik: item.stokFisik,
      stokMinimum: item.stokMinimum,
      stokMaksimum: item.stokMaksimum,
      lokasiRak: item.lokasiRak,
      supplierId: item.supplierId,
      status: item.status,
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDetail = (item: Sparepart) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (item: Sparepart) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.kode.trim()) errors.kode = "Kode sparepart wajib diisi";
    if (!formData.nama.trim()) errors.nama = "Nama sparepart wajib diisi";
    if (formData.hargaBeli <= 0) errors.hargaBeli = "Harga beli harus lebih dari 0";
    if (formData.hargaJual <= 0) errors.hargaJual = "Harga jual harus lebih dari 0";
    if (formData.stokFisik < 0) errors.stokFisik = "Stok fisik tidak boleh negatif";
    if (formData.stokMinimum < 0) errors.stokMinimum = "Stok minimum tidak boleh negatif";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const cat = categories.find((c) => c.id === formData.kategoriId);
      const sup = suppliers.find((s) => s.id === formData.supplierId);
      await productService.createSparepart({
        ...formData,
        kategoriNama: cat?.nama || "Umum",
        supplierNama: sup?.nama || "Umum",
      });
      setIsCreateOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Gagal menambah sparepart", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !validateForm()) return;
    try {
      setIsSubmitting(true);
      const cat = categories.find((c) => c.id === formData.kategoriId);
      const sup = suppliers.find((s) => s.id === formData.supplierId);
      await productService.updateSparepart(selectedItem.id, {
        ...formData,
        kategoriNama: cat?.nama || selectedItem.kategoriNama,
        supplierNama: sup?.nama || selectedItem.supplierNama,
      });
      setIsEditOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Gagal mengedit sparepart", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedItem) return;
    try {
      setIsSubmitting(true);
      await productService.deleteSparepart(selectedItem.id);
      setIsDeleteOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Gagal menghapus sparepart", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Data Master Sparepart
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola katalog seluruh suku cadang bengkel, harga beli/jual, lokasi rak, dan level stok minimum.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Sparepart
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, kode, rak..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <LoadingState message="Memuat daftar sparepart..." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Sparepart tidak ditemukan"
              description="Tidak ada suku cadang yang sesuai dengan kriteria pencarian atau filter Anda."
              actionLabel="Tambah Sparepart Baru"
              onAction={handleOpenCreate}
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Sparepart</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Lokasi Rak</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Harga Jual</TableHead>
                    <TableHead className="text-center">Stok Fisik</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {item.kode}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900 block">{item.nama}</span>
                        <span className="text-[11px] text-slate-500">Satuan: {item.satuan}</span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {item.kategoriNama}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.lokasiRak}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-slate-700">
                        {formatRupiah(item.hargaBeli)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-emerald-700">
                        {formatRupiah(item.hargaJual)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full font-bold text-xs ${
                            item.stokFisik <= item.stokMinimum
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {item.stokFisik} {item.satuan}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                        {item.supplierNama}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Aktif" ? "success" : "neutral"} size="sm">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(item)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t border-slate-200 px-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Create */}
        <Dialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Tambah Master Sparepart"
          description="Lengkapi detail suku cadang baru untuk didaftarkan ke sistem inventaris bengkel."
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kode Sparepart"
                required
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                error={formErrors.kode}
                placeholder="Contoh: SP-REM-001"
              />
              <Input
                label="Nama Sparepart"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                error={formErrors.nama}
                placeholder="Contoh: Kampas Rem Depan Avanza"
              />
              <Select
                label="Kategori"
                required
                value={formData.kategoriId}
                onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </Select>
              <Select
                label="Satuan"
                required
                value={formData.satuan}
                onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
              >
                <option value="Pcs">Pcs</option>
                <option value="Set">Set</option>
                <option value="Botol">Botol</option>
                <option value="Galon">Galon</option>
                <option value="Unit">Unit</option>
                <option value="Box">Box</option>
                <option value="Can">Can</option>
              </Select>
              <Input
                label="Harga Beli (Rp)"
                type="number"
                required
                value={formData.hargaBeli}
                onChange={(e) => setFormData({ ...formData, hargaBeli: Number(e.target.value) })}
                error={formErrors.hargaBeli}
              />
              <Input
                label="Harga Jual (Rp)"
                type="number"
                required
                value={formData.hargaJual}
                onChange={(e) => setFormData({ ...formData, hargaJual: Number(e.target.value) })}
                error={formErrors.hargaJual}
              />
              <Input
                label="Stok Awal Fisik"
                type="number"
                required
                value={formData.stokFisik}
                onChange={(e) => setFormData({ ...formData, stokFisik: Number(e.target.value) })}
                error={formErrors.stokFisik}
              />
              <Input
                label="Batas Stok Minimum (Safety Buffer)"
                type="number"
                required
                value={formData.stokMinimum}
                onChange={(e) => setFormData({ ...formData, stokMinimum: Number(e.target.value) })}
                error={formErrors.stokMinimum}
              />
              <Input
                label="Lokasi Rak / Bin"
                required
                value={formData.lokasiRak}
                onChange={(e) => setFormData({ ...formData, lokasiRak: e.target.value })}
                placeholder="Contoh: Rak B-02"
              />
              <Select
                label="Supplier Utama"
                required
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.leadTimeHari} hari)
                  </option>
                ))}
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Simpan Sparepart
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Modal Edit */}
        <Dialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Master Sparepart"
          description="Perbarui informasi data suku cadang."
          maxWidth="2xl"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kode Sparepart"
                required
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                error={formErrors.kode}
              />
              <Input
                label="Nama Sparepart"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                error={formErrors.nama}
              />
              <Select
                label="Kategori"
                required
                value={formData.kategoriId}
                onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </Select>
              <Select
                label="Satuan"
                required
                value={formData.satuan}
                onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
              >
                <option value="Pcs">Pcs</option>
                <option value="Set">Set</option>
                <option value="Botol">Botol</option>
                <option value="Galon">Galon</option>
                <option value="Unit">Unit</option>
              </Select>
              <Input
                label="Harga Beli (Rp)"
                type="number"
                required
                value={formData.hargaBeli}
                onChange={(e) => setFormData({ ...formData, hargaBeli: Number(e.target.value) })}
                error={formErrors.hargaBeli}
              />
              <Input
                label="Harga Jual (Rp)"
                type="number"
                required
                value={formData.hargaJual}
                onChange={(e) => setFormData({ ...formData, hargaJual: Number(e.target.value) })}
                error={formErrors.hargaJual}
              />
              <Input
                label="Stok Fisik"
                type="number"
                required
                value={formData.stokFisik}
                onChange={(e) => setFormData({ ...formData, stokFisik: Number(e.target.value) })}
                error={formErrors.stokFisik}
              />
              <Input
                label="Batas Stok Minimum"
                type="number"
                required
                value={formData.stokMinimum}
                onChange={(e) => setFormData({ ...formData, stokMinimum: Number(e.target.value) })}
                error={formErrors.stokMinimum}
              />
              <Input
                label="Lokasi Rak"
                required
                value={formData.lokasiRak}
                onChange={(e) => setFormData({ ...formData, lokasiRak: e.target.value })}
              />
              <Select
                label="Supplier Utama"
                required
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Modal Detail */}
        <Dialog
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detail Suku Cadang"
          description="Informasi spesifikasi lengkap dan valuasi inventaris barang."
          maxWidth="lg"
        >
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedItem.kode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedItem.nama}</h3>
                  <p className="text-xs text-slate-500">{selectedItem.kategoriNama}</p>
                </div>
                <Badge variant={selectedItem.status === "Aktif" ? "success" : "neutral"}>
                  {selectedItem.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Stok Fisik Saat Ini</span>
                  <span className="text-lg font-bold text-slate-900">
                    {selectedItem.stokFisik} {selectedItem.satuan}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Batas Minimum (Buffer)</span>
                  <span className="text-lg font-bold text-amber-700">
                    {selectedItem.stokMinimum} {selectedItem.satuan}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Harga Beli Satuan</span>
                  <span className="text-sm font-bold text-slate-800">
                    {formatRupiah(selectedItem.hargaBeli)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Harga Jual Satuan</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {formatRupiah(selectedItem.hargaJual)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Lokasi Penyimpanan</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {selectedItem.lokasiRak}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Total Nilai Persediaan</span>
                  <span className="text-sm font-bold text-blue-700">
                    {formatRupiah(selectedItem.stokFisik * selectedItem.hargaBeli)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs">
                <span className="font-semibold text-blue-900 block mb-1">Supplier Utama:</span>
                <p className="text-blue-800">{selectedItem.supplierNama}</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Terakhir diperbarui: {selectedItem.updatedAt || selectedItem.createdAt}
                </p>
              </div>

              <DialogFooter>
                <Button variant="primary" size="sm" onClick={() => setIsDetailOpen(false)}>
                  Tutup Detail
                </Button>
              </DialogFooter>
            </div>
          )}
        </Dialog>

        {/* Modal Delete Confirm */}
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteSubmit}
          title="Hapus Sparepart?"
          message={`Apakah Anda yakin ingin menghapus suku cadang "${selectedItem?.nama}" (${selectedItem?.kode})? Data yang telah dihapus tidak dapat dipulihkan.`}
          confirmText="Ya, Hapus Sparepart"
          isLoading={isSubmitting}
        />
      </div>
    </AppLayout>
  );
}
