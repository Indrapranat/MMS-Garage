"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  ArrowUp,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const waOwnerUrl =
    "https://wa.me/6281234567890?text=Halo%20MMS%20Garage,%20saya%20ingin%20tanya%20info%20bengkel";

  return (
    <footer id="kontak" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                  MMS <span className="text-orange-500">GARAGE</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase block font-semibold mt-0.5">
                  Motorcycle Care & Spareparts
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bengkel sepeda motor profesional berstandar presisi dengan jaminan suku cadang 100% original Yamaha, Honda, dan Suzuki. Transparansi biaya dan kepuasan pelanggan adalah prioritas kami.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Jl. Raya Bengkel Motor No. 8, Tangerang, Banten</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>kontak@mmsgarage.id</span>
              </div>
            </div>
          </div>

          {/* Col 2: Jam Operasional */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block">Senin - Jumat</span>
                <span>08.00 - 17.00 WIB</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="font-semibold text-white block">Sabtu</span>
                <span>08.00 - 16.00 WIB</span>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-orange-400 block">Minggu / Hari Libur</span>
                <span>Khusus Perjanjian & Konsultasi WA</span>
              </div>
            </div>
          </div>

          {/* Col 3: Layanan Unggulan */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#layanan" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Tune-Up Injeksi
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Servis CVT Matic
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Ganti Oli & Filter
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Sistem Pengereman
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-orange-500" />
                  Turun Mesin
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Tipe Motor & Akses Cepat */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Akses Cepat
            </h4>
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Bagi staf dan administrator bengkel untuk mengelola persediaan suku cadang:
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition-all w-full justify-center"
              >
                <Wrench className="w-4 h-4" />
                <span>Masuk Sistem Inventori Bengkel</span>
              </Link>
              <a
                href={waOwnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Owner via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MMS Garage. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Spesialis Sepeda Motor Yamaha • Honda • Suzuki</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-orange-600 text-slate-300 hover:text-white transition-colors border border-slate-800"
              title="Kembali ke atas"
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
