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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { recommendationService } from "@/services/recommendationService";
import { formatRupiah, formatNumber } from "@/lib/formatters";
import { RecommendationItem } from "@/types/eoqRop";
import {
  AlertCircle,
  Search,
  ShoppingCart,
  Phone,
  Clock,
  Eye,
  CheckCircle2,
  FileCheck,
  Building,
  ArrowDownToLine,
  Truck,
} from "lucide-react";

export default function RekomendasiPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RecommendationItem | null>(null);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const res = await recommendationService.getProcurementRecommendations();
      setRecommendations(res);
    } catch (err) {
      console.error("Gagal memuat rekomendasi pengadaan", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(
      (item) =>
        item.namaSparepart.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplierNama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recommendations, searchQuery]);

  const totalEstimasiPengadaan = useMemo(() => {
    return recommendations.reduce((sum, item) => sum + item.estimasiTotalBiaya, 0);
  }, [recommendations]);

  const totalUnitDipesan = useMemo(() => {
    return recommendations.reduce((sum, item) => sum + item.jumlahRekomendasiPemesanan, 0);
  }, [recommendations]);

  const handleOpenDetail = (item: RecommendationItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleOpenOrder = (item: RecommendationItem) => {
    setSelectedItem(item);
    setIsOrderOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsOrderOpen(false);
    setIsOrderSuccess(true);
    setTimeout(() => {
      setIsOrderSuccess(false);
    }, 4000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              Rekomendasi Pengadaan Suku Cadang (Stok ≤ ROP)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar otomatis suku cadang yang telah menyentuh batas pemesanan ulang (ROP) dan disarankan untuk dipesan sebesar kuantitas ekonomis (EOQ).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/analisis-eoq-rop">
              <Button variant="outline" size="sm">
                Lihat Matriks EOQ & ROP
              </Button>
            </Link>
          </div>
        </div>

        {/* Success Alert Banner if PO drafted */}
        {isOrderSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Draft Purchase Order (PO) untuk <strong>{selectedItem?.namaSparepart}</strong> berhasil disiapkan dan diteruskan ke bagian Purchasing.
              </span>
            </div>
            <Link href="/barang-masuk">
              <Button size="sm" variant="success" className="h-7 text-xs">
                Cek Barang Masuk
              </Button>
            </Link>
          </div>
        )}

        {/* 2 Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Jumlah Item Butuh Dipesan"
            value={`${recommendations.length} Suku Cadang`}
            subtext="Kondisi riil stok saat ini ≤ batas ROP"
            icon={<AlertCircle className="w-5 h-5" />}
            variant="amber"
          />
          <StatCard
            title="Total Volume Rekomendasi"
            value={`${formatNumber(totalUnitDipesan)} Unit`}
            subtext="Akumulasi kuantitas optimum EOQ"
            icon={<ShoppingCart className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            title="Estimasi Total Anggaran"
            value={formatRupiah(totalEstimasiPengadaan)}
            subtext="Estimasi biaya modal pengadaan PO batch"
            icon={<Building className="w-5 h-5" />}
            variant="emerald"
          />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari sparepart yang perlu dipesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredRecommendations.length} Item Memerlukan Pengadaan
          </span>
        </div>

        {/* Table Sesuai Spesifikasi Prompt */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {isLoading ? (
            <LoadingState message="Memeriksa kondisi stok terhadap ROP..." />
          ) : filteredRecommendations.length === 0 ? (
            <EmptyState
              title="Semua Stok dalam Kondisi Aman"
              description="Tidak ada suku cadang dengan stok di bawah Reorder Point (ROP) saat ini."
              icon={<CheckCircle2 className="w-10 h-10 text-emerald-500 stroke-[1.5]" />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Sparepart</TableHead>
                  <TableHead className="text-center">Stok Saat Ini</TableHead>
                  <TableHead className="text-center">Batas ROP</TableHead>
                  <TableHead className="text-center bg-blue-50/40">Kuantitas EOQ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center bg-amber-50/40">Jumlah Rekomendasi Pemesanan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecommendations.map((item) => {
                  const isCritical = item.status === "Kritis";
                  return (
                    <TableRow key={item.id} className="hover:bg-amber-50/20">
                      <TableCell>
                        <span className="font-semibold text-slate-900 block text-xs">
                          {item.namaSparepart}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-slate-500">{item.kode}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500">{item.supplierNama}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            isCritical
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {item.stokSaatIni} unit
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium text-xs text-slate-700">
                        {item.rop} unit
                      </TableCell>
                      <TableCell className="text-center bg-blue-50/30">
                        <span className="font-bold text-blue-700 text-xs px-2 py-0.5 rounded bg-blue-100/50">
                          {item.eoq} unit
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isCritical ? "danger" : "warning"} size="sm">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center bg-amber-50/30">
                        <span className="font-bold text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3 text-amber-700" />
                          Pesan {item.jumlahRekomendasiPemesanan} unit
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDetail(item)}
                            className="h-7 text-xs px-2 border-slate-300 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenOrder(item)}
                            className="h-7 text-xs px-2.5"
                          >
                            Buat PO
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal Detail Rekomendasi */}
        <Dialog
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Detail Rekomendasi Pengadaan Suku Cadang"
          description="Rincian justifikasi reorder point, supplier rujukan, dan estimasi biaya pemesanan."
          maxWidth="lg"
        >
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {selectedItem.kode}
                  </span>
                  <Badge variant={selectedItem.status === "Kritis" ? "danger" : "warning"}>
                    {selectedItem.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-slate-900 text-base mt-2">{selectedItem.namaSparepart}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedItem.catatanKebutuhan}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Stok Gudang Saat Ini</span>
                  <span className="text-base font-bold text-rose-700">
                    {selectedItem.stokSaatIni} unit
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Titik Reorder Point (ROP)</span>
                  <span className="text-base font-bold text-amber-800">
                    {selectedItem.rop} unit
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Jumlah Pesanan Ekonomis (EOQ)</span>
                  <span className="text-base font-bold text-blue-700">
                    {selectedItem.eoq} unit
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Estimasi Harga Beli / Unit</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {formatRupiah(selectedItem.hargaBeliSatuan)}
                  </span>
                </div>
              </div>

              {/* Total Card */}
              <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-blue-900 block">Estimasi Total Biaya Pengadaan:</span>
                  <span className="text-[11px] text-blue-700">({selectedItem.jumlahRekomendasiPemesanan} unit × {formatRupiah(selectedItem.hargaBeliSatuan)})</span>
                </div>
                <span className="text-lg font-bold text-blue-800 font-mono">
                  {formatRupiah(selectedItem.estimasiTotalBiaya)}
                </span>
              </div>

              {/* Supplier Info */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Distributor Utama: {selectedItem.supplierNama}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Lead Time: <strong>{selectedItem.leadTimeHari} Hari</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    Telepon: <strong>{selectedItem.supplierTelepon}</strong>
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)}>
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsOrderOpen(true);
                  }}
                >
                  Buat Draft PO Sekarang
                </Button>
              </DialogFooter>
            </div>
          )}
        </Dialog>

        {/* Confirm PO Dialog */}
        <ConfirmDialog
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          onConfirm={handleConfirmOrder}
          title="Buat Draft Purchase Order (PO)?"
          message={`Sistem akan membuat draft pengadaan untuk suku cadang "${selectedItem?.namaSparepart}" sejumlah ${selectedItem?.jumlahRekomendasiPemesanan} unit (EOQ) ke distributor ${selectedItem?.supplierNama} dengan estimasi biaya ${formatRupiah(
            selectedItem?.estimasiTotalBiaya || 0
          )}.`}
          confirmText="Ya, Terbitkan Draft PO"
          variant="primary"
        />
      </div>
    </AppLayout>
  );
}
