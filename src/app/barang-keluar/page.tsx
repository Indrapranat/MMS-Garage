"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState, LoadingState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { transactionService } from "@/services/transactionService";
import { productService } from "@/services/productService";
import { formatDateIndo, formatNumber } from "@/lib/formatters";
import { BarangKeluar } from "@/types/transaction";
import { Sparepart } from "@/types/product";
import {
  ArrowUpFromLine,
  Plus,
  Search,
  Wrench,
  Car,
  Calendar,
  User,
  ClipboardList,
} from "lucide-react";

export default function BarangKeluarPage() {
  const [transactions, setTransactions] = useState<BarangKeluar[]>([]);
  const [products, setProducts] = useState<Sparepart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Create
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    noTransaksi: "",
    noPolisi: "",
    noSPK: "",
    tanggal: new Date().toISOString().split("T")[0],
    sparepartId: "",
    jumlah: 1,
    mekanik: "Supriyanto",
    keperluan: "Servis Berkala & Penggantian Sparepart",
    pencatat: "Doni Prasetyo (Service Advisor)",
    status: "Selesai" as "Selesai" | "Dibatalkan",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const [txRes, prodRes] = await Promise.all([
        transactionService.getAllBarangKeluar(),
        productService.getAllSpareparts(),
      ]);
      setTransactions(txRes);
      setProducts(prodRes);
      if (prodRes.length > 0 && !formData.sparepartId) {
        setFormData((prev) => ({ ...prev, sparepartId: prodRes[0].id }));
      }
    } catch (err) {
      console.error("Gagal memuat barang keluar", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (tx) =>
        tx.noTransaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.noPolisi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.sparepartNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.mekanik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.noSPK.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const totalUnitKeluar = useMemo(() => {
    return transactions.reduce((sum, item) => sum + item.jumlah, 0);
  }, [transactions]);

  const handleOpenCreate = () => {
    const defaultProd = products[0];
    setFormData({
      noTransaksi: `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
        transactions.length + 1
      ).padStart(3, "0")}`,
      noPolisi: "B 1234 XYZ",
      noSPK: `SPK-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      tanggal: new Date().toISOString().split("T")[0],
      sparepartId: defaultProd?.id || "",
      jumlah: 1,
      mekanik: "Supriyanto",
      keperluan: "Penggantian Part Servis Pelanggan",
      pencatat: "Doni Prasetyo (Service Advisor)",
      status: "Selesai",
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === formData.sparepartId);
  }, [products, formData.sparepartId]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.noTransaksi.trim()) errs.noTransaksi = "Nomor transaksi wajib diisi";
    if (!formData.noPolisi.trim()) errs.noPolisi = "Nomor plat kendaraan pelanggan wajib diisi";
    if (!formData.noSPK.trim()) errs.noSPK = "Nomor SPK bengkel wajib diisi";
    if (formData.jumlah <= 0) errs.jumlah = "Jumlah keluar minimal 1 unit";

    if (selectedProduct && formData.jumlah > selectedProduct.stokFisik) {
      errs.jumlah = `Stok tidak mencukupi! Sisa stok fisik hanya ${selectedProduct.stokFisik} ${selectedProduct.satuan}`;
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const prod = products.find((p) => p.id === formData.sparepartId);

      await transactionService.createBarangKeluar({
        ...formData,
        sparepartKode: prod?.kode || "SP-???",
        sparepartNama: prod?.nama || "Sparepart",
      });

      setIsCreateOpen(false);
      await fetchTransactions();
    } catch (err) {
      console.error("Gagal mencatat barang keluar", err);
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
              <ArrowUpFromLine className="w-6 h-6 text-blue-600" />
              Barang Keluar (Pemakaian Servis Bengkel)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan suku cadang yang dikeluarkan dari gudang untuk keperluan perbaikan mobil/motor pelanggan (SPK).
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Catat Barang Keluar
          </Button>
        </div>

        {/* 2 Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Pemakaian Suku Cadang"
            value={`${formatNumber(totalUnitKeluar)} Unit`}
            subtext="Unit suku cadang terpasang pada servis kendaraan"
            icon={<Wrench className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            title="Total SPK / Pekerjaan Bengkel"
            value={formatNumber(transactions.length)}
            subtext="Surat Perintah Kerja kendaraan terlayani"
            icon={<Car className="w-5 h-5" />}
            variant="emerald"
          />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari Plat Polisi, SPK, nama part, mekanik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredTransactions.length} Transaksi Ditemukan
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <LoadingState message="Memuat catatan pemakaian suku cadang..." />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              title="Belum ada transaksi barang keluar"
              description="Catat pengeluaran suku cadang saat mekanik mengambil barang untuk pekerjaan SPK servis pelanggan."
              actionLabel="Catat Pemakaian"
              onAction={handleOpenCreate}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Transaksi / Tanggal</TableHead>
                  <TableHead>Kendaraan (Plat / SPK)</TableHead>
                  <TableHead>Sparepart Digunakan</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead>Mekanik</TableHead>
                  <TableHead>Keperluan Servis</TableHead>
                  <TableHead>Pencatat / SA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-blue-700 block">
                        {item.noTransaksi}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateIndo(item.tanggal)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-900 block text-xs flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-blue-600" />
                        {item.noPolisi}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {item.noSPK}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-900 block text-xs">
                        {item.sparepartNama}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {item.sparepartKode}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-rose-50 text-rose-700 border border-rose-200">
                        -{item.jumlah}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {item.mekanik}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                      {item.keperluan}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {item.pencatat}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" size="sm">
                        {item.status}
                      </Badge>
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
          title="Catat Pengeluaran Suku Cadang (Barang Keluar)"
          description="Masukkan rincian pengambilan sparepart untuk pekerjaan servis pelanggan bengkel."
          maxWidth="xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nomor Transaksi Keluar"
                required
                value={formData.noTransaksi}
                onChange={(e) => setFormData({ ...formData, noTransaksi: e.target.value })}
                error={formErrors.noTransaksi}
              />
              <Input
                label="Tanggal Pengeluaran"
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
              <Input
                label="Nomor Polisi Kendaraan (Plat)"
                required
                value={formData.noPolisi}
                onChange={(e) => setFormData({ ...formData, noPolisi: e.target.value })}
                error={formErrors.noPolisi}
                placeholder="Contoh: B 1234 XYZ"
              />
              <Input
                label="Nomor SPK Bengkel"
                required
                value={formData.noSPK}
                onChange={(e) => setFormData({ ...formData, noSPK: e.target.value })}
                error={formErrors.noSPK}
                placeholder="Contoh: SPK-2026-0815"
              />
              <div className="sm:col-span-2">
                <Select
                  label="Pilih Suku Cadang"
                  required
                  value={formData.sparepartId}
                  onChange={(e) => setFormData({ ...formData, sparepartId: e.target.value })}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.kode} - {p.nama} (Stok Tersedia: {p.stokFisik} {p.satuan})
                    </option>
                  ))}
                </Select>
                {selectedProduct && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Lokasi: <span className="font-semibold text-slate-800">{selectedProduct.lokasiRak}</span> • Sisa Stok Fisik:{" "}
                    <span className="font-bold text-blue-700">{selectedProduct.stokFisik} {selectedProduct.satuan}</span>
                  </p>
                )}
              </div>
              <Input
                label="Jumlah Keluar (Qty)"
                type="number"
                required
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                error={formErrors.jumlah}
              />
              <Input
                label="Nama Mekanik Penanggung Jawab"
                required
                value={formData.mekanik}
                onChange={(e) => setFormData({ ...formData, mekanik: e.target.value })}
                placeholder="Contoh: Supriyanto"
              />
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Keperluan Pekerjaan Servis</label>
                <textarea
                  rows={2}
                  value={formData.keperluan}
                  onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: Ganti kampas rem depan servis berkala 20.000 KM..."
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Service Advisor / Petugas Pencatat"
                  required
                  value={formData.pencatat}
                  onChange={(e) => setFormData({ ...formData, pencatat: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Simpan & Kurangi Stok
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </div>
    </AppLayout>
  );
}
