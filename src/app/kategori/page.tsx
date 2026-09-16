"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState, LoadingState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { productService } from "@/services/productService";
import { Kategori } from "@/types/product";
import { Layers, Plus, Search, Edit2, Trash2, FolderPlus } from "lucide-react";

export default function KategoriPage() {
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Kategori | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    deskripsi: "",
    status: "Aktif" as "Aktif" | "Non-Aktif",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getAllCategories();
      // Hitung jumlah item terkini per kategori dari daftar produk
      const products = await productService.getAllSpareparts();
      const updatedCategories = res.map((cat) => ({
        ...cat,
        jumlahItem: products.filter((p) => p.kategoriId === cat.id).length,
      }));
      setCategories(updatedCategories);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleOpenCreate = () => {
    setFormData({
      kode: `KAT-${Date.now().toString().slice(-3)}`,
      nama: "",
      deskripsi: "",
      status: "Aktif",
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (item: Kategori) => {
    setSelectedCategory(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      deskripsi: item.deskripsi,
      status: item.status,
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item: Kategori) => {
    setSelectedCategory(item);
    setIsDeleteOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.kode.trim()) errs.kode = "Kode kategori wajib diisi";
    if (!formData.nama.trim()) errs.nama = "Nama kategori wajib diisi";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await productService.createCategory(formData);
      setIsCreateOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error("Gagal menambah kategori", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !validate()) return;
    try {
      setIsSubmitting(true);
      await productService.updateCategory(selectedCategory.id, formData);
      setIsEditOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error("Gagal memperbarui kategori", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return;
    try {
      setIsSubmitting(true);
      await productService.deleteCategory(selectedCategory.id);
      setIsDeleteOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error("Gagal menghapus kategori", err);
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
              <Layers className="w-6 h-6 text-blue-600" />
              Kategori Sparepart
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klasifikasi dan pengelompokan jenis suku cadang di bengkel untuk mempermudah inventarisasi dan pelaporan.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Kategori
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kategori atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total {filteredCategories.length} Kategori
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <LoadingState message="Memuat daftar kategori..." />
          ) : filteredCategories.length === 0 ? (
            <EmptyState
              title="Kategori tidak ditemukan"
              description="Belum ada kategori yang sesuai dengan kata kunci pencarian Anda."
              actionLabel="Tambah Kategori"
              onAction={handleOpenCreate}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-center">Jumlah Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {item.kode}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 text-sm">
                      {item.nama}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-md">
                      {item.deskripsi || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-blue-50 text-blue-700">
                        {item.jumlahItem} item
                      </span>
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
          )}
        </div>

        {/* Modal Create */}
        <Dialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Tambah Kategori Sparepart"
          description="Tambahkan klasifikasi baru untuk inventaris suku cadang."
          maxWidth="md"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <Input
              label="Kode Kategori"
              required
              value={formData.kode}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              error={formErrors.kode}
              placeholder="Contoh: KAT-REM"
            />
            <Input
              label="Nama Kategori"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              error={formErrors.nama}
              placeholder="Contoh: Sistem Pengereman"
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Deskripsi</label>
              <textarea
                rows={3}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                placeholder="Rincian suku cadang yang tercakup..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Simpan Kategori
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Modal Edit */}
        <Dialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Kategori Sparepart"
          description="Perbarui informasi kategori."
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Kode Kategori"
              required
              value={formData.kode}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              error={formErrors.kode}
            />
            <Input
              label="Nama Kategori"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              error={formErrors.nama}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Deskripsi</label>
              <textarea
                rows={3}
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
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

        {/* Delete Confirm */}
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteSubmit}
          title="Hapus Kategori?"
          message={`Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus Kategori"
          isLoading={isSubmitting}
        />
      </div>
    </AppLayout>
  );
}
