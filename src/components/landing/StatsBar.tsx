"use client";

import React from "react";
import { Wrench, Users, PackageCheck, Award } from "lucide-react";

export function StatsBar() {
  const stats = [
    {
      value: "5.200+",
      label: "Motor Tertangani",
      desc: "Servis rutin, tune-up & perbaikan berat",
      icon: <Wrench className="w-5 h-5 text-orange-500" />,
    },
    {
      value: "3.100+",
      label: "Pelanggan Puas",
      desc: "Kepercayaan pengendara motor se-Tangerang",
      icon: <Users className="w-5 h-5 text-orange-500" />,
    },
    {
      value: "850+",
      label: "Item Sparepart Asli",
      desc: "Katalog suku cadang siap pasang",
      icon: <PackageCheck className="w-5 h-5 text-orange-500" />,
    },
    {
      value: "10+",
      label: "Tahun Dedikasi",
      desc: "Mekanik handal & bersertifikasi",
      icon: <Award className="w-5 h-5 text-orange-500" />,
    },
  ];

  return (
    <section className="bg-white py-14 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1.5">
            • DEDIKASI LAYANAN & PERFORMA TERUJI •
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bengkel Motor Pilihan dengan Standar Kerja Presisi
          </h2>
        </div>

        {/* 4 Cards Grid - Matches mms.png layout with signature curved orange top-left corner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              {/* Signature Orange Corner Accent from mms.png */}
              <div className="absolute top-0 left-0 w-12 h-12">
                <div className="w-full h-full bg-orange-500 rounded-br-2xl" />
                <div className="absolute inset-0.5 bg-white rounded-br-xl" />
                <div className="absolute top-0 left-0 w-4 h-4 bg-orange-500 rounded-br-lg" />
              </div>

              <div className="flex items-center justify-between mb-4 pl-4">
                <span className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">#0{idx + 1}</span>
              </div>

              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight group-hover:text-orange-600 transition-colors">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-slate-800 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
