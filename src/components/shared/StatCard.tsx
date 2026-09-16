import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  variant?: "blue" | "amber" | "rose" | "emerald" | "slate";
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtext,
  icon,
  variant = "blue",
  trend,
  onClick,
}: StatCardProps) {
  const iconVariants = {
    blue: "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20",
    amber: "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20",
    rose: "bg-rose-50 text-rose-600 ring-1 ring-rose-500/20",
    emerald: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20",
    slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-400/20",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:border-slate-300"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
            {trend && (
              <span
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-rose-700 bg-rose-50"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-slate-500 pt-1">{subtext}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg flex items-center justify-center", iconVariants[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
