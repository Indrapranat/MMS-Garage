"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState, LoadingState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { inventoryService } from "@/services/inventoryService";
import { formatRupiah, formatNumber, formatDateIndo } from "@/lib/formatters";
import { StockItem, StockAdjustment } from "@/types/inventory";
import {
  Boxes,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Scale,
  Search,
  Filter,
  MapPin,
  Clock,
  RotateCcw,
} from "lucide-react";

export default function StokPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<"daftar" | "riwayat">("daftar");

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Stock Opname Adjustment
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    stokFisikAktual: 0,
    tipePenyesuaian: "Koreksi Fisik" as "Koreksi Fisik" | "Barang Rusak" | "Barang Hilang" | "Lainnya",
    alasan: "",
    petugas: "Ahmad Suhendra (Kepala Gudang)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const [stockRes, adjRes] = await Promise.all([
        inventoryService.getStockOverview(),
        inventoryService.getAdjustments(),
      ]);
      setStockItems(stockRes);
      setAdjustments(adjRes);
    } catch (err) {
      console.error("Gagal memuat inventaris stok", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Summary counts
  const countAman = useMemo(() => stockItems.filter((i) => i.statusStok === "Aman").length, [stockItems]);
  const countMenipis = useMemo(() => stockItems.filter((i) => i.statusStok === "Menipis").length, [stockItems]);
  const countKritis = useMemo(() => stockItems.filter((i) => i.statusStok === "Kritis / Habis").length, [stockItems]);
  const totalValuasi = useMemo(() => stockItems.reduce((acc, i) => acc + i.totalNilaiAset, 0), [stockItems]);

  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lokasiRak.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategoriNama.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || item.statusStok === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [stockItems, searchQuery, statusFilter]);

  const handleOpenAdjustment = (item: StockItem) => {
    setSelectedStockItem(item);
    setAdjustmentForm({
      stokFisikAktual: item.stokFisik,
      tipePenyesuaian: "Koreksi Fisik",
      alasan: "",
      petugas: "Ahmad Suhendra (Kepala Gudang)",
    });
    setIsAdjustmentOpen(true);
  };

  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;
    try {
      setIsSubmitting(true);
      const selisih = adjustmentForm.stokFisikAktual - selectedStockItem.stokFisik;
      await inventoryService.createAdjustment({
        tanggal: new Date().toISOString().split("T")[0],
        sparepartId: selectedStockItem.id,
        sparepartKode: selectedStockItem.kode,
        sparepartNama: selectedStockItem.nama,
        stokSebelum: selectedStockItem.stokFisik,
        stokFisikAktual: adjustmentForm.stokFisikAktual,
        selisih,
        tipePenyesuaian: adjustmentForm.tipePenyesuaian,
        alasan: adjustmentForm.alasan || "Penyesuaian hasil stock opname fisik gudang",
        petugas: adjustmentForm.petugas,
      });

      setIsAdjustmentOpen(false);
      await fetchInventory();
    } catch (err) {
      console.error("Gagal menyimpan penyesuaian stok", err);
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
              <Boxes className="w-6 h-6 text-blue-600" />
              Monitoring Stok & Stock Opname
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau ketersediaan stok fisik riil, posisi buffer persediaan, dan lakukan penyesuaian koreksi opname fisik.
            </p>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Nilai Aset Stok"
            value={formatRupiah(totalValuasi)}
            subtext="Valuasi modal persediaan berjalan"
            icon={<Boxes className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            title="Stok Status Aman"
            value={`${countAman} Item`}
            subtext="Di atas titik batas pemesanan ulang"
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Stok Menipis (≤ ROP)"
            value={`${countMenipis} Item`}
            subtext="Mendekati / pada titik reorder"
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="amber"
          />
          <StatCard
            title="Stok Kritis / Habis"
            value={`${countKritis} Item`}
            subtext="Di bawah safety stock cadangan"
            icon={<AlertOctagon className="w-5 h-5" />}
            variant="rose"
          />
        </div>

        {/* Tabs & Filter */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Tabs
              tabs={[
                { id: "daftar", label: "Daftar Stok Fisik", count: stockItems.length },
                { id: "riwayat", label: "Riwayat Stock Opname", count: adjustments.length },
              ]}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as "daftar" | "riwayat")}
            />

            {activeTab === "daftar" && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-full sm:w-64 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari sparepart, rak..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Semua Status Stok</option>
                  <option value="Aman">Stok Aman</option>
                  <option value="Menipis">Menipis (≤ ROP)</option>
                  <option value="Kritis / Habis">Kritis / Habis</option>
                </select>
              </div>
            )}
          </div>

          {/* TAB 1: Daftar Stok Fisik */}
          {activeTab === "daftar" && (
            <div>
              {isLoading ? (
                <LoadingState message="Memuat inventaris stok..." />
              ) : filteredItems.length === 0 ? (
                <EmptyState
                  title="Tidak ada stok yang sesuai"
                  description="Ubah filter pencarian atau status stok."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Sparepart</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Lokasi Rak</TableHead>
                      <TableHead className="text-center">Batas ROP</TableHead>
                      <TableHead className="text-center">Stok Fisik</TableHead>
                      <TableHead>Status Persediaan</TableHead>
                      <TableHead className="text-right">Valuasi Stok</TableHead>
                      <TableHead className="text-right">Aksi Opname</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const isLow = item.statusStok === "Menipis";
                      const isCrit = item.statusStok === "Kritis / Habis";
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs font-semibold text-slate-700">
                            {item.kode}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-900 block text-xs">
                              {item.nama}
                            </span>
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
                          <TableCell className="text-center font-medium text-xs text-slate-700">
                            {item.rop} {item.satuan}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs ${
                                isCrit
                                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                                  : isLow
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {item.stokFisik} {item.satuan}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isCrit ? "danger" : isLow ? "warning" : "success"}
                              size="sm"
                            >
                              {item.statusStok}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono font-semibold text-slate-900">
                            {formatRupiah(item.totalNilaiAset)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenAdjustment(item)}
                              className="h-7 text-xs px-2.5 border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                            >
                              <Scale className="w-3.5 h-3.5 mr-1" />
                              Sesuaikan
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* TAB 2: Riwayat Stock Opname */}
          {activeTab === "riwayat" && (
            <div>
              {adjustments.length === 0 ? (
                <EmptyState
                  title="Belum ada catatan opname"
                  description="Belum pernah dilakukan penyesuaian atau koreksi fisik persediaan suku cadang."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal / Jam</TableHead>
                      <TableHead>Suku Cadang</TableHead>
                      <TableHead className="text-center">Stok Sistem (Sebelum)</TableHead>
                      <TableHead className="text-center">Fisik Aktual (Sesudah)</TableHead>
                      <TableHead className="text-center">Selisih</TableHead>
                      <TableHead>Tipe Penyesuaian</TableHead>
                      <TableHead>Alasan / Keterangan</TableHead>
                      <TableHead>Petugas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adjustments.map((adj) => (
                      <TableRow key={adj.id}>
                        <TableCell className="text-xs text-slate-700 font-mono">
                          {formatDateIndo(adj.tanggal)}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-slate-900 block text-xs">
                            {adj.sparepartNama}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {adj.sparepartKode}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-medium text-xs text-slate-600">
                          {adj.stokSebelum} unit
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs text-blue-700">
                          {adj.stokFisikAktual} unit
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                              adj.selisih > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : adj.selisih < 0
                                ? "bg-rose-50 text-rose-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {adj.selisih > 0 ? `+${adj.selisih}` : adj.selisih}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="neutral" size="sm">
                            {adj.tipePenyesuaian}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                          {adj.alasan}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {adj.petugas}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>

        {/* Modal Penyesuaian Stok (Stock Opname) */}
        <Dialog
          isOpen={isAdjustmentOpen}
          onClose={() => setIsAdjustmentOpen(false)}
          title="Penyesuaian Stok (Stock Opname)"
          description="Koreksi stok fisik aktual suku cadang setelah pemeriksaan fisik gudang."
          maxWidth="lg"
        >
          {selectedStockItem && (
            <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedStockItem.kode}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{selectedStockItem.nama}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                  <span>Lokasi: <strong>{selectedStockItem.lokasiRak}</strong></span>
                  <span>Stok Sistem Saat Ini: <strong className="text-blue-700">{selectedStockItem.stokFisik} {selectedStockItem.satuan}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Jumlah Fisik Aktual Nyata"
                  type="number"
                  required
                  value={adjustmentForm.stokFisikAktual}
                  onChange={(e) =>
                    setAdjustmentForm({ ...adjustmentForm, stokFisikAktual: Number(e.target.value) })
                  }
                  helperText={`Selisih: ${adjustmentForm.stokFisikAktual - selectedStockItem.stokFisik} ${selectedStockItem.satuan}`}
                />
                <Select
                  label="Tipe Penyesuaian"
                  required
                  value={adjustmentForm.tipePenyesuaian}
                  onChange={(e) =>
                    setAdjustmentForm({
                      ...adjustmentForm,
                      tipePenyesuaian: e.target.value as "Koreksi Fisik" | "Barang Rusak" | "Barang Hilang" | "Lainnya",
                    })
                  }
                >
                  <option value="Koreksi Fisik">Koreksi Fisik (Selisih Opname)</option>
                  <option value="Barang Rusak">Barang Rusak / Cacat</option>
                  <option value="Barang Hilang">Barang Hilang / Selisih Catat</option>
                  <option value="Lainnya">Lainnya</option>
                </Select>
                <div className="sm:col-span-2">
                  <Input
                    label="Petugas Penanggung Jawab Opname"
                    required
                    value={adjustmentForm.petugas}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, petugas: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Alasan Penyesuaian</label>
                  <textarea
                    rows={2}
                    required
                    value={adjustmentForm.alasan}
                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, alasan: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Ditemukan 1 botol rembes kemasan rusak saat audit mingguan..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAdjustmentOpen(false)}>
                  Batal
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
                  Terapkan Penyesuaian
                </Button>
              </DialogFooter>
            </form>
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}
