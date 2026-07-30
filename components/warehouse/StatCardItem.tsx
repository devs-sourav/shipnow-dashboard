"use client";

import { TrendingUp } from "lucide-react";
import { StatItem } from "@/types/warehouse";

interface Props {
  item: StatItem;
}

export default function StatCardItem({ item }: Props) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#F1F5F9]">
      <p className="text-sm font-medium text-[#8A8F98]">
        {item.title}
      </p>

      <div className="mt-2 flex items-end justify-between gap-4">
        {/* Left */}
        <div className="flex items-end gap-1">
          <h2 className="text-[20px] font-bold leading-none tracking-tight text-[#1F2937]">
            {item.value}
          </h2>

          {item.suffix && (
            <span className="text-xs font-medium text-[#757575]">
              {item.suffix}
            </span>
          )}
        </div>

        {/* Growth */}
        <div className="flex items-center gap-1 rounded-full bg-[#DFF7E8] px-3 py-1 text-xs font-semibold text-[#16A34A]">
          <TrendingUp size={12} strokeWidth={2.5} />
          {item.growth}
        </div>
      </div>
    </div>
  );
}