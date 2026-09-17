"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Search, FileCheck, CheckCircle2, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Booking / Chat WhatsApp",
      desc: "Hubungi WhatsApp kami, sebutkan tipe motor dan kendala yang dirasakan untuk kami siapkan mekanik.",
      icon: <MessageCircle className="w-5 h-5 text-orange-500" />,
    },
    {
      number: "02",
      title: "Pemeriksaan & Diagnosa",
      desc: "Mekanik ahli memeriksa kondisi fisik, sistem pengereman, CVT, atau scan error injeksi secara menyeluruh.",
      icon: <Search className="w-5 h-5 text-orange-500" />,
    },
    {
      number: "03",
      title: "Konfirmasi Estimasi Biaya",
      desc: "Kami infokan rincian part yang perlu diganti dan estimasi biayanya. Pengerjaan baru dimulai setelah Anda setuju.",
      icon: <FileCheck className="w-5 h-5 text-orange-500" />,
    },
    {
      number: "04",
      title: "Motor Prima Bergaransi",
      desc: "Uji coba jalan sebelum penyerahan unit. Dapatkan jaminan garansi servis dan performa motor kembali maksimal.",
      icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />,
    },
  ];

  return (
    <section id="alur" className="bg-white py-16 lg:py-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1.5">
            • ALUR SERVIS MUDAH & CEPAT •
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            4 Langkah Praktis Perawatan Motor di MMS Garage
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Proses sistematis tanpa antre berjam-jam, transparan dari awal hingga serah terima kunci.
          </p>
        </div>

        {/* 4 Steps Grid - Matches mms.png "Following Working Steps" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Black Number Box Badge from mms.png */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-950 text-white font-mono font-extrabold text-xl flex items-center justify-center shadow-md group-hover:bg-orange-600 transition-colors">
                  {step.number}
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-orange-600 transition-colors">
                <span>Tahap {idx + 1} dari 4</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Showcase Spareparts (Replacing car image in mms.png) */}
        <div className="mt-14 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[21/9] sm:aspect-[24/8] bg-slate-900 group">
          <Image
            src="/images/spareparts-showcase.jpg"
            alt="Suku Cadang Asli MMS Garage"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent pointer-events-none" />

          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-lg z-10 text-white">
            <span className="text-[11px] font-bold tracking-wider uppercase text-orange-400 block mb-1">
              • READY STOCK SPAREPART RESMI •
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Stok Selalu Terkendali dengan Sistem Manajemen Mutakhir
            </h3>
            <p className="text-xs text-slate-300 mt-2 hidden sm:block">
              Tidak perlu khawatir menunggu pesanan part lama. Fast-moving spareparts motor Yamaha, Honda, dan Suzuki selalu siap di workshop kami.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
