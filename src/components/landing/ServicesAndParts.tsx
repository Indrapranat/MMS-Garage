"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatRupiah } from "@/lib/formatters";

export function ServicesAndParts() {
  const [activeTab, setActiveTab] = useState<"servis" | "sparepart">("servis");

  const promoCards = [
    {
      title: "Estimasi Jujur di Awal",
      desc: "Konsultasikan kerusakan, kami berikan rincian biaya tanpa biaya tersembunyi.",
      icon: <Wrench className="w-5 h-5 text-orange-500" />,
    },
    {
      title: "Garansi Part 100% Asli",
      desc: "Distribusi resmi Yamaha, Honda, dan Suzuki. Bebas dari suku cadang palsu.",
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
    },
    {
      title: "Bantuan Darurat & Jemput",
      desc: "Motor mogok di jalan sekitar bengkel? Hubungi kami untuk bantuan penjemputan.",
      icon: <Truck className="w-5 h-5 text-orange-500" />,
    },
  ];

  const serviceItems = [
    {
      name: "Paket Tune-Up Injeksi & Reset ECU",
      category: "Perawatan Berkala",
      price: 65000,
      duration: "45 Menit",
      desc: "Pembersihan Throttle Body, kalibrasi sensor injeksi, pembersihan busi & filter udara.",
      features: ["Scanner ECU Digital", "Reset DTC Error", "Pembersih Carbon Chamber"],
    },
    {
      name: "Servis CVT Matic Super Smooth",
      category: "Transmisi Matic",
      price: 85000,
      duration: "60 Menit",
      desc: "Mengatasi gredeg tarikan awal, pembersihan mangkok kopling, cek roller & greasing baru.",
      features: ["Grease CVT High Temp", "Cek Keausan V-Belt", "Pembersihan Pulley Depan/Belakang"],
    },
    {
      name: "Servis Pengereman & Ganti Kampas",
      category: "Sistem Keamanan",
      price: 45000,
      duration: "30 Menit",
      desc: "Pembersihan kaliper, bleeding minyak rem dot 4, dan penyetelan pengereman presisi.",
      features: ["Bleeding Minyak Rem", "Pembersihan Debu Kaliper", "Pemeriksaan Piringan Cakram"],
    },
    {
      name: "Overhaul Mesin / Turun Mesin",
      category: "Perbaikan Berat",
      price: 350000,
      duration: "1-2 Hari",
      desc: "Penanganan motor ngebul, ganti seher/ring piston, skir klep, dan ganti packing komplit.",
      features: ["Pengukuran Presisi", "Pembersihan Ruang Bakar", "Garansi Mesin 30 Hari"],
    },
  ];

  const sparepartItems = [
    {
      name: "Oli Mesin Yamalube Silver 0.8L",
      brand: "Yamaha OEM",
      price: 48000,
      stockStatus: "Ready Stock",
      desc: "Oli pelumas mesin motor 4-tak standar pabrikan Yamaha untuk perlindungan maksimal.",
    },
    {
      name: "Kampas Rem Depan Vario / Beat",
      brand: "Honda AHM",
      price: 52000,
      stockStatus: "Ready Stock",
      desc: "Kampas rem cakram orisinil Astra Honda Motor dengan daya cengkeram optimal.",
    },
    {
      name: "V-Belt & Roller Set NMAX 155",
      brand: "Yamaha Genuine",
      price: 185000,
      stockStatus: "Ready Stock",
      desc: "Paket sabuk transmisi CVT asli Yamaha untuk performa akselerasi responsif.",
    },
    {
      name: "Busi Iridium NGK CR7HIX",
      brand: "NGK Japan",
      price: 45000,
      stockStatus: "Ready Stock",
      desc: "Busi elektroda iridium untuk pengapian lebih fokus, responsif, dan hemat bahan bakar.",
    },
  ];

  const handleBooking = (itemName: string) => {
    const text = encodeURIComponent(
      `Halo MMS Garage, saya ingin menanyakan / booking untuk: ${itemName}. Apakah slot pengerjaan atau stoknya tersedia?`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <section id="layanan" className="bg-white py-16 lg:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Strip 3 Dark Promo Cards from mms.png ("ONE STEP TOWARDS YOU") */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 block mb-1">
              • KOMITMEN KAMI UNTUK ANDA •
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kenyamanan Servis Tanpa Rasa Khawatir
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoCards.map((c, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl flex items-start gap-4 hover:border-orange-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <div className="text-white">{c.icon}</div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog Section Header with Tabs */}
        <div id="sparepart" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1.5">
                • PILIHAN TERBAIK UNTUK MOTOR ANDA •
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Katalog Layanan Servis & Suku Cadang Orisinil
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Seluruh pengerjaan dikerjakan oleh mekanik berpengalaman dengan alat diagnostik presisi.
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("servis")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "servis"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Paket Layanan Servis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sparepart")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "sparepart"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Suku Cadang Populer
              </button>
            </div>
          </div>

          {/* Cards Grid: Matching Arch Shape Cards from mms.png */}
          {activeTab === "servis" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Arch Shape Banner */}
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white rounded-t-3xl overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/15 px-2.5 py-1 rounded-full border border-orange-500/30">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        {item.duration}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[11px] text-slate-400 block font-medium">Biaya Servis Mulai</span>
                      <span className="text-2xl font-extrabold text-orange-400 font-mono">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                        {item.features.map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBooking(item.name)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Booking Jadwal Servis</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sparepartItems.map((part, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Arch Shape Banner */}
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white rounded-t-3xl overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/15 px-2.5 py-1 rounded-full border border-orange-500/30">
                        {part.brand}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        {part.stockStatus}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[11px] text-slate-400 block font-medium">Harga Resmi</span>
                      <span className="text-2xl font-extrabold text-orange-400 font-mono">
                        {formatRupiah(part.price)}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {part.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {part.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleBooking(part.name)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Pesan Suku Cadang</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
