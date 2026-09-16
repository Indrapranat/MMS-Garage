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
import { supplierService } from "@/services/supplierService";
import { Supplier } from "@/types/supplier";
import {
  Truck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
} from "lucide-react";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kontakPerson: "",
    telepon: "",
    email: "",
    alamat: "",
    kota: "Jakarta",
    leadTimeHari: 3,
    status: "Aktif" as "Aktif" | "Non-Aktif",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await supplierService.getAllSuppliers();
      setSuppliers(res);
    } catch (err) {
      console.error("Gagal memuat supplier", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (s) =>
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kontakPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kota.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  const handleOpenCreate = () => {
    setFormData({
      kode: `SUP-${Date.now().toString().slice(-4)}`,
      nama: "",
      kontakPerson: "",
      telepon: "",
      email: "",
      alamat: "",
      kota: "Jakarta",
      leadTimeHari: 3,
      status: "Aktif",
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (item: Supplier) => {
    setSelectedSupplier(item);
    setFormData({
      kode: item.kode,
      nama: item.nama,
      kontakPerson: item.kontakPerson,
      telepon: item.telepon,
      email: item.email,
      alamat: item.alamat,
      kota: item.kota,
      leadTimeHari: item.leadTimeHari,
      status: item.status,
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDetail = (item: Supplier) => {
    setSelectedSupplier(item);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (item: Supplier) => {
    setSelectedSupplier(item);
    setIsDeleteOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.kode.trim()) errs.kode = "Kode supplier wajib diisi";
    if (!formData.nama.trim()) errs.nama = "Nama supplier wajib diisi";
    if (!formData.telepon.trim()) errs.telepon = "Nomor telepon wajib diisi";
    if (formData.leadTimeHari <= 0) errs.leadTimeHari = "Lead time minimal 1 hari";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await supplierService.createSupplier(formData);
      setIsCreateOpen(false);
      await fetchSuppliers();
    } catch (err) {
      console.error("Gagal menambah supplier", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !validate()) return;
    try {
      setIsSubmitting(true);
      await supplierService.updateSupplier(selectedSupplier.id, formData);
      setIsEditOpen(false);
      await fetchSuppliers();
    } catch (err) {
      console.error("Gagal memperbarui supplier", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedSupplier) return;
    try {
      setIsSubmitting(true);
      await supplierService.deleteSupplier(selectedSupplier.id);
      setIsDeleteOpen(false);
      await fetchSuppliers();
    } catch (err) {
      console.error("Gagal menghapus supplier", err);
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
              <Truck className="w-6 h-6 text-blue-600" />
              Data Master Supplier
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola rekanan distributor suku cadang, kontak pemesanan, dan parameter rata-rata lead time pengiriman.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Supplier
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, kontak, kota supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total {filteredSuppliers.length} Rekanan Aktif
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <LoadingState message="Memuat daftar supplier..." />
          ) : filteredSuppliers.length === 0 ? (
            <EmptyState
              title="Supplier tidak ditemukan"
              description="Belum ada supplier yang sesuai dengan pencarian Anda."
              actionLabel="Tambah Supplier"
              onAction={handleOpenCreate}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Distributor / Rekanan</TableHead>
                  <TableHead>PIC & Kontak</TableHead>
                  <TableHead>Kota / Wilayah</TableHead>
                  <TableHead className="text-center">Lead Time (ROP)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {item.kode}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900 block">{item.nama}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {item.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <span className="font-medium text-slate-800 block flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {item.kontakPerson}
                        </span>
                        <span className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {item.telepon}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.kota}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {item.leadTimeHari} Hari
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
          title="Tambah Data Supplier"
          description="Daftarkan rekanan distributor baru ke sistem inventaris bengkel."
          maxWidth="lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kode Supplier"
                required
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                error={formErrors.kode}
                placeholder="Contoh: SUP-ASTRA"
              />
              <Input
                label="Nama Distributor / Perusahaan"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                error={formErrors.nama}
                placeholder="Contoh: PT Astra Otoparts Tbk"
              />
              <Input
                label="PIC / Kontak Person"
                required
                value={formData.kontakPerson}
                onChange={(e) => setFormData({ ...formData, kontakPerson: e.target.value })}
                placeholder="Contoh: Hendra Wijaya"
              />
              <Input
                label="Nomor Telepon / WhatsApp"
                required
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                error={formErrors.telepon}
                placeholder="Contoh: 0812-3456-7890"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Contoh: orders@supplier.com"
              />
              <Input
                label="Kota Asal Pengiriman"
                value={formData.kota}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Rata-rata Lead Time Pengiriman (Hari)"
                  type="number"
                  required
                  helperText="Waktu tunggu rata-rata (L) dari PO diterbitkan hingga suku cadang tiba di gudang. Sangat penting untuk metode ROP!"
                  value={formData.leadTimeHari}
                  onChange={(e) => setFormData({ ...formData, leadTimeHari: Number(e.target.value) })}
                  error={formErrors.leadTimeHari}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="Jl. Raya Industri..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Simpan Supplier
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Modal Edit */}
        <Dialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Data Supplier"
          description="Perbarui informasi data supplier."
          maxWidth="lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kode Supplier"
                required
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                error={formErrors.kode}
              />
              <Input
                label="Nama Distributor"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                error={formErrors.nama}
              />
              <Input
                label="PIC / Kontak Person"
                required
                value={formData.kontakPerson}
                onChange={(e) => setFormData({ ...formData, kontakPerson: e.target.value })}
              />
              <Input
                label="Nomor Telepon"
                required
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                error={formErrors.telepon}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Kota"
                value={formData.kota}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Lead Time Pengiriman (Hari)"
                  type="number"
                  required
                  value={formData.leadTimeHari}
                  onChange={(e) => setFormData({ ...formData, leadTimeHari: Number(e.target.value) })}
                  error={formErrors.leadTimeHari}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Alamat</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
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
          title="Hapus Data Supplier?"
          message={`Apakah Anda yakin ingin menghapus supplier "${selectedSupplier?.nama}"? Pastikan tidak ada data barang yang terikat.`}
          confirmText="Ya, Hapus Supplier"
          isLoading={isSubmitting}
        />
      </div>
    </AppLayout>
  );
}
