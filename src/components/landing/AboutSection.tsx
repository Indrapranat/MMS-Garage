"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ArrowRight, ShieldAlert, Award, Sparkles } from "lucide-react";

export function AboutSection() {
  const points = [
    "Servis Terbuka untuk Semua Jenis Motor (Matic, Bebek, Sport, Kopling)",
    "Peralatan Diagnosa Injeksi Komputer & Scanner ECU Mutakhir",
    "Jaminan 100% Suku Cadang Orisinil Langsung Dari Distributor Resmi",
    "Mekanik Jujur, Teliti, dan Memberikan Estimasi Biaya di Awal",
  ];

  return (
    <section id="tentang" className="bg-slate-50 py-16 lg:py-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Workshop Photo with "SINCE 2016" vertical label (From mms.png) */}
          <div className="lg:col-span-6 relative">
            {/* Vertical Year Stamp from mms.png */}
            <div className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -rotate-90 origin-center mb-6">
                ESTABLISHED
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-orange-500 font-mono -rotate-90 origin-center tracking-tighter">
                2016
              </span>
            </div>

            {/* Main Image Container */}
            <div className="relative ml-0 sm:ml-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group">
              <Image
                src="/images/mechanic-workshop.jpg"
                alt="Mekanik Ahli MMS Garage"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Standar Servis Presisi & Terpercaya
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Lebih dari 5.000 sepeda motor telah dirawat dengan prima
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1.5">
                • TENTANG MMS GARAGE •
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Membantu Ribuan Pengendara Merawat Motor Kesayangan Sejak 2016
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              MMS Garage didirikan dengan satu komitmen utama: <strong>kejujuran teknisi dan keaslian suku cadang</strong>. Kami memahami bahwa sepeda motor adalah urat nadi mobilitas harian Anda, mulai dari berangkat kerja, mengantar keluarga, hingga usaha harian.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Didukung oleh sistem manajemen persediaan modern dan alat scanner injeksi digital, kami memastikan setiap penggantian part dilakukan secara transparan, tepat sasaran, dan tanpa biaya siluman.
            </p>

            {/* Checklist with signature orange icons */}
            <div className="space-y-3 pt-2">
              {points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/6281234567890?text=Halo%20MMS%20Garage,%20saya%20ingin%20tahu%20lebih%20lanjut%20tentang%20layanan%20servis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
              >
                <span>KONSULTASI BERSAMA OWNER</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </a>

              <span className="text-xs text-slate-500">
                Pengerjaan cepat & estimasi transparan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
