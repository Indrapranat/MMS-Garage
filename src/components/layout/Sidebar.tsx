"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Calculator,
  AlertCircle,
  FileBarChart,
  Wrench,
} from "lucide-react";

interface SidebarProps {
  reorderAlertCount?: number;
}

export function Sidebar({ reorderAlertCount = 7 }: SidebarProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      label: "UTAMA",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "MASTER DATA",
      items: [
        {
          name: "Data Sparepart",
          href: "/sparepart",
          icon: Package,
        },
        {
          name: "Kategori Sparepart",
          href: "/kategori",
          icon: Layers,
        },
        {
          name: "Supplier",
          href: "/supplier",
          icon: Truck,
        },
      ],
    },
    {
      label: "OPERASIONAL GUDANG",
      items: [
        {
          name: "Barang Masuk",
          href: "/barang-masuk",
          icon: ArrowDownToLine,
        },
        {
          name: "Barang Keluar",
          href: "/barang-keluar",
          icon: ArrowUpFromLine,
        },
        {
          name: "Stok & Opname",
          href: "/stok",
          icon: Boxes,
        },
      ],
    },
    {
      label: "METODE & KONTROL",
      items: [
        {
          name: "Analisis EOQ & ROP",
          href: "/analisis-eoq-rop",
          icon: Calculator,
        },
        {
          name: "Rekomendasi Pengadaan",
          href: "/rekomendasi",
          icon: AlertCircle,
          badge: reorderAlertCount > 0 ? reorderAlertCount : undefined,
          badgeVariant: "amber",
        },
      ],
    },
    {
      label: "PELAPORAN",
      items: [
        {
          name: "Laporan",
          href: "/laporan",
          icon: FileBarChart,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/40 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Wrench className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <h1 className="font-bold text-sm text-white tracking-wide">BENGKEL RYAN</h1>
          <p className="text-[11px] text-blue-400 font-medium tracking-tight">Inventory EOQ & ROP</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-500 tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-blue-600 text-white shadow-xs font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                          isActive
                            ? "bg-white text-blue-700"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="text-[11px] font-medium">Status Metode</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Aktif
          </span>
        </div>
        <p className="text-[10px] text-slate-500">
          EOQ (Economic Order Quantity) & ROP (Reorder Point)
        </p>
      </div>
    </aside>
  );
}
