"use client";

import React from "react";
import Image from "next/image";
import {
  DollarSign,
  ShieldCheck,
  Cpu,
  MessageCircle,
  PhoneCall,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function WhyChooseUs() {
  const features = [
    {
      title: "Transparansi Biaya & Estimasi di Awal",
      desc: "Tidak ada penggantian suku cadang tanpa persetujuan Anda terlebih dahulu. Segala estimasi dijelaskan detail.",
      icon: <DollarSign className="w-5 h-5 text-orange-500" />,
    },
    {
      title: "Jaminan Garansi Servis & Part Asli",
      desc: "Kami memberikan garansi servis 7 hari dan jaminan uang kembali jika suku cadang terbukti tidak orisinil.",
      icon: <ShieldCheck className="w-5 h-5 text-orange-500" />,
    },
    {
      title: "Alat Scanner Injeksi & Diagnosa Modern",
      desc: "Mendeteksi masalah sensor injeksi, error ECU, dan kalibrasi sistem bahan bakar motor secara presisi dan ilmiah.",
      icon: <Cpu className="w-5 h-5 text-orange-500" />,
    },
    {
      title: "Respon Cepat Konsultasi WhatsApp",
      desc: "Owner dan mekanik langsung melayani tanya jawab keluhan motor Anda kapan saja dengan ramah dan solutif.",
      icon: <MessageCircle className="w-5 h-5 text-orange-500" />,
    },
  ];

  return (
    <section id="keunggulan" className="bg-slate-50 py-16 lg:py-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Features List (Matches mms.png "Why Choose Us?") */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1.5">
                • KEUNGGULAN UTAMA KAMI •
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Mengapa Pengendara Mempercayakan Motornya Pada MMS Garage?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Kami menggabungkan keahlian mekanik berpengalaman dengan teknologi manajemen suku cadang presisi untuk hasil pengerjaan terbaik.
              </p>
            </div>

            <div className="space-y-5">
              {features.map((f, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Motorcycle Action Visual & Hotline Callout (From mms.png) */}
          <div className="lg:col-span-6 relative">
            {/* Signature Orange Backdrop Shape from mms.png */}
            <div className="absolute top-6 right-0 w-4/5 h-4/5 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-3xl -rotate-2 -z-0 opacity-90 hidden sm:block" />

            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] group bg-slate-900">
              <Image
                src="/images/motorcycle-action.jpg"
                alt="Motor Performa Tinggi MMS Garage"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Callout Hotline Bottom Banner (Matches mms.png "Need any help ? +71 202 102 2124") */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 backdrop-blur-md p-4 rounded-2xl border border-orange-500/40 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-orange-400 font-bold uppercase tracking-wider block">
                    Butuh Bantuan / Motor Bermasalah?
                  </span>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-mono font-extrabold text-white hover:text-emerald-400 transition-colors block"
                  >
                    +62 812-3456-7890
                  </a>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
