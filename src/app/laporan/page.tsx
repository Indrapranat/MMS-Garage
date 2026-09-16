"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState, LoadingState } from "@/components/shared/EmptyState";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { productService } from "@/services/productService";
import { transactionService } from "@/services/transactionService";
import { eoqRopService } from "@/services/eoqRopService";
import { formatRupiah, formatNumber, formatDateIndo } from "@/lib/formatters";
import { Sparepart, Kategori } from "@/types/product";
import { BarangMasuk, BarangKeluar } from "@/types/transaction";
import { EoqRopAnalysis } from "@/types/eoqRop";
import {
  FileBarChart,
  Printer,
  Download,
  Filter,
  Calendar,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  DollarSign,
} from "lucide-react";

export default function LaporanPage() {
  const [activeReportTab, setActiveReportTab] = useState<"stok" | "masuk" | "keluar" | "eoq">("stok");
  const [products, setProducts] = useState<Sparepart[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [barangMasuk, setBarangMasuk] = useState<BarangMasuk[]>([]);
  const [barangKeluar, setBarangKeluar] = useState<BarangKeluar[]>([]);
  const [eoqData, setEoqData] = useState<EoqRopAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-09-30");

  useEffect(() => {
    async function loadReportData() {
      try {
        setIsLoading(true);
        const [prodRes, catRes, bmRes, bkRes, eoqRes] = await Promise.all([
          productService.getAllSpareparts(),
          productService.getAllCategories(),
          transactionService.getAllBarangMasuk(),
          transactionService.getAllBarangKeluar(),
          eoqRopService.getEoqRopAnalysis(),
        ]);
        setProducts(prodRes);
        setCategories(catRes);
        setBarangMasuk(bmRes);
        setBarangKeluar(bkRes);
        setEoqData(eoqRes);
      } catch (err) {
        console.error("Gagal memuat laporan", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReportData();
  }, []);

  // Summary figures
  const totalValuasiStok = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stokFisik * p.hargaBeli, 0);
  }, [products]);

  const totalBiayaMasuk = useMemo(() => {
    return barangMasuk.reduce((acc, b) => acc + b.totalBiaya, 0);
  }, [barangMasuk]);

  const totalUnitKeluar = useMemo(() => {
    return barangKeluar.reduce((acc, b) => acc + b.jumlah, 0);
  }, [barangKeluar]);

  // Filtered lists
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.kategoriId === selectedCategory);
  }, [products, selectedCategory]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeReportTab === "stok") {
      csvContent += "Kode,Nama Sparepart,Kategori,Lokasi Rak,Stok Fisik,Harga Beli,Total Nilai\n";
      filteredProducts.forEach((p) => {
        csvContent += `"${p.kode}","${p.nama}","${p.kategoriNama}","${p.lokasiRak}",${p.stokFisik},${p.hargaBeli},${
          p.stokFisik * p.hargaBeli
        }\n`;
      });
    } else if (activeReportTab === "masuk") {
      csvContent += "No Referensi,No Surat Jalan,Tanggal,Supplier,Sparepart,Jumlah,Harga Satuan,Total Biaya\n";
      barangMasuk.forEach((b) => {
        csvContent += `"${b.noReferensi}","${b.noSuratJalan}","${b.tanggal}","${b.supplierNama}","${b.sparepartNama}",${b.jumlah},${b.hargaBeliSatuan},${b.totalBiaya}\n`;
      });
    } else if (activeReportTab === "keluar") {
      csvContent += "No Transaksi,Tanggal,No Polisi,No SPK,Sparepart,Jumlah,Mekanik,Keperluan\n";
      barangKeluar.forEach((b) => {
        csvContent += `"${b.noTransaksi}","${b.tanggal}","${b.noPolisi}","${b.noSPK}","${b.sparepartNama}",${b.jumlah},"${b.mekanik}","${b.keperluan}"\n`;
      });
    } else {
      csvContent += "Kode,Nama Sparepart,Demand,Biaya Pesan,Biaya Simpan,Lead Time,Rata-rata Hari,EOQ,ROP,Stok,Status\n";
      eoqData.forEach((e) => {
        csvContent += `"${e.kode}","${e.namaSparepart}",${e.demand},${e.biayaPemesanan},${e.biayaPenyimpanan},${e.leadTime},${e.rataRataPenggunaanHari},${e.eoq},${e.rop},${e.stokSaatIni},"${e.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_bengkel_ryan_${activeReportTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with Print and Export Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileBarChart className="w-6 h-6 text-blue-600" />
              Pusat Pelaporan Inventaris Bengkel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi berkala valuasi aset persediaan, pergerakan barang masuk & keluar, serta audit pengendalian EOQ/ROP.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="shadow-xs">
              <Download className="w-4 h-4 mr-1.5" />
              Unduh CSV / Excel
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} className="shadow-xs">
              <Printer className="w-4 h-4 mr-1.5" />
              Cetak Laporan
            </Button>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Nilai Valuasi Persediaan"
            value={formatRupiah(totalValuasiStok)}
            subtext="Total nilai aset fisik di gudang saat ini"
            icon={<Boxes className="w-5 h-5" />}
            variant="blue"
          />
          <StatCard
            title="Total Pembelian (Barang Masuk)"
            value={formatRupiah(totalBiayaMasuk)}
            subtext={`${barangMasuk.length} faktur pengiriman distributor`}
            icon={<ArrowDownToLine className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Volume Pengeluaran Servis"
            value={`${formatNumber(totalUnitKeluar)} Unit`}
            subtext={`${barangKeluar.length} SPK perbaikan kendaraan`}
            icon={<ArrowUpFromLine className="w-5 h-5" />}
            variant="slate"
          />
        </div>

        {/* Report Tabs & Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Tabs
              tabs={[
                { id: "stok", label: "Laporan Stok & Valuasi", count: products.length },
                { id: "masuk", label: "Laporan Barang Masuk", count: barangMasuk.length },
                { id: "keluar", label: "Laporan Barang Keluar", count: barangKeluar.length },
                { id: "eoq", label: "Laporan Analisis EOQ & ROP", count: eoqData.length },
              ]}
              activeTab={activeReportTab}
              onChange={(id) => setActiveReportTab(id as "stok" | "masuk" | "keluar" | "eoq")}
            />

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {activeReportTab === "stok" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Kategori:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(activeReportTab === "masuk" || activeReportTab === "keluar") && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                  />
                  <span>s/d</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700"
                  />
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: Laporan Stok */}
          {activeReportTab === "stok" && (
            <div>
              {isLoading ? (
                <LoadingState message="Menyiapkan laporan persediaan..." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Sparepart</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Lokasi Rak</TableHead>
                      <TableHead className="text-center">Stok Fisik</TableHead>
                      <TableHead className="text-right">Harga Beli</TableHead>
                      <TableHead className="text-right">Harga Jual</TableHead>
                      <TableHead className="text-right">Total Nilai Persediaan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs font-semibold text-slate-700">
                          {item.kode}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 text-xs">
                          {item.nama}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{item.kategoriNama}</TableCell>
                        <TableCell className="text-xs text-slate-600">{item.lokasiRak}</TableCell>
                        <TableCell className="text-center font-bold text-xs text-blue-700">
                          {item.stokFisik} {item.satuan}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono text-slate-700">
                          {formatRupiah(item.hargaBeli)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono text-emerald-700">
                          {formatRupiah(item.hargaJual)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-mono font-bold text-slate-900">
                          {formatRupiah(item.stokFisik * item.hargaBeli)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-50 font-bold border-t-2 border-slate-300">
                      <TableCell colSpan={4} className="text-right text-xs uppercase text-slate-700">
                        Total Valuasi Nilai Persediaan:
                      </TableCell>
                      <TableCell className="text-center text-xs text-blue-800">
                        {filteredProducts.reduce((sum, p) => sum + p.stokFisik, 0)} Unit
                      </TableCell>
                      <TableCell colSpan={2} />
                      <TableCell className="text-right text-sm font-mono font-black text-blue-900">
                        {formatRupiah(
                          filteredProducts.reduce((sum, p) => sum + p.stokFisik * p.hargaBeli, 0)
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* TAB 2: Laporan Barang Masuk */}
          {activeReportTab === "masuk" && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Referensi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Sparepart</TableHead>
                    <TableHead className="text-center">Jumlah Masuk</TableHead>
                    <TableHead className="text-right">Harga Beli</TableHead>
                    <TableHead className="text-right">Total Biaya</TableHead>
                    <TableHead>Petugas Gudang</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barangMasuk.map((bm) => (
                    <TableRow key={bm.id}>
                      <TableCell className="font-mono text-xs font-semibold text-blue-700">
                        {bm.noReferensi}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-mono">
                        {formatDateIndo(bm.tanggal)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-800 font-medium">
                        {bm.supplierNama}
                      </TableCell>
                      <TableCell className="text-xs text-slate-900 font-semibold">
                        {bm.sparepartNama}
                      </TableCell>
                      <TableCell className="text-center font-bold text-xs text-emerald-700">
                        +{bm.jumlah}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono text-slate-700">
                        {formatRupiah(bm.hargaBeliSatuan)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-mono font-bold text-slate-900">
                        {formatRupiah(bm.totalBiaya)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{bm.penerima}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <TableCell colSpan={4} className="text-right text-xs uppercase text-slate-700">
                      Total Belanja Suku Cadang:
                    </TableCell>
                    <TableCell className="text-center text-xs text-emerald-800">
                      +{barangMasuk.reduce((sum, b) => sum + b.jumlah, 0)} Unit
                    </TableCell>
                    <TableCell />
                    <TableCell className="text-right text-sm font-mono font-black text-emerald-900">
                      {formatRupiah(totalBiayaMasuk)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB 3: Laporan Barang Keluar */}
          {activeReportTab === "keluar" && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Plat & SPK</TableHead>
                    <TableHead>Sparepart</TableHead>
                    <TableHead className="text-center">Jumlah Keluar</TableHead>
                    <TableHead>Mekanik</TableHead>
                    <TableHead>Keperluan Servis</TableHead>
                    <TableHead>Service Advisor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {barangKeluar.map((bk) => (
                    <TableRow key={bk.id}>
                      <TableCell className="font-mono text-xs font-semibold text-blue-700">
                        {bk.noTransaksi}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 font-mono">
                        {formatDateIndo(bk.tanggal)}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-900">
                        {bk.noPolisi} ({bk.noSPK})
                      </TableCell>
                      <TableCell className="text-xs text-slate-900">
                        {bk.sparepartNama}
                      </TableCell>
                      <TableCell className="text-center font-bold text-xs text-rose-700">
                        -{bk.jumlah}
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">{bk.mekanik}</TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                        {bk.keperluan}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{bk.pencatat}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50 font-bold border-t-2 border-slate-300">
                    <TableCell colSpan={4} className="text-right text-xs uppercase text-slate-700">
                      Total Pemakaian Servis:
                    </TableCell>
                    <TableCell className="text-center text-xs text-rose-800">
                      -{totalUnitKeluar} Unit
                    </TableCell>
                    <TableCell colSpan={3} />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* TAB 4: Laporan Analisis EOQ & ROP */}
          {activeReportTab === "eoq" && (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Sparepart</TableHead>
                    <TableHead className="text-right">Demand (D)</TableHead>
                    <TableHead className="text-center">Lead Time (L)</TableHead>
                    <TableHead className="text-center font-bold text-blue-700">EOQ (Pesan Optimal)</TableHead>
                    <TableHead className="text-center font-bold text-amber-800">ROP (Titik Pesan)</TableHead>
                    <TableHead className="text-center">Stok Fisik</TableHead>
                    <TableHead>Status Persediaan</TableHead>
                    <TableHead>Rekomendasi Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eoqData.map((item) => {
                    const isUnderRop = item.stokSaatIni <= item.rop;
                    return (
                      <TableRow key={item.id} className={isUnderRop ? "bg-amber-50/30" : undefined}>
                        <TableCell className="font-mono text-xs font-semibold text-slate-700">
                          {item.kode}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 text-xs">
                          {item.namaSparepart}
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium text-slate-700">
                          {formatNumber(item.demand)} unit
                        </TableCell>
                        <TableCell className="text-center text-xs font-medium text-slate-700">
                          {item.leadTime} hari
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs text-blue-700">
                          {item.eoq} unit
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs text-amber-800">
                          {item.rop} unit
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs">
                          {item.stokSaatIni} unit
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                              isUnderRop
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">
                          {isUnderRop ? (
                            <strong className="text-blue-700 font-semibold">
                              Pesan segera {item.eoq} unit
                            </strong>
                          ) : (
                            <span className="text-slate-500">Stok mencukupi</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
