import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-xs text-slate-500">
      <div>
        Menampilkan <span className="font-semibold text-slate-800">{startItem}</span> -{" "}
        <span className="font-semibold text-slate-800">{endItem}</span> dari{" "}
        <span className="font-semibold text-slate-800">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Sebelumnya
        </Button>

        <div className="flex items-center gap-1 px-2">
          <span className="text-slate-700 font-medium">{currentPage}</span>
          <span className="text-slate-400">/</span>
          <span>{Math.max(1, totalPages)}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
