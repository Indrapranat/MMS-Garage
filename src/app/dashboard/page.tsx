"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LoadingState } from "@/components/shared/LoadingState";
import { reportService } from "@/services/reportService";
import { eoqRopService } from "@/services/eoqRopService";
import { formatRupiah, formatNumber } from "@/lib/formatters";
import { DashboardSummary, MonthlyUsageChart, StockVsRopChart } from "@/types/report";
import { EoqRopAnalysis } from "@/types/eoqRop";
import {
  Package,
  Boxes,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [usageData, setUsageData] = useState<MonthlyUsageChart[]>([]);
  const [stockVsRopData, setStockVsRopData] = useState<StockVsRopChart[]>([]);
  const [urgentItems, setUrgentItems] = useState<EoqRopAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        const [sumRes, usageRes, stockRopRes, eoqRes] = await Promise.all([
          reportService.getDashboardSummary(),
          reportService.getMonthlyUsageChart(),
          reportService.getStockVsRopChart(),
          eoqRopService.getEoqRopAnalysis(),
        ]);

        setSummary(sumRes);
        setUsageData(usageRes);
        setStockVsRopData(stockRopRes);
        // Ambil item yang stok <= ROP untuk widget urgent
        const urgent = eoqRes.filter((item) => item.stokSaatIni <= item.rop);
        setUrgentItems(urgent);
      } catch (error) {
        console.error("Gagal memuat data dashboard", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading || !summary) {
    return (
      <AppLayout>
        <LoadingState message="Memuat metrik dashboard inventory..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-6 rounded-2xl text-white shadow-sm border border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-500/30 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Sistem Pengendalian Persediaan Bengkel
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Dashboard Kontrol Persediaan & Analisis EOQ - ROP
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Pantau perputaran suku cadang, identifikasi batas kritis pemesanan ulang (ROP), dan optimalkan kuantitas pemesanan ekonomis (EOQ) secara presisi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/rekomendasi">
              <Button variant="warning" size="sm" className="shadow-sm">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Rekomendasi Pesan ({summary.jumlahRekomendasiPengadaan})
              </Button>
            </Link>
            <Link href="/barang-masuk">
              <Button variant="primary" size="sm" className="shadow-sm">
                <ArrowDownToLine className="w-4 h-4 mr-1.5" />
                Catat Barang Masuk
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sparepart"
            value={formatNumber(summary.totalSparepart)}
            subtext="Item terdaftar dalam katalog"
            icon={<Package className="w-5 h-5" />}
            variant="blue"
            trend={{ value: "+15 item", isPositive: true }}
          />
          <StatCard
            title="Total Stok Fisik"
            value={formatNumber(summary.totalStok)}
            subtext={`Valuasi: ${formatRupiah(summary.totalNilaiPersediaan)}`}
            icon={<Boxes className="w-5 h-5" />}
            variant="emerald"
          />
          <StatCard
            title="Stok Di Bawah ROP"
            value={formatNumber(summary.barangDiBawahRop)}
            subtext="Mencapai titik pemesanan kembali"
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="amber"
          />
          <StatCard
            title="Rekomendasi Pengadaan"
            value={formatNumber(summary.jumlahRekomendasiPengadaan)}
            subtext="Segera lakukan Purchase Order (PO)"
            icon={<ShoppingCart className="w-5 h-5" />}
            variant="rose"
          />
        </div>

        {/* Section Charts: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Tren Penggunaan Sparepart */}
          <Card className="lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Tren Penggunaan & Penerimaan Sparepart
                </CardTitle>
                <CardDescription>
                  Volume unit barang keluar (servis) vs barang masuk 6 bulan terakhir
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="keluarColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="masukColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "8px",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Area
                      type="monotone"
                      dataKey="totalPengeluaranUnit"
                      name="Barang Keluar (Unit)"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#keluarColor)"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalMasukUnit"
                      name="Barang Masuk (Unit)"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#masukColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Chart 2: Perbandingan Stok Saat Ini vs ROP */}
          <Card className="lg:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Perbandingan Stok vs ROP
                </CardTitle>
                <CardDescription>
                  Sampel status buffer stok terhadap batas ROP
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockVsRopData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="nama"
                      tickLine={false}
                      axisLine={false}
                      angle={-30}
                      textAnchor="end"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#cbd5e1",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="top" wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }} />
                    <Bar dataKey="stokSaatIni" name="Stok Saat Ini" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rop" name="Batas ROP" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Reorder Table: Daftar Sparepart Yang Perlu Segera Dipesan */}
        <Card className="border-amber-200 bg-white">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-2 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <CardTitle className="text-base">
                  Daftar Sparepart Yang Perlu Segera Dipesan (Stok ≤ ROP)
                </CardTitle>
              </div>
              <CardDescription className="mt-1">
                Suku cadang berikut telah mencapai atau melewati batas reorder point dan disarankan segera dipesan sebesar EOQ.
              </CardDescription>
            </div>
            <Link href="/rekomendasi">
              <Button variant="outline" size="sm" className="text-xs border-amber-300 hover:bg-amber-50 text-amber-800">
                Lihat Semua Rekomendasi
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Sparepart</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">Stok Saat Ini</TableHead>
                  <TableHead className="text-center">Batas ROP</TableHead>
                  <TableHead className="text-center">Kuantitas EOQ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rekomendasi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urgentItems.slice(0, 5).map((item) => {
                  const isCritical = item.stokSaatIni <= item.safetyStock;
                  return (
                    <TableRow key={item.id} className="hover:bg-amber-50/40">
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {item.kode}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-900 block">{item.namaSparepart}</span>
                        <span className="text-[11px] text-slate-500">Supplier: {item.supplierNama}</span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{item.kategori}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            isCritical
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {item.stokSaatIni} unit
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-medium text-slate-700 text-xs">
                        {item.rop} unit
                      </TableCell>
                      <TableCell className="text-center font-bold text-blue-700 text-xs">
                        {item.eoq} unit
                      </TableCell>
                      <TableCell>
                        <Badge variant={isCritical ? "danger" : "warning"} size="sm">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                          Pesan {item.eoq} unit
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href="/rekomendasi">
                          <Button size="sm" variant="primary" className="h-7 text-xs px-2.5">
                            Proses PO
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
