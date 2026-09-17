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
import { supplierService } from "@/services/supplierService";
import { formatRupiah, formatNumber, formatDateIndo } from "@/lib/formatters";
import { BarangMasuk } from "@/types/transaction";
import { Sparepart } from "@/types/product";
import { Supplier } from "@/types/supplier";
import {
  ArrowDownToLine,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  PackageCheck,
  FileText,
} from "lucide-react";

export default function BarangMasukPage() {
  const [transactions, setTransactions] = useState<BarangMasuk[]>([]);
  const [products, setProducts] = useState<Sparepart[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Create
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    noReferensi: "",
    noSuratJalan: "",
    tanggal: new Date().toISOString().split("T")[0],
    supplierId: "",
    sparepartId: "",
    jumlah: 20,
    hargaBeliSatuan: 85000,
    penerima: "Ahmad Suhendra (Kepala Gudang)",
    catatan: "",
    status: "Selesai" as "Selesai" | "Pending",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const [txRes, prodRes, supRes] = await Promise.all([
        transactionService.getAllBarangMasuk(),
        productService.getAllSpareparts(),
        supplierService.getAllSuppliers(),
      ]);
      setTransactions(txRes);
      setProducts(prodRes);
      setSuppliers(supRes);
      if (supRes.length > 0 && !formData.supplierId) {
        setFormData((prev) => ({ ...prev, supplierId: supRes[0].id }));
      }
      if (prodRes.length > 0 && !formData.sparepartId) {
        setFormData((prev) => ({
          ...prev,
          sparepartId: prodRes[0].id,
          hargaBeliSatuan: prodRes[0].hargaBeli,
        }));
      }
    } catch (err) {
      console.error("Gagal memuat barang masuk", err);
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
        tx.noReferensi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.sparepartNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.supplierNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.noSuratJalan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  // Metrics
  const totalUnitMasuk = useMemo(() => {
    return transactions.reduce((sum, item) => sum + item.jumlah, 0);
  }, [transactions]);

  const totalNilaiPengadaan = useMemo(() => {
    return transactions.reduce((sum, item) => sum + item.totalBiaya, 0);
  }, [transactions]);

  const handleOpenCreate = () => {
    const defaultProd = products[0];
    const defaultSup = suppliers[0];
    setFormData({
      noReferensi: `BM-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
        transactions.length + 1
      ).padStart(3, "0")}`,
      noSuratJalan: `SJ/${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toISOString().split("T")[0],
      supplierId: defaultSup?.id || "",
      sparepartId: defaultProd?.id || "",
      jumlah: 20,
      hargaBeliSatuan: defaultProd?.hargaBeli || 85000,
      penerima: "Ahmad Suhendra (Kepala Gudang)",
      catatan: "",
      status: "Selesai",
    });
    setFormErrors({});
    setSubmitError(null);
    setIsCreateOpen(true);
  };

  const handleSparepartChange = (sparepartId: string) => {
    const prod = products.find((p) => p.id === sparepartId);
    setFormData((prev) => ({
      ...prev,
      sparepartId,
      hargaBeliSatuan: prod ? prod.hargaBeli : prev.hargaBeliSatuan,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.noReferensi.trim()) errs.noReferensi = "Nomor referensi wajib diisi";
    if (!formData.noSuratJalan.trim()) errs.noSuratJalan = "Nomor surat jalan wajib diisi";
    if (formData.jumlah <= 0) errs.jumlah = "Jumlah masuk minimal 1 unit";
    if (formData.hargaBeliSatuan <= 0) errs.hargaBeliSatuan = "Harga beli harus lebih dari 0";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const prod = products.find((p) => p.id === formData.sparepartId);
      const sup = suppliers.find((s) => s.id === formData.supplierId);
      const totalBiaya = formData.jumlah * formData.hargaBeliSatuan;

      await transactionService.createBarangMasuk({
        ...formData,
        sparepartKode: prod?.kode || "SP-???",
        sparepartNama: prod?.nama || "Sparepart",
        supplierNama: sup?.nama || "Supplier",
        totalBiaya,
      });

      setIsCreateOpen(false);
      setSubmitSuccess("Barang masuk berhasil dicatat ke database dan stok fisik telah bertambah!");
      setTimeout(() => setSubmitSuccess(null), 5000);
      await fetchTransactions();
    } catch (err: any) {
      console.error("Gagal mencatat barang masuk", err);
      setSubmitError(err.message || "Terjadi kesalahan saat mencatat barang masuk.");
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
              <ArrowDownToLine className="w-6 h-6 text-emerald-600" />
              Barang Masuk (Penerimaan Stok)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan suku cadang yang diterima dari distributor/supplier untuk penambahan stok fisik secara otomatis.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Catat Barang Masuk
          </Button>
        </div>

        {submitSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        )}

        {/* 2 Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Penerimaan Barang"
            value={`${formatNumber(totalUnitMasuk)} Unit`}
            subtext={`${transactions.length} transaksi penerimaan tercatat`}
            icon={<PackageCheck className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Total Nilai Pengadaan"
            value={formatRupiah(totalNilaiPengadaan)}
            subtext="Akumulasi biaya pembelian suku cadang"
            icon={<DollarSign className="w-5 h-5" />}
            variant="blue"
          />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari No. Referensi, sparepart, supplier..."
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
            <LoadingState message="Memuat transaksi barang masuk..." />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              title="Belum ada transaksi barang masuk"
              description="Catat penerimaan surat jalan pengiriman dari distributor untuk memperbarui stok barang."
              actionLabel="Catat Sekarang"
              onAction={handleOpenCreate}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Referensi / Tanggal</TableHead>
                  <TableHead>No. Surat Jalan</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Sparepart</TableHead>
                  <TableHead className="text-center">Jumlah</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-right">Total Biaya</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold text-blue-700 block">
                        {item.noReferensi}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateIndo(item.tanggal)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-700">
                      {item.noSuratJalan}
                    </TableCell>
                    <TableCell className="text-xs text-slate-800 font-medium">
                      {item.supplierNama}
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                        +{item.jumlah}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-slate-700">
                      {formatRupiah(item.hargaBeliSatuan)}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono font-bold text-slate-900">
                      {formatRupiah(item.totalBiaya)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                      {item.penerima}
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
          title="Catat Penerimaan Barang Masuk"
          description="Masukkan data faktur / surat jalan pengiriman dari distributor. Stok gudang akan otomatis bertambah."
          maxWidth="xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                <span className="font-bold">Error:</span>
                <span>{submitError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nomor Referensi Masuk"
                required
                value={formData.noReferensi}
                onChange={(e) => setFormData({ ...formData, noReferensi: e.target.value })}
                error={formErrors.noReferensi}
              />
              <Input
                label="Nomor Surat Jalan (DO)"
                required
                value={formData.noSuratJalan}
                onChange={(e) => setFormData({ ...formData, noSuratJalan: e.target.value })}
                error={formErrors.noSuratJalan}
                placeholder="Contoh: SJ/ASTRA/2026/09"
              />
              <Input
                label="Tanggal Penerimaan"
                type="date"
                required
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
              <Select
                label="Supplier / Distributor"
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
              <div className="sm:col-span-2">
                <Select
                  label="Pilih Suku Cadang / Sparepart"
                  required
                  value={formData.sparepartId}
                  onChange={(e) => handleSparepartChange(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.kode} - {p.nama} (Stok Saat Ini: {p.stokFisik} {p.satuan})
                    </option>
                  ))}
                </Select>
              </div>
              <Input
                label="Jumlah Masuk (Qty)"
                type="number"
                required
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                error={formErrors.jumlah}
              />
              <Input
                label="Harga Beli Satuan (Rp)"
                type="number"
                required
                value={formData.hargaBeliSatuan}
                onChange={(e) => setFormData({ ...formData, hargaBeliSatuan: Number(e.target.value) })}
                error={formErrors.hargaBeliSatuan}
              />
              <div className="sm:col-span-2 p-3 bg-blue-50/70 rounded-lg border border-blue-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-900">Total Biaya Pengadaan:</span>
                <span className="text-base font-bold text-blue-700 font-mono">
                  {formatRupiah(formData.jumlah * formData.hargaBeliSatuan)}
                </span>
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Petugas Penerima Gudang"
                  required
                  value={formData.penerima}
                  onChange={(e) => setFormData({ ...formData, penerima: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Catatan / Kondisi Barang</label>
                <textarea
                  rows={2}
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="Kondisi kemasan rapi dan segel utuh..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                Simpan & Tambah Stok
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      </div>
    </AppLayout>
  );
}
