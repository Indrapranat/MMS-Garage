"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  Search,
  MessageCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
} from "lucide-react";

export function HeroSection() {
  const [selectedBrand, setSelectedBrand] = useState("Honda");
  const [motorModel, setMotorModel] = useState("Vario 125/160");
  const [serviceType, setServiceType] = useState("Servis Berkala & Tune Up");
  const [pickupDate, setPickupDate] = useState("");

  const brandOptions = [
    { id: "Honda", name: "Honda", icon: "🔴" },
    { id: "Yamaha", name: "Yamaha", icon: "🔵" },
    { id: "Suzuki", name: "Suzuki", icon: "🔷" },
    { id: "Kawasaki", name: "Kawasaki", icon: "🟢" },
  ];

  const modelOptions: Record<string, string[]> = {
    Honda: ["Vario 125/160", "Beat FI / Street", "Scoopy eSP", "PCX 160", "ADV 160", "CBR 150R/250RR"],
    Yamaha: ["NMAX 155 Connected", "Aerox 155", "Mio M3 / Gear 125", "Fazzio / Grand Filano", "R15 / R25", "Jupiter Z1 / MX King"],
    Suzuki: ["Satria F150 Fi", "GSX-R150 / GSX-S150", "Address FI", "Nex II", "Burgman Street 125"],
    Kawasaki: ["Ninja 250 FI", "KLX 150 / D-Tracker", "W175 SE", "ZX-25R 4-Cylinder"],
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setMotorModel(modelOptions[brand]?.[0] || "");
  };

  const handleConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    const dateText = pickupDate ? ` pada tanggal ${pickupDate}` : "";
    const message = encodeURIComponent(
      `Halo MMS Garage, saya ingin konsultasi / booking jadwal:\n- Merek: ${selectedBrand}\n- Model Motor: ${motorModel}\n- Kebutuhan: ${serviceType}${dateText}\nApakah ada slot jadwal mekanik atau stok suku cadangnya ready?`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <section id="beranda" className="relative bg-slate-950 text-white overflow-hidden pt-6 pb-16 lg:py-20 border-b border-slate-900">
      {/* Subtle Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Interactive Widget */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Spesialis Servis & Suku Cadang Motor Terpercaya</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Perawatan Presisi Motor Anda,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Sparepart 100% Original
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              MMS Garage melayani servis berkala, tune-up injeksi modern, servis CVT matic, hingga penggantian suku cadang resmi untuk pabrikan <strong>Yamaha, Honda, dan Suzuki</strong> dengan jaminan transparansi biaya.
            </p>

            {/* Quick Estimate / Booking Widget (MMS Reference Style) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-orange-500" />
                  Estimasi Servis & Cek Ketersediaan Sparepart
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready Stock
                </span>
              </div>

              {/* Brand Selector Tabs */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {brandOptions.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBrandChange(b.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 border ${
                      selectedBrand === b.id
                        ? "bg-gradient-to-br from-orange-600 to-amber-600 border-orange-500 text-white shadow-md shadow-orange-600/20"
                        : "bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    <span className="text-sm">{b.icon}</span>
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>

              {/* Form Controls */}
              <form onSubmit={handleConsultation} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Model / Tipe Motor
                    </label>
                    <select
                      value={motorModel}
                      onChange={(e) => setMotorModel(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {(modelOptions[selectedBrand] || []).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Jenis Pekerjaan / Servis
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Servis Berkala & Tune Up">Servis Berkala & Tune Up</option>
                      <option value="Servis CVT Matic Lengkap">Servis CVT Matic Lengkap</option>
                      <option value="Ganti Oli Mesin & Gardan">Ganti Oli Mesin & Gardan</option>
                      <option value="Ganti Kampas Rem Depan/Belakang">Ganti Kampas Rem Depan/Belakang</option>
                      <option value="Ganti Ban Luar / Dalam">Ganti Ban Luar / Dalam Tubeless</option>
                      <option value="Overhaul Mesin / Turun Mesin">Overhaul Mesin / Turun Mesin</option>
                      <option value="Beli Sparepart Saja">Beli Suku Cadang Saja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Rencana Tanggal Servis (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>KONSULTASI & CEK JADWAL VIA WHATSAPP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Hero Visual Motorcycle (From MMS Reference) */}
          <div className="lg:col-span-6 relative">
            {/* Price Badge Overlay */}
            <div className="absolute top-4 right-4 z-20 bg-slate-900/90 border border-orange-500/40 rounded-xl p-3 shadow-xl backdrop-blur-md hidden sm:block">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Paket Servis Mulai</span>
              <span className="text-lg font-extrabold text-orange-400 font-mono">Rp 45.000</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Garansi 7 Hari Kerja</span>
            </div>

            {/* Motorcycle Main Image */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <Image
                src="/images/hero-motorcycle.jpg"
                alt="MMS Garage Motor Sport Servis"
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Feature Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">100% Suku Cadang Asli</span>
                    <span className="text-[10px] text-slate-400">Yamaha, Honda, Suzuki OEM</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block leading-tight">Mekanik Berpengalaman</span>
                    <span className="text-[10px] text-slate-400">Alat Diagnosa Digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
