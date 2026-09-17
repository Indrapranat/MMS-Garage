"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function FloatingWhatsApp({
  phoneNumber = "6281234567890",
  defaultMessage = "Halo MMS Garage, saya ingin konsultasi mengenai servis motor / ketersediaan sparepart",
}: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  // Tampilkan tooltip secara berkala atau setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Tooltip / Speech Bubble */}
      {showTooltip && (
        <div className="mb-3 mr-1 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-200 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="font-semibold text-slate-800">
              Konsultasi Langsung dengan Owner Bengkel?
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            aria-label="Tutup pesan"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Circular WhatsApp Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 hover:scale-110 active:scale-95"
        title="Chat via WhatsApp"
        aria-label="Chat WhatsApp Owner"
      >
        {/* Ripple Pulse Rings */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 relative z-10" />

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white" />
      </a>
    </div>
  );
}
