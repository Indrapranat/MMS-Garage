"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState, LoadingState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { eoqRopService } from "@/services/eoqRopService";
import { formatRupiah, formatNumber } from "@/lib/formatters";
import { EoqRopAnalysis } from "@/types/eoqRop";
import {
  Calculator,
  Search,
  Filter,
  Info,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Eye,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AnalisisEoqRopPage() {
  const [data, setData] = useState<EoqRopAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal Detail
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EoqRopAnalysis | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Data diambil langsung dari backend/service mock tanpa rumus di frontend
        const res = await eoqRopService.getEoqRopAnalysis();
        setData(res);
      } catch (err) {
        console.error("Gagal memuat analisis EOQ & ROP", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.namaSparepart.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const itemsNeedOrder = useMemo(() => data.filter((d) => d.status === "Perlu Pemesanan" || d.status === "Kritis"), [data]);

  const handleOpenDetail = (item: EoqRopAnalysis) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Analisis Metode EOQ & ROP
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tabel komprehensif parameter Economic Order Quantity (EOQ) dan Reorder Point (ROP) yang dihasilkan server.
            </p>
          </div>
          <Link href="/rekomendasi">
            <Button variant="warning" className="shadow-sm">
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Lihat Rekomendasi Pengadaan ({itemsNeedOrder.length})
            </Button>
          </Link>
        </div>

        {/* Educational Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/70 to-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Metode EOQ (Economic Order Quantity)
                </CardTitle>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  EOQ = √[(2 × D × S) / H]
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1">
              <p>
                Menentukan <strong>jumlah pemesanan paling optimal</strong> yang meminimalkan total biaya antara <strong>biaya pemesanan (S)</strong> dan <strong>biaya penyimpanan barang (H)</strong> selama 1 periode/tahun.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50/70 to-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Metode ROP (Reorder Point)
                </CardTitle>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                  ROP = (d × L) + Safety Stock
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1">
              <p>
                Menentukan <strong>titik batas level persediaan</strong> kapan pemesanan baru harus segera dilakukan kepada supplier berdasarkan tingkat penggunaan harian (<strong>d</strong>) dan waktu tunggu (<strong>L</strong>).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari kode atau nama sparepart..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="Stok Aman">Stok Aman</option>
              <option value="Perlu Pemesanan">Perlu Pemesanan</option>
            </select>
          </div>
        </div>

        {/* Tabel Wajib Sesuai Spesifikasi Prompt */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tabel Matriks Parameter EOQ & ROP
            </h3>
            <span className="text-xs text-slate-500">
              *Data bersumber dari server kalkulasi tanpa perhitungan di frontend
            </span>
          </div>

          {isLoading ? (
            <LoadingState message="Mengambil hasil analisis EOQ & ROP..." />
          ) : filteredData.length === 0 ? (
            <EmptyState
              title="Data tidak ditemukan"
              description="Tidak ada suku cadang yang cocok dengan kriteria pencarian."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Sparepart</TableHead>
                  <TableHead className="text-right">Demand (D)</TableHead>
                  <TableHead className="text-right">Biaya Pesan (S)</TableHead>
                  <TableHead className="text-right">Biaya Simpan (H)</TableHead>
                  <TableHead className="text-center">Lead Time (L)</TableHead>
                  <TableHead className="text-center">Rata-rata/Hari (d)</TableHead>
                  <TableHead className="text-center bg-blue-50/50">EOQ (Unit)</TableHead>
                  <TableHead className="text-center bg-amber-50/50">ROP (Unit)</TableHead>
                  <TableHead className="text-center">Stok Saat Ini</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const isUnderRop = item.stokSaatIni <= item.rop;
                  return (
                    <TableRow key={item.id} className={isUnderRop ? "bg-amber-50/30" : undefined}>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {item.kode}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900 block text-xs">
                          {item.namaSparepart}
                        </span>
                        <span className="text-[11px] text-slate-500">{item.kategori}</span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium text-slate-700">
                        {formatNumber(item.demand)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-slate-600">
                        {formatRupiah(item.biayaPemesanan)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-slate-600">
                        {formatRupiah(item.biayaPenyimpanan)}
                      </TableCell>
                      <TableCell className="text-center text-xs font-medium text-slate-700">
                        {item.leadTime} hari
                      </TableCell>
                      <TableCell className="text-center text-xs font-medium text-slate-700">
                        {item.rataRataPenggunaanHari} unit
                      </TableCell>
                      <TableCell className="text-center bg-blue-50/40">
                        <span className="font-bold text-blue-700 text-xs px-2 py-0.5 rounded bg-blue-100/60">
                          {item.eoq}
                        </span>
                      </TableCell>
                      <TableCell className="text-center bg-amber-50/40">
                        <span className="font-bold text-amber-800 text-xs px-2 py-0.5 rounded bg-amber-100/60">
                          {item.rop}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                            isUnderRop
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {item.stokSaatIni}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isUnderRop ? "warning" : "success"} size="sm">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Detail Analisis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal Detail Analisis */}
        <Dialog
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detail Parameter EOQ & ROP"
          description="Informasi breakdown parameter matematis untuk suku cadang bersangkutan."
          maxWidth="lg"
        >
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedItem.kode}
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-1">{selectedItem.namaSparepart}</h4>
                <p className="text-xs text-slate-500">Kategori: {selectedItem.kategori} • Supplier: {selectedItem.supplierNama}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Permintaan Tahunan (D)</span>
                  <span className="text-base font-bold text-slate-900">{selectedItem.demand} unit/thn</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Biaya Pemesanan (S)</span>
                  <span className="text-sm font-bold text-slate-800">{formatRupiah(selectedItem.biayaPemesanan)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Biaya Simpan / Unit (H)</span>
                  <span className="text-sm font-bold text-slate-800">{formatRupiah(selectedItem.biayaPenyimpanan)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Lead Time Supplier (L)</span>
                  <span className="text-base font-bold text-slate-900">{selectedItem.leadTime} hari</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Rata-rata Harian (d)</span>
                  <span className="text-base font-bold text-slate-900">{selectedItem.rataRataPenggunaanHari} unit/hari</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Safety Stock (SS)</span>
                  <span className="text-base font-bold text-emerald-700">{selectedItem.safetyStock} unit</span>
                </div>
              </div>

              {/* Box Hasil & Proses Komputasi Matematis Server */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-blue-400 flex items-center gap-1.5 font-sans">
                    <Calculator className="w-4 h-4 text-blue-400" />
                    Proses Substitusi Matematis Server (Transparan & Deterministic)
                  </span>
                  <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700 font-mono">
                    Backend Engine
                  </Badge>
                </div>

                <div className="space-y-2 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-amber-300 font-semibold font-sans text-xs">1. Formula Economic Order Quantity (EOQ):</div>
                  <div className="text-slate-400">{selectedItem.eoqFormula || "EOQ = √((2 × D × S) / H)"}</div>
                  <div className="text-emerald-400 whitespace-pre-wrap">
                    {selectedItem.eoqSteps || `EOQ = √((2 × ${selectedItem.demand} × ${formatRupiah(selectedItem.biayaPemesanan)}) / ${formatRupiah(selectedItem.biayaPenyimpanan)}) ≈ ${selectedItem.eoq} unit`}
                  </div>
                </div>

                <div className="space-y-2 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-amber-300 font-semibold font-sans text-xs">2. Formula Reorder Point (ROP):</div>
                  <div className="text-slate-400">{selectedItem.ropFormula || "ROP = (d × L) + SS"}</div>
                  <div className="text-emerald-400 whitespace-pre-wrap">
                    {selectedItem.ropSteps || `ROP = (${selectedItem.rataRataPenggunaanHari} × ${selectedItem.leadTime}) + ${selectedItem.safetyStock} = ${selectedItem.rop} unit`}
                  </div>
                </div>
              </div>

              {/* Box Hasil Server */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl border border-blue-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hasil Rekomendasi Kontrol Sistem
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">Stok Aktual:</span>
                    <span className="text-lg font-bold text-slate-900">{selectedItem.stokSaatIni} Unit</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-800 block font-medium">Batas ROP:</span>
                    <span className="text-lg font-bold text-amber-900">{selectedItem.rop} Unit</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-blue-700 block font-medium">Optimal (EOQ):</span>
                    <span className="text-lg font-bold text-blue-900">{selectedItem.eoq} Unit</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block font-medium">Status Kontrol:</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded inline-block mt-0.5 ${
                      selectedItem.status === "Kritis"
                        ? "bg-rose-100 text-rose-800"
                        : selectedItem.status === "Perlu Pemesanan"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 pt-2 border-t border-blue-100">
                  {selectedItem.recommendationNote || (selectedItem.stokSaatIni <= selectedItem.rop
                    ? `Status: PERLU PESAN. Stok saat ini (${selectedItem.stokSaatIni} unit) <= ROP (${selectedItem.rop} unit). Rekomendasi: Pesan ${selectedItem.eoq} unit.`
                    : `Status: NORMAL. Stok saat ini (${selectedItem.stokSaatIni} unit) > ROP (${selectedItem.rop} unit). Persediaan aman.`)}
                </p>
              </div>

              <DialogFooter>
                <Button variant="primary" size="sm" onClick={() => setIsDetailOpen(false)}>
                  Tutup
                </Button>
              </DialogFooter>
            </div>
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}
