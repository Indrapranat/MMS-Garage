"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function BrandShowcase() {
  const brands = [
    { name: "HONDA", sub: "AHM Genuine Parts", color: "hover:text-rose-600" },
    { name: "YAMAHA", sub: "Yamalube Genuine", color: "hover:text-blue-600" },
    { name: "SUZUKI", sub: "SGP Genuine Parts", color: "hover:text-blue-700" },
    { name: "KAWASAKI", sub: "Genuine Parts", color: "hover:text-emerald-600" },
    { name: "FEDERAL OIL", sub: "Official Partner", color: "hover:text-red-600" },
    { name: "MICHELIN", sub: "Tire Technology", color: "hover:text-amber-600" },
    { name: "NGK SPARK", sub: "Japan Technology", color: "hover:text-yellow-600" },
  ];

  return (
    <section className="bg-white py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Curved Orange Banner - Matches mms.png "Explore Our Premium Brands" */}
        <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden mb-8 text-white">
          {/* Decorative subtle curves */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-300/20 rounded-full blur-lg pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-100 block mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-white" />
                KEMITRAAN & SUKU CADANG RESMI
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Penyedia Resmi Suku Cadang Asli Yamaha, Honda, & Suzuki
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 mt-2">
                Seluruh suku cadang fast-moving dan slow-moving terdaftar resmi dengan barcode asli, bebas dari produk rekondisi atau tiruan berbahaya.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="https://wa.me/6281234567890?text=Halo%20MMS%20Garage,%20saya%20ingin%20tanya%20ketersediaan%20stok%20sparepart%20resmi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold shadow-lg transition-all hover:scale-105"
              >
                <span>TANYA KETERSEDIAAN PART</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Brand Logos Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-center justify-items-center opacity-85">
          {brands.map((b, idx) => (
            <div
              key={idx}
              className="p-3 text-center rounded-xl bg-slate-50 border border-slate-200/80 w-full hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-300 cursor-default"
            >
              <span className="text-sm sm:text-base font-extrabold tracking-wider font-mono text-slate-800 block">
                {b.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block mt-0.5 truncate">
                {b.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
