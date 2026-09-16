import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10",
    warning: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10",
    danger: "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10",
    info: "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/10",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded-md",
    md: "px-2.5 py-1 text-xs font-medium rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
