"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Bambang Triyono",
      motor: "Honda Vario 160 ABS",
      review:
        "Keluhan gredeg parah di tarikan awal Vario saya tuntas bersih setelah servis CVT di MMS Garage. Mekaniknya teliti, part yang diganti ditunjukkan fisiknya, dan biayanya sangat transparan.",
      rating: 5,
      date: "Servis 2 Minggu Lalu",
    },
    {
      name: "Rizky Ramadhan",
      motor: "Yamaha NMAX 155 Connected",
      review:
        "Suka banget sama pelayanan di sini. Sparepart Yamalube-nya terjamin 100% asli ada barcode resmi. Bisa konsultasi dulu lewat WhatsApp sebelum bawa motor ke bengkel, jadi gak perlu antre.",
      rating: 5,
      date: "Servis 1 Bulan Lalu",
    },
    {
      name: "Dedi Setiawan",
      motor: "Suzuki Satria F150 Fi",
      review:
        "Susah nyari bengkel yang ngerti setelan injeksi Suzuki Satria Fi di daerah sini. Di MMS Garage ada alat diagnosa komputernya langsung, tarikan motor kembali responsif dan halus. Recommended!",
      rating: 5,
      date: "Servis 3 Minggu Lalu",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 block mb-1.5">
            • TESTIMONI PELANGGAN •
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Apa Kata Para Pengendara Sepeda Motor?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Ulasan nyata dari pemilik motor yang merasakan langsung kepuasan servis dan keaslian suku cadang kami.
          </p>
        </div>

        {/* 3 Testimonial Cards matching mms.png style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {/* Quote Icon from mms.png */}
                  <Quote className="w-7 h-7 text-orange-200 group-hover:text-orange-400 transition-colors" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-orange-500/20">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <span className="text-[11px] text-orange-600 font-semibold block">
                    {rev.motor}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {rev.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
