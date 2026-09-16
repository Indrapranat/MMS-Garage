"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, AlertTriangle, ChevronRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  urgentItemsCount?: number;
}

export function Topbar({ urgentItemsCount = 7 }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Branch & Global Search */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
          <Store className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-800">Bengkel Ryan</span>
          <span className="text-slate-400">•</span>
          <span>Pusat Workshop & Gudang Sukun</span>
        </div>

        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari sparepart, kode, supplier..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification / Alert popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Peringatan Stok"
          >
            <Bell className="w-5 h-5" />
            {urgentItemsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-800">Peringatan ROP</span>
                </div>
                <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  {urgentItemsCount} Item
                </span>
              </div>

              <p className="text-slate-500 my-3 leading-relaxed">
                Terdapat <strong className="text-slate-800">{urgentItemsCount} sparepart</strong> dengan stok fisik berada pada atau di bawah batas Reorder Point (ROP).
              </p>

              <Link
                href="/rekomendasi"
                onClick={() => setShowNotifications(false)}
                className="block"
              >
                <Button size="sm" variant="warning" className="w-full text-xs">
                  Buka Rekomendasi Pengadaan
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            RY
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Ryan Admin</p>
            <p className="text-[10px] text-slate-400 font-medium">Kepala Operasional & Gudang</p>
          </div>
        </div>
      </div>
    </header>
  );
}
